// // // // // // const express = require("express");
// // // // // // const cors = require("cors");
// // // // // // const authRoutes = require("./auth");
// // // // // // const { getEmails } = require("./gmail");

// // // // // // const app = express();

// // // // // // // IMPORTANT: allow only frontend origin
// // // // // // app.use(cors({
// // // // // //   origin: "http://localhost:3000",
// // // // // //   credentials: true
// // // // // // }));

// // // // // // app.use("/auth", authRoutes);

// // // // // // // GET REAL EMAILS
// // // // // // app.get("/emails", async (req, res) => {
// // // // // //   try {
// // // // // //     if (!global.oAuthClient)
// // // // // //       return res.status(401).json({ error: "Not authenticated" });

// // // // // //     const inbox = await getEmails(global.oAuthClient);
// // // // // //     res.json(inbox);
// // // // // //   } catch (e) {
// // // // // //     console.log(e);
// // // // // //     res.status(500).json({ error: "Failed to fetch emails" });
// // // // // //   }
// // // // // // });

// // // // // // app.listen(5000, () => console.log("Server running on port 5000"));


// // // // // const express = require("express");
// // // // // const cors = require("cors");
// // // // // const authRoutes = require("./auth");
// // // // // const { getEmails } = require("./gmail");
// // // // // const { google } = require("googleapis");
// // // // // const { extractLinks } = require("./extractLinks");

// // // // // const app = express();

// // // // // // FIXED CORS (required for React)
// // // // // app.use(cors({
// // // // //   origin: "http://localhost:3000",
// // // // //   credentials: true
// // // // // }));

// // // // // app.use("/auth", authRoutes);


// // // // // // ============================================
// // // // // // GET FAST INBOX (only headers, loads quickly)
// // // // // // ============================================

// // // // // app.get("/emails", async (req, res) => {
// // // // //   try {
// // // // //     if (!global.oAuthClient)
// // // // //       return res.status(401).json({ error: "Not authenticated" });

// // // // //     const inbox = await getEmails(global.oAuthClient);
// // // // //     res.json(inbox);
// // // // //   } catch (e) {
// // // // //     console.log(e);
// // // // //     res.status(500).json({ error: "Failed to fetch emails" });
// // // // //   }
// // // // // });


// // // // // // ============================================
// // // // // // GET FULL EMAIL + LINK EXTRACTION
// // // // // // ============================================

// // // // // app.get("/email/:id", async (req, res) => {
// // // // //   try {
// // // // //     if (!global.oAuthClient)
// // // // //       return res.status(401).json({ error: "Not authenticated" });

// // // // //     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

// // // // //     const email = await gmail.users.messages.get({
// // // // //       userId: "me",
// // // // //       id: req.params.id,
// // // // //       format: "full"
// // // // //     });

// // // // //     // Extract plain text body
// // // // //     let body = "";
// // // // //     const parts = email.data.payload.parts;

// // // // //     if (parts) {
// // // // //       const textPart = parts.find(p => p.mimeType === "text/plain");
// // // // //       if (textPart?.body?.data) {
// // // // //         body = Buffer.from(textPart.body.data, "base64").toString();
// // // // //       }
// // // // //     }

// // // // //     // Extract clean links
// // // // //     const links = await extractLinks(body);

// // // // //     res.json({
// // // // //       headers: email.data.payload.headers,
// // // // //       snippet: email.data.snippet,
// // // // //       body,
// // // // //       links
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.log(error);
// // // // //     res.status(500).json({ error: "Failed to load full email" });
// // // // //   }
// // // // // });


// // // // // // ============================================
// // // // // // START SERVER
// // // // // // ============================================

// // // // // app.listen(5000, () => console.log("Server running on port 5000"));


// // // // const express = require("express");
// // // // const cors = require("cors");
// // // // const authRoutes = require("./auth");
// // // // const { getEmails } = require("./gmail");
// // // // const { google } = require("googleapis");
// // // // const { extractLinks } = require("./extractLinks");

// // // // const app = express();

// // // // // Allow React frontend
// // // // app.use(cors({
// // // //   origin: "http://localhost:3000",
// // // //   credentials: true
// // // // }));

// // // // // Google OAuth Routes
// // // // app.use("/auth", authRoutes);


// // // // // ============================================
// // // // // FAST INBOX — loads 20 most recent emails
// // // // // ============================================

// // // // app.get("/emails", async (req, res) => {
// // // //   try {
// // // //     if (!global.oAuthClient) {
// // // //       return res.status(401).json({ error: "Not authenticated" });
// // // //     }

