const axios = require("axios");
require("dotenv").config();

async function checkUrlSafety(url) {
  const API_KEY = process.env.SAFE_BROWSING_KEY;

  const body = {
    client: {
      clientId: "rakshyantra",
      clientVersion: "1.0.0"
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }]
    }
  };

  try {
    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
      body
    );

    if (response.data && response.data.matches) {
      return {
        safe: false,
        threat: response.data.matches[0].threatType
      };
    }

    return { safe: true };
  } catch (err) {
    console.error("Safe Browsing Error:", err);
    return { safe: true, error: true };
  }
}

module.exports = { checkUrlSafety };
