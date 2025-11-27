const axios = require("axios");
require("dotenv").config();

async function scanUrlWithVirusTotal(url) {
  const API_KEY = process.env.VIRUSTOTAL_KEY;

  try {
    // Submit URL for scanning
    const submit = await axios.post(
      "https://www.virustotal.com/api/v3/urls",
      `url=${encodeURIComponent(url)}`,
      {
        headers: {
          "x-apikey": API_KEY,
          "content-type": "application/x-www-form-urlencoded"
        }
      }
    );

    const scanId = submit.data.data.id;

    // Fetch scan results
    const result = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${scanId}`,
      {
        headers: { "x-apikey": API_KEY }
      }
    );

    const stats = result.data.data.attributes.stats;

    return {
      link: url,
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      harmless: stats.harmless,
      undetected: stats.undetected
    };

  } catch (err) {
    console.error("VirusTotal Error:", err.response?.data || err);
    return {
      link: url,
      error: true
    };
  }
}

module.exports = { scanUrlWithVirusTotal };