// // // //     const inbox = await getEmails(global.oAuthClient);
// // // //     res.json(inbox);

// // // //   } catch (err) {
// // // //     console.error("Inbox Fetch Error:", err);
// // // //     res.status(500).json({ error: "Failed to fetch emails" });
// // // //   }
// // // // });


// // // // // ============================================
// // // // // FULL EMAIL LOADER (body + links)
// // // // // Handles HTML, nested MIME, etc.
// // // // // ============================================

// // // // // Helps extract body from nested parts
// // // // const walkParts = (parts) => {
// // // //   let body = "";

// // // //   for (let part of parts) {

// // // //     // Extract plain text
// // // //     if (part.mimeType === "text/plain" && part.body?.data) {
// // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // //     }

// // // //     // Extract HTML
// // // //     if (part.mimeType === "text/html" && part.body?.data) {
// // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // //     }

// // // //     // Recursively handle nested parts
// // // //     if (part.parts) {
// // // //       body += walkParts(part.parts);
// // // //     }
// // // //   }

// // // //   return body;
// // // // };


// // // // app.get("/email/:id", async (req, res) => {
// // // //   try {
// // // //     if (!global.oAuthClient) {
// // // //       return res.status(401).json({ error: "Not authenticated" });
// // // //     }

// // // //     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

// // // //     const email = await gmail.users.messages.get({
// // // //       userId: "me",
// // // //       id: req.params.id,
// // // //       format: "full"
// // // //     });

// // // //     const payload = email.data.payload;
// // // //     const { checkUrlSafety } = require("./safeBrowsing");
// // // //     // Extract body (HTML + text + nested)
// // // //     let body = "";

// // // //     if (payload.parts) {
// // // //       body = walkParts(payload.parts);
// // // //     } else if (payload.body?.data) {
// // // //       body = Buffer.from(payload.body.data, "base64").toString();
// // // //     }

// // // //     // Extract clean & expanded links
// // // //     const links = await extractLinks(body);

// // // //     res.json({
// // // //       headers: payload.headers,
// // // //       snippet: email.data.snippet,
// // // //       body,
// // // //       links
// // // //     });

// // // //   } catch (err) {
// // // //     console.error("Full Email Error:", err);
// // // //     res.status(500).json({ error: "Failed to load email" });
// // // //   }
// // // // });


// // // // // ============================================
// // // // // START SERVER
// // // // // ============================================

// // // // app.listen(5000, () => {
// // // //   console.log("Server running on port 5000");
// // // // });


// // // const express = require("express");
// // // const cors = require("cors");
// // // const authRoutes = require("./auth");
// // // const { getEmails } = require("./gmail");
// // // const { google } = require("googleapis");
// // // const { extractLinks } = require("./extractLinks");
// // // const { checkUrlSafety } = require("./safeBrowsing");

// // // const app = express();

// // // // CORS SETTINGS (Required for React)
// // // app.use(cors({
// // //   origin: "http://localhost:3000",
// // //   credentials: true
// // // }));

// // // // Google OAuth Routes
// // // app.use("/auth", authRoutes);


// // // // ================================
// // // // FAST INBOX (Loads only 20 emails)
// // // // ================================
// // // app.get("/emails", async (req, res) => {
// // //   try {
// // //     if (!global.oAuthClient) {
// // //       return res.status(401).json({ error: "Not authenticated" });
// // //     }

// // //     const inbox = await getEmails(global.oAuthClient);
// // //     res.json(inbox);

// // //   } catch (err) {
// // //     console.error("Inbox Fetch Error:", err);
// // //     res.status(500).json({ error: "Failed to fetch emails" });
// // //   }
// // // });


// // // // =====================================================
// // // // RECURSIVE BODY EXTRACTOR (Handles HTML, text, nested)
// // // // =====================================================
// // // const walkParts = (parts) => {
// // //   let body = "";

// // //   for (let part of parts) {

// // //     // Extract plain text
// // //     if (part.mimeType === "text/plain" && part.body?.data) {
// // //       body += Buffer.from(part.body.data, "base64").toString();
// // //     }

// // //     // Extract HTML
// // //     if (part.mimeType === "text/html" && part.body?.data) {
// // //       body += Buffer.from(part.body.data, "base64").toString();
// // //     }

// // //     // Nested parts (very common)
// // //     if (part.parts) {
// // //       body += walkParts(part.parts);
// // //     }
// // //   }

// // //   return body;
// // // };


// // // // =====================================================
// // // // FULL EMAIL LOADER + LINK EXTRACTION + SAFE BROWSING
// // // // =====================================================
// // // app.get("/email/:id", async (req, res) => {
// // //   try {
// // //     if (!global.oAuthClient) {
// // //       return res.status(401).json({ error: "Not authenticated" });
// // //     }

