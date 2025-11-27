const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

async function scanFileWithVirusTotal(buffer, filename) {
  const API_KEY = process.env.VIRUSTOTAL_KEY;

  try {
    const form = new FormData();
    form.append("file", buffer, { filename });

    // 1) Upload file to VirusTotal
    const uploadRes = await axios.post(
      "https://www.virustotal.com/api/v3/files",
      form,
      {
        headers: {
          "x-apikey": API_KEY,
          ...form.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    const analysisId = uploadRes.data.data.id;

    // 2) Fetch analysis result
    const analysisRes = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: { "x-apikey": API_KEY }
      }
    );

    const stats = analysisRes.data.data.attributes.stats;

    return {
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      harmless: stats.harmless,
      undetected: stats.undetected
    };

  } catch (err) {
    console.error("VirusTotal File Scan Error:", err.response?.data || err);
    return {
      error: true
    };
  }
}

module.exports = { scanFileWithVirusTotal };
