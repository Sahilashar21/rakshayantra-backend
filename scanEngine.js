const axios = require("axios");
require("dotenv").config();
const { checkUrlSafety } = require("./safeBrowsing");
const { scanUrlWithVirusTotal } = require("./virusTotal");
const { scanFileWithVirusTotal } = require("./virusTotalFile");

/**
 * 4-LAYER PROTECTION SYSTEM
 * Layer 1: LLM Analysis (Groq)
 * Layer 2: Safe Browsing API
 * Layer 3: VirusTotal (URLs + Files)
 * Layer 4: Docker Sandbox (Behavioral Analysis)
 */

// Layer 1: LLM-based content analysis
async function analyzWithLLM(emailContent, subject, sender) {
  const GROQ_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_KEY) {
    return {
      layer: 1,
      name: "LLM Analysis",
      status: "SKIPPED",
      reason: "GROQ_API_KEY not configured",
      score: 0
    };
  }

  try {
    const prompt = `Analyze this email for phishing, scams, and malicious intent:
    
Subject: ${subject}
From: ${sender}
Content Preview: ${emailContent.substring(0, 500)}

Respond in JSON format:
{
  "is_suspicious": boolean,
  "risk_score": 0-100,
  "reasons": [list of concerns],
  "phishing_indicators": [list of detected phishing signs],
  "confidence": "high" | "medium" | "low"
}`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content);

    return {
      layer: 1,
      name: "LLM Analysis (Groq)",
      status: result.is_suspicious ? "THREAT_DETECTED" : "SAFE",
      score: result.risk_score,
      confidence: result.confidence,
      reasons: result.reasons,
      phishing_indicators: result.phishing_indicators
    };
  } catch (err) {
    console.error("LLM Analysis Error:", err.message);
    return {
      layer: 1,
      name: "LLM Analysis",
      status: "ERROR",
      reason: err.message,
      score: 0
    };
  }
}

// Layer 2: Safe Browsing
async function scanLayer2_SafeBrowsing(links) {
  const results = [];

  for (const link of links) {
    const result = await checkUrlSafety(link);
    results.push({
      url: link,
      safe: result.safe,
      threat: result.threat || null
    });
  }

  return {
    layer: 2,
    name: "Safe Browsing API",
    status: results.some(r => !r.safe) ? "THREAT_DETECTED" : "SAFE",
    results
  };
}

// Layer 3: VirusTotal
async function scanLayer3_VirusTotal(links, attachments = []) {
  const urlResults = [];
  const fileResults = [];

  // Scan URLs
  for (const link of links) {
    const result = await scanUrlWithVirusTotal(link);
    urlResults.push({
      url: link,
      malicious: result.malicious || 0,
      suspicious: result.suspicious || 0,
      harmless: result.harmless || 0,
      undetected: result.undetected || 0
    });
  }

  // Scan attached files (if hashes available)
  for (const file of attachments) {
    if (file.hash) {
      const result = await scanFileWithVirusTotal(file.hash);
      fileResults.push({
        filename: file.filename,
        hash: file.hash,
        malicious: result.malicious || 0,
        suspicious: result.suspicious || 0
      });
    }
  }

  const hasThreats = urlResults.some(r => r.malicious > 0) || fileResults.some(f => f.malicious > 0);

  return {
    layer: 3,
    name: "VirusTotal",
    status: hasThreats ? "THREAT_DETECTED" : "SAFE",
    urls: urlResults,
    files: fileResults
  };
}

// Layer 4: Docker Sandbox (Simulated - actual execution would run in Docker)
async function scanLayer4_Docker(email, links, attachments = []) {
  // In production, this would actually spin up a Docker container
  // For now, we'll return a structured response
  
  return {
    layer: 4,
    name: "Docker Sandbox",
    status: "ANALYSIS_PENDING",
    note: "Docker sandbox analysis requires containerization setup",
    targets: {
      email_analysis: {
        type: "email",
        behavior_checks: [
          "clipboard_access",
          "registry_modifications",
          "network_connections",
          "file_operations"
        ]
      },
      attachments: attachments.map(a => ({
        filename: a.filename,
        behavior_checks: [
          "execution",
          "dll_injection",
          "privilege_escalation",
          "c2_communication"
        ]
      })),
      links: links.map(l => ({
        url: l,
        behavior_checks: [
          "redirect_chains",
          "javascript_execution",
          "resource_loading",
          "form_injection"
        ]
      }))
    }
  };
}

// Complete 4-layer scan
async function runFullSecurityScan(emailData) {
  const startTime = Date.now();

  try {
    // Extract email components
    const { subject, from, body, links = [], attachments = [] } = emailData;

    console.log(`🔍 Starting 4-layer scan for: "${subject}"`);

    // Layer 1: LLM Analysis
    const layer1 = await analyzWithLLM(body, subject, from);

    // Layer 2: Safe Browsing
    const layer2 = await scanLayer2_SafeBrowsing(links);

    // Layer 3: VirusTotal
    const layer3 = await scanLayer3_VirusTotal(links, attachments);

    // Layer 4: Docker Sandbox
    const layer4 = await scanLayer4_Docker(emailData, links, attachments);

    // Calculate overall risk score
    const riskScores = [
      layer1.score || 0,
      (layer2.status === "THREAT_DETECTED" ? 75 : 0),
      (layer3.status === "THREAT_DETECTED" ? 85 : 0),
      (layer4.status === "THREAT_DETECTED" ? 90 : 0)
    ];

    const averageRiskScore = Math.round(riskScores.reduce((a, b) => a + b) / riskScores.length);

    // Determine final verdict
    let finalVerdict = "SAFE";
    if (averageRiskScore >= 70) finalVerdict = "DANGEROUS";
    else if (averageRiskScore >= 40) finalVerdict = "SUSPICIOUS";

    const scanReport = {
      scanId: `scan_${Date.now()}`,
      timestamp: new Date().toISOString(),
      email: {
        subject,
        from,
        preview: body.substring(0, 100)
      },
      layers: [layer1, layer2, layer3, layer4],
      riskScore: averageRiskScore,
      verdict: finalVerdict,
      scanDuration: Date.now() - startTime,
      summaryReasons: [
        ...((layer1.phishing_indicators || []).slice(0, 2)),
        ...(layer2.results || []).filter(r => !r.safe).map(r => `Safe Browsing detected: ${r.threat}`),
        ...(layer3.urls || []).filter(u => u.malicious > 0).map(u => `VT flagged ${u.malicious} engines`),
      ]
    };

    return scanReport;

  } catch (err) {
    console.error("Full scan error:", err);
    return {
      error: true,
      message: err.message,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  runFullSecurityScan,
  analyzWithLLM,
  scanLayer2_SafeBrowsing,
  scanLayer3_VirusTotal,
  scanLayer4_Docker
};