// // //     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

// // //     const email = await gmail.users.messages.get({
// // //       userId: "me",
// // //       id: req.params.id,
// // //       format: "full"
// // //     });

// // //     const payload = email.data.payload;

// // //     // Extract body
// // //     let body = "";
// // //     if (payload.parts) {
// // //       body = walkParts(payload.parts);
// // //     } else if (payload.body?.data) {
// // //       body = Buffer.from(payload.body.data, "base64").toString();
// // //     }

// // //     // Extract URLs from body
// // //     const links = await extractLinks(body);

// // //     // Scan all links with Google Safe Browsing
// // //     let scanResults = [];
// // //     for (let link of links) {
// // //       const scan = await checkUrlSafety(link);
// // //       scanResults.push(scan);
// // //     }

// // //     // Final response
// // //     return res.json({
// // //       headers: payload.headers,
// // //       snippet: email.data.snippet,
// // //       body,
// // //       links,
// // //       scans: scanResults
// // //     });

// // //   } catch (err) {
// // //     console.error("Email Load Error:", err);
// // //     res.status(500).json({ error: "Failed to load email" });
// // //   }
// // // });


// // // // ================================
// // // // START SERVER
// // // // ================================
// // // app.listen(5000, () => {
// // //   console.log("Server running on port 5000");
// // // });


// // const express = require("express");
// // const cors = require("cors");
// // const authRoutes = require("./auth");
// // const { getEmails } = require("./gmail");
// // const { google } = require("googleapis");
// // const { extractLinks } = require("./extractLinks");
// // const { checkUrlSafety } = require("./safeBrowsing");
// // const { scanUrlWithVirusTotal } = require("./virusTotal");

// // const app = express();

// // app.use(cors({
// //   origin: "http://localhost:3000",
// //   credentials: true
// // }));

// // app.use("/auth", authRoutes);

// // // FAST inbox (20 emails)
// // app.get("/emails", async (req, res) => {
// //   try {
// //     if (!global.oAuthClient)
// //       return res.status(401).json({ error: "Not authenticated" });

// //     const inbox = await getEmails(global.oAuthClient);
// //     res.json(inbox);

// //   } catch (err) {
// //     console.error("Inbox Error:", err);
// //     res.status(500).json({ error: "Failed to fetch emails" });
// //   }
// // });

// // // Extract body from nested MIME parts
// // const walkParts = (parts) => {
// //   let body = "";

// //   for (let part of parts) {

// //     if (part.mimeType === "text/plain" && part.body?.data) {
// //       body += Buffer.from(part.body.data, "base64").toString();
// //     }

// //     if (part.mimeType === "text/html" && part.body?.data) {
// //       body += Buffer.from(part.body.data, "base64").toString();
// //     }

// //     if (part.parts) {
// //       body += walkParts(part.parts);
// //     }
// //   }

// //   return body;
// // };

// // // Load full email + links + VirusTotal + SafeBrowsing
// // app.get("/email/:id", async (req, res) => {
// //   try {
// //     if (!global.oAuthClient)
// //       return res.status(401).json({ error: "Not authenticated" });

// //     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

// //     const email = await gmail.users.messages.get({
// //       userId: "me",
// //       id: req.params.id,
// //       format: "full"
// //     });

// //     const payload = email.data.payload;

// //     let body = "";

// //     if (payload.parts) {
// //       body = walkParts(payload.parts);
// //     } else if (payload.body?.data) {
// //       body = Buffer.from(payload.body.data, "base64").toString();
// //     }

// //     const links = await extractLinks(body);

// //     let scanResults = [];

// //     for (let link of links) {
// //       const safeResults = await checkUrlSafety(link);
// //       const vtResults = await scanUrlWithVirusTotal(link);

// //       scanResults.push({
// //         link,
// //         googleSafe: safeResults.safe,
// //         googleThreat: safeResults.threat,
// //         vtMalicious: vtResults.malicious,
// //         vtSuspicious: vtResults.suspicious,
// //         vtHarmless: vtResults.harmless
// //       });
// //     }

// //     res.json({
// //       headers: payload.headers,
// //       snippet: email.data.snippet,
// //       body,
// //       links,
// //       scans: scanResults
// //     });

// //   } catch (err) {
// //     console.error("Email Error:", err);
// //     res.status(500).json({ error: "Failed to load email" });
// //   }
// // });

// // app.listen(5000, () => {
// //   console.log("Server running on port 5000");
// // });


