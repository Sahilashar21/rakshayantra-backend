const axios = require("axios");

/**
 * Heuristic-based URL analysis
 * Detects suspicious patterns even if URL not in threat databases
 */

function analyzeUrlHeuristics(url) {
  let suspiciousScore = 0;
  const findings = [];

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    const fullUrl = url.toLowerCase();

    // 1. Suspicious TLDs (commonly used for phishing)
    const suspiciousTLDs = ['.ru', '.cn', '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.click'];
    if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
      suspiciousScore += 25;
      findings.push(`Suspicious TLD in domain: ${domain}`);
    }

    // 2. IP address instead of domain name
    if (/^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
      suspiciousScore += 30;
      findings.push("IP address used instead of domain name");
    }

    // 3. Typosquatting - common brand names with variations
    const brandPatterns = [
      { brand: 'paypal', patterns: ['paypa1', 'paypai', 'paypa-', 'paypall', 'pay-pal'] },
      { brand: 'amazon', patterns: ['arnazon', 'amazom', 'amaz0n', 'arriazon'] },
      { brand: 'google', patterns: ['googlé', 'googie', 'goog1e', 'gooogle'] },
      { brand: 'microsoft', patterns: ['rnicrosoft', 'micros0ft', 'microsft'] },
      { brand: 'apple', patterns: ['app1e', 'appie', 'appl3'] },
      { brand: 'facebook', patterns: ['faceb00k', 'facebok', 'facebk'] },
      { brand: 'instagram', patterns: ['instagrarn', 'instagramm', 'instgrm'] },
      { brand: 'netflix', patterns: ['netfliix', 'netflx', 'netf1ix'] },
      { brand: 'bank', patterns: ['b4nk', 'bankk', 'bsnk'] },
      // Indian Banks - Critical for India
      { brand: 'sbi', patterns: ['sbi-', 'sbionline-', 'sbi-secure', 'sbi-verify', 'sbi-login', 'securesbi', 'sbisecure'] },
      { brand: 'hdfc', patterns: ['hdfc-', 'hdfcbank-', 'hdfc-secure', 'hdfc-verify', 'secure-hdfc'] },
      { brand: 'icici', patterns: ['icici-', 'icicbank-', 'icici-secure', 'icici-verify', 'secure-icici'] },
      { brand: 'axis', patterns: ['axis-', 'axisbank-', 'axis-secure', 'axis-verify', 'secure-axis'] },
      { brand: 'kotak', patterns: ['kotak-', 'kotakbank-', 'kotak-secure', 'kotak-verify'] },
      { brand: 'yes', patterns: ['yesbank-', 'yes-bank-', 'yes-secure', 'yesbank-login'] },
      { brand: 'aadhar', patterns: ['aadhar-', 'aadhaar-', 'aadhar-verify', 'aadhar-update', 'verify-aadhar'] },
      { brand: 'pan', patterns: ['pan-', 'pancard-', 'pan-verify', 'pan-update', 'verify-pan'] }
    ];

    for (const { brand, patterns } of brandPatterns) {
      if (patterns.some(p => domain.includes(p))) {
        suspiciousScore += 40;
        findings.push(`Potential typosquatting of "${brand}"`);
        break;
      }
    }

    // 4. Excessive subdomains (e.g., login.secure.paypal.fake.com)
    const subdomainCount = domain.split('.').length - 2;
    if (subdomainCount > 3) {
      suspiciousScore += 20;
      findings.push(`Excessive subdomains (${subdomainCount})`);
    }

    // 5. Suspicious keywords in URL
    const phishingKeywords = [
      'verify', 'account', 'secure', 'login', 'signin', 'update', 'confirm',
      'suspend', 'restore', 'alert', 'urgent', 'security', 'banking',
      'wallet', 'payment', 'billing'
    ];
    
    let keywordMatches = 0;
    phishingKeywords.forEach(keyword => {
      if (fullUrl.includes(keyword)) {
        keywordMatches++;
      }
    });

    if (keywordMatches >= 3) {
      suspiciousScore += 25;
      findings.push(`Multiple phishing keywords (${keywordMatches} found)`);
    } else if (keywordMatches >= 2) {
      suspiciousScore += 15;
      findings.push(`Suspicious keywords in URL (${keywordMatches} found)`);
    }

    // 6. Suspicious domain patterns
    if (domain.includes('--') || domain.includes('..')) {
      suspiciousScore += 20;
      findings.push("Unusual domain separators");
    }

    // 7. URL shorteners (can hide malicious destinations)
    const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly'];
    if (shorteners.some(s => domain.includes(s))) {
      suspiciousScore += 20;
      findings.push("URL shortener detected (destination hidden)");
    }

    // 8. Misleading domain structure (e.g., paypal-secure.malicious.com)
    const trustedBrands = ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'bank', 'chase', 'wellsfargo', 'sbi', 'hdfc', 'icici', 'axis', 'kotak', 'yes', 'aadhar'];
    trustedBrands.forEach(brand => {
      // If brand name appears but not as main domain - STRONG indicator of spoofing
      if (domain.includes(brand) && !domain.includes(`.${brand}.com`) && !domain.endsWith(`${brand}.com`)) {
        suspiciousScore += 40;  // Increased score
        findings.push(`Misleading use of "${brand}" in domain - Possible spoofing`);
      }
    });

    // 9. Domain spoofing patterns (e.g., sbi-secure-check.in looks like SBI but isn't)
    const spoofingPatterns = [
      // Pattern: brand-word.non-official-tld (e.g., sbi-secure.in, hdfc-verify.co.in)
      /^[a-z0-9]*(sbi|hdfc|icici|axis|kotak|yesbank|aadhar)[-_][a-z0-9]*(secure|verify|login|check|update|confirm|account|banking)[-a-z0-9]*\.(in|co\.in|io|net|org|info|biz|top|xyz)$/,
      // Pattern: secure/verify + brand name + non-official domain
      /^(secure|verify|login|update|confirm|account|banking)?[-_]?(sbi|hdfc|icici|axis|kotak|yesbank|aadhar)[-a-z0-9]*(\.(in|co\.in|io|net|org|info|biz|top|xyz))$/
    ];
    
    if (spoofingPatterns.some(pattern => pattern.test(domain))) {
      suspiciousScore += 50;  // Very high score for spoofing
      findings.push("Domain spoofing detected - Imitates legitimate bank/service");
    }

    // 9. HTTPS with suspicious domain (false sense of security)
    if (urlObj.protocol === 'https:' && suspiciousScore > 30) {
      findings.push("Uses HTTPS but domain is still suspicious");
    }

    // 10. Excessive URL length (common in encoded phishing URLs)
    if (url.length > 150) {
      suspiciousScore += 10;
      findings.push(`Unusually long URL (${url.length} characters)`);
    }

    // 11. Contains @ symbol (often used to hide real destination)
    if (url.includes('@')) {
      suspiciousScore += 30;
      findings.push("URL contains @ symbol (authentication bypass technique)");
    }

    // 12. Base64 or encoded strings in URL
    if (/[A-Za-z0-9+/=]{40,}/.test(url) || url.includes('%2F') || url.includes('%3A')) {
      suspiciousScore += 15;
      findings.push("Encoded or obfuscated content in URL");
    }

    // Cap score at 100
    suspiciousScore = Math.min(suspiciousScore, 100);

    return {
      score: suspiciousScore,
      verdict: suspiciousScore >= 60 ? "MALICIOUS" : suspiciousScore >= 30 ? "SUSPICIOUS" : "SAFE",
      findings: findings,
      recommendation: suspiciousScore >= 60 
        ? "DO NOT CLICK - High risk of phishing/malware"
        : suspiciousScore >= 30
        ? "Exercise caution - Verify legitimacy before clicking"
        : "URL appears safe based on heuristics"
    };

  } catch (err) {
    return {
      score: 0,
      verdict: "ERROR",
      findings: ["Invalid URL format"],
      recommendation: "Unable to analyze"
    };
  }
}

module.exports = { analyzeUrlHeuristics };