// const express = require("express");
// const cors = require("cors");
// const authRoutes = require("./auth");
// const { getEmails } = require("./gmail");
// const { google } = require("googleapis");
// const { extractLinks } = require("./extractLinks");
// const { checkUrlSafety } = require("./safeBrowsing");
// const { scanUrlWithVirusTotal } = require("./virusTotal");
// const { scanFileWithVirusTotal } = require("./virusTotalFile");

// const app = express();

// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));

// app.use("/auth", authRoutes);

// // ================================
// // FAST INBOX (20 emails)
// // ================================
// app.get("/emails", async (req, res) => {
//   try {
//     if (!global.oAuthClient)
//       return res.status(401).json({ error: "Not authenticated" });

//     const inbox = await getEmails(global.oAuthClient);
//     res.json(inbox);

//   } catch (err) {
//     console.error("Inbox Error:", err);
//     res.status(500).json({ error: "Failed to fetch emails" });
//   }
// });

// // ================================
// // Helper: extract body from nested parts
// // ================================
// const walkParts = (parts) => {
//   let body = "";

//   for (let part of parts) {

//     if (part.mimeType === "text/plain" && part.body?.data) {
//       body += Buffer.from(part.body.data, "base64").toString();
//     }

//     if (part.mimeType === "text/html" && part.body?.data) {
//       body += Buffer.from(part.body.data, "base64").toString();
//     }

//     if (part.parts) {
//       body += walkParts(part.parts);
//     }
//   }

//   return body;
// };

// // ================================
// // Helper: find attachments in email
// // ================================
// const collectAttachments = (parts, attachments = []) => {
//   for (let part of parts) {
//     if (part.filename && part.body && part.body.attachmentId) {
//       attachments.push({
//         filename: part.filename,
//         mimeType: part.mimeType,
//         size: part.body.size,
//         attachmentId: part.body.attachmentId
//       });
//     }
//     if (part.parts) {
//       collectAttachments(part.parts, attachments);
//     }
//   }
//   return attachments;
// };

// // Decode base64url safely
// const decodeBase64Url = (data) => {
//   data = data.replace(/-/g, "+").replace(/_/g, "/");
//   return Buffer.from(data, "base64");
// };

// // ================================
// // FULL EMAIL: body + links + URL scans + ATTACHMENT scans
// // ================================
// app.get("/email/:id", async (req, res) => {
//   try {
//     if (!global.oAuthClient)
//       return res.status(401).json({ error: "Not authenticated" });

//     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

//     const email = await gmail.users.messages.get({
//       userId: "me",
//       id: req.params.id,
//       format: "full"
//     });

//     const payload = email.data.payload;

//     // 1) BODY (HTML + text)
//     let body = "";
//     if (payload.parts) {
//       body = walkParts(payload.parts);
//     } else if (payload.body?.data) {
//       body = Buffer.from(payload.body.data, "base64").toString();
//     }

//     // 2) LINKS + URL SCANS
//     const links = await extractLinks(body);
//     let urlScans = [];

//     for (let link of links) {
//       const safeResult = await checkUrlSafety(link);
//       const vtResult = await scanUrlWithVirusTotal(link);

//       urlScans.push({
//         link,
//         googleSafe: safeResult.safe,
//         googleThreat: safeResult.threat,
//         vtMalicious: vtResult.malicious,
//         vtSuspicious: vtResult.suspicious,
//         vtHarmless: vtResult.harmless
//       });
//     }

//     // 3) ATTACHMENTS DETECTION
//     let attachments = [];
//     if (payload.parts) {
//       attachments = collectAttachments(payload.parts);
//     }

//     // 4) ATTACHMENT SCANNING (limit to 2 to keep it fast)
//     let attachmentScans = [];
//     for (let i = 0; i < Math.min(attachments.length, 2); i++) {
//       const att = attachments[i];

//       const attRes = await gmail.users.messages.attachments.get({
//         userId: "me",
//         messageId: req.params.id,
//         id: att.attachmentId
//       });

//       const fileBuffer = decodeBase64Url(attRes.data.data);

//       const vtFileResult = await scanFileWithVirusTotal(fileBuffer, att.filename);

//       attachmentScans.push({
//         filename: att.filename,
//         mimeType: att.mimeType,
//         size: att.size,
//         vtMalicious: vtFileResult.malicious,
//         vtSuspicious: vtFileResult.suspicious,
//         vtHarmless: vtFileResult.harmless
//       });
//     }

//     res.json({
//       snippet: email.data.snippet,
//       body,
//       links,
//       urlScans,
//       attachments,
//       attachmentScans
//     });

//   } catch (err) {
//     console.error("Full Email Error:", err);
//     res.status(500).json({ error: "Failed to load email" });
//   }
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

require("dotenv").config();

const authRoutes = require("./auth");
const { getEmails } = require("./gmail");

const { extractLinks } = require("./extractLinks");
const { checkUrlSafety } = require("./safeBrowsing");
const { scanUrlWithVirusTotal } = require("./virusTotal");
const { scanFileWithVirusTotal } = require("./virusTotalFile");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use("/auth", authRoutes);

// ------------------------------
// INBOX FETCH (FAST)
// ------------------------------
app.get("/emails", async (req, res) => {
  try {
    if (!global.oAuthClient) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const inbox = await getEmails(global.oAuthClient);
    res.json(inbox);

  } catch (err) {
    console.error("INBOX ERROR:", err);
    res.status(500).json({ error: "Failed to fetch inbox" });
  }
});

// ------------------------------
// HELPERS
// ------------------------------

// Recursively extract email body (HTML or text)
const walkParts = (parts) => {
  let body = "";
  for (let part of parts) {
    if (part.mimeType === "text/plain" && part.body?.data) {
      body += Buffer.from(part.body.data, "base64").toString();
    }
    if (part.mimeType === "text/html" && part.body?.data) {
      body += Buffer.from(part.body.data, "base64").toString();
    }
    if (part.parts) {
      body += walkParts(part.parts);
    }
  }
  return body;
};

// Find attachments
const collectAttachments = (parts, result = []) => {
  for (let part of parts) {
    if (part.filename && part.body?.attachmentId) {
      result.push({
        filename: part.filename,
        mimeType: part.mimeType,
        size: part.body.size,
        attachmentId: part.body.attachmentId
      });
    }
    if (part.parts) {
      collectAttachments(part.parts, result);
    }
  }
  return result;
};

// Decode gmail base64url
function decodeBase64Url(data) {
  data = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(data, "base64");
}

// ------------------------------
// FULL EMAIL FETCH + SCANNING
// ------------------------------
app.get("/email/:id", async (req, res) => {
  try {
    if (!global.oAuthClient) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

    const email = await gmail.users.messages.get({
      userId: "me",
      id: req.params.id,
      format: "full",
    });

    const payload = email.data.payload;

    // -------------------------
    // 1) BODY EXTRACTION
    // -------------------------
    let body = "";
    if (payload.parts) {
      body = walkParts(payload.parts);
    } else if (payload.body?.data) {
      body = Buffer.from(payload.body.data, "base64").toString();
    }

    // -------------------------
    // 2) URL EXTRACTION
    // -------------------------
    const links = await extractLinks(body);

    // -------------------------
    // 3) URL SCANNING
    // -------------------------
    let urlScans = [];
    for (let url of links) {
      const safeResult = await checkUrlSafety(url);
      const vtResult = await scanUrlWithVirusTotal(url);

      urlScans.push({
        link: url,
        googleSafe: safeResult.safe,
        googleThreat: safeResult.threat,
        vtMalicious: vtResult.malicious,
        vtSuspicious: vtResult.suspicious,
        vtHarmless: vtResult.harmless,
      });
    }

    // -------------------------
    // 4) ATTACHMENT EXTRACTION
    // -------------------------
    let attachments = [];
    if (payload.parts) {
      attachments = collectAttachments(payload.parts);
    }

    // -------------------------
    // 5) ATTACHMENT SCANNING
    // Limit to 2 attachments for VirusTotal free tier
    // -------------------------
    let attachmentScans = [];

    for (let i = 0; i < Math.min(attachments.length, 2); i++) {
      const att = attachments[i];

      const fileResponse = await gmail.users.messages.attachments.get({
        userId: "me",
        messageId: req.params.id,
        id: att.attachmentId
      });

      const fileBuffer = decodeBase64Url(fileResponse.data.data);

      const vtFileResult = await scanFileWithVirusTotal(
        fileBuffer,
        att.filename
      );

      attachmentScans.push({
        filename: att.filename,
        mimeType: att.mimeType,
        size: att.size,
        vtMalicious: vtFileResult.malicious,
        vtSuspicious: vtFileResult.suspicious,
        vtHarmless: vtFileResult.harmless
      });
    }

    // -------------------------
    // SEND COMBINED RESULT
    // -------------------------
    res.json({
      snippet: email.data.snippet,
      body,
      links,
      urlScans,
      attachments,
      attachmentScans
    });

  } catch (err) {
    console.error("FULL EMAIL ERROR:", err);
    res.status(500).json({ error: "Failed to load full email" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});


