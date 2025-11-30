// // // // // // // // // // const express = require("express");
// // // // // // // // // // const cors = require("cors");
// // // // // // // // // // const authRoutes = require("./auth");
// // // // // // // // // // const { getEmails } = require("./gmail");

// // // // // // // // // // const app = express();

// // // // // // // // // // // IMPORTANT: allow only frontend origin
// // // // // // // // // // app.use(cors({
// // // // // // // // // //   origin: "http://localhost:3000",
// // // // // // // // // //   credentials: true
// // // // // // // // // // }));

// // // // // // // // // // app.use("/auth", authRoutes);

// // // // // // // // // // // GET REAL EMAILS
// // // // // // // // // // app.get("/emails", async (req, res) => {
// // // // // // // // // //   try {
// // // // // // // // // //     if (!global.oAuthClient)
// // // // // // // // // //       return res.status(401).json({ error: "Not authenticated" });

// // // // // // // // // //     const inbox = await getEmails(global.oAuthClient);
// // // // // // // // // //     res.json(inbox);
// // // // // // // // // //   } catch (e) {
// // // // // // // // // //     console.log(e);
// // // // // // // // // //     res.status(500).json({ error: "Failed to fetch emails" });
// // // // // // // // // //   }
// // // // // // // // // // });

// // // // // // // // // // app.listen(5000, () => console.log("Server running on port 5000"));


// // // // // // // // // const express = require("express");
// // // // // // // // // const cors = require("cors");
// // // // // // // // // const authRoutes = require("./auth");
// // // // // // // // // const { getEmails } = require("./gmail");
// // // // // // // // // const { google } = require("googleapis");
// // // // // // // // // const { extractLinks } = require("./extractLinks");

// // // // // // // // // const app = express();

// // // // // // // // // // FIXED CORS (required for React)
// // // // // // // // // app.use(cors({
// // // // // // // // //   origin: "http://localhost:3000",
// // // // // // // // //   credentials: true
// // // // // // // // // }));

// // // // // // // // // app.use("/auth", authRoutes);


// // // // // // // // // // ============================================
// // // // // // // // // // GET FAST INBOX (only headers, loads quickly)
// // // // // // // // // // ============================================

// // // // // // // // // app.get("/emails", async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     if (!global.oAuthClient)
// // // // // // // // //       return res.status(401).json({ error: "Not authenticated" });

// // // // // // // // //     const inbox = await getEmails(global.oAuthClient);
// // // // // // // // //     res.json(inbox);
// // // // // // // // //   } catch (e) {
// // // // // // // // //     console.log(e);
// // // // // // // // //     res.status(500).json({ error: "Failed to fetch emails" });
// // // // // // // // //   }
// // // // // // // // // });


// // // // // // // // // // ============================================
// // // // // // // // // // GET FULL EMAIL + LINK EXTRACTION
// // // // // // // // // // ============================================

// // // // // // // // // app.get("/email/:id", async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     if (!global.oAuthClient)
// // // // // // // // //       return res.status(401).json({ error: "Not authenticated" });

// // // // // // // // //     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

// // // // // // // // //     const email = await gmail.users.messages.get({
// // // // // // // // //       userId: "me",
// // // // // // // // //       id: req.params.id,
// // // // // // // // //       format: "full"
// // // // // // // // //     });

// // // // // // // // //     // Extract plain text body
// // // // // // // // //     let body = "";
// // // // // // // // //     const parts = email.data.payload.parts;

// // // // // // // // //     if (parts) {
// // // // // // // // //       const textPart = parts.find(p => p.mimeType === "text/plain");
// // // // // // // // //       if (textPart?.body?.data) {
// // // // // // // // //         body = Buffer.from(textPart.body.data, "base64").toString();
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     // Extract clean links
// // // // // // // // //     const links = await extractLinks(body);

// // // // // // // // //     res.json({
// // // // // // // // //       headers: email.data.payload.headers,
// // // // // // // // //       snippet: email.data.snippet,
// // // // // // // // //       body,
// // // // // // // // //       links
// // // // // // // // //     });

// // // // // // // // //   } catch (error) {
// // // // // // // // //     console.log(error);
// // // // // // // // //     res.status(500).json({ error: "Failed to load full email" });
// // // // // // // // //   }
// // // // // // // // // });


// // // // // // // // // // ============================================
// // // // // // // // // // START SERVER
// // // // // // // // // // ============================================

// // // // // // // // // app.listen(5000, () => console.log("Server running on port 5000"));


// // // // // // // // const express = require("express");
// // // // // // // // const cors = require("cors");
// // // // // // // // const authRoutes = require("./auth");
// // // // // // // // const { getEmails } = require("./gmail");
// // // // // // // // const { google } = require("googleapis");
// // // // // // // // const { extractLinks } = require("./extractLinks");

// // // // // // // // const app = express();

// // // // // // // // // Allow React frontend
// // // // // // // // app.use(cors({
// // // // // // // //   origin: "http://localhost:3000",
// // // // // // // //   credentials: true
// // // // // // // // }));

// // // // // // // // // Google OAuth Routes
// // // // // // // // app.use("/auth", authRoutes);


// // // // // // // // // ============================================
// // // // // // // // // FAST INBOX — loads 20 most recent emails
// // // // // // // // // ============================================

// // // // // // // // app.get("/emails", async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     if (!global.oAuthClient) {
// // // // // // // //       return res.status(401).json({ error: "Not authenticated" });
// // // // // // // //     }

// // // // // // // //     const inbox = await getEmails(global.oAuthClient);
// // // // // // // //     res.json(inbox);

// // // // // // // //   } catch (err) {
// // // // // // // //     console.error("Inbox Fetch Error:", err);
// // // // // // // //     res.status(500).json({ error: "Failed to fetch emails" });
// // // // // // // //   }
// // // // // // // // });


// // // // // // // // // ============================================
// // // // // // // // // FULL EMAIL LOADER (body + links)
// // // // // // // // // Handles HTML, nested MIME, etc.
// // // // // // // // // ============================================

// // // // // // // // // Helps extract body from nested parts
// // // // // // // // const walkParts = (parts) => {
// // // // // // // //   let body = "";

// // // // // // // //   for (let part of parts) {

// // // // // // // //     // Extract plain text
// // // // // // // //     if (part.mimeType === "text/plain" && part.body?.data) {
// // // // // // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // // // // // //     }

// // // // // // // //     // Extract HTML
// // // // // // // //     if (part.mimeType === "text/html" && part.body?.data) {
// // // // // // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // // // // // //     }

// // // // // // // //     // Recursively handle nested parts
// // // // // // // //     if (part.parts) {
// // // // // // // //       body += walkParts(part.parts);
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   return body;
// // // // // // // // };


// // // // // // // // app.get("/email/:id", async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     if (!global.oAuthClient) {
// // // // // // // //       return res.status(401).json({ error: "Not authenticated" });
// // // // // // // //     }

// // // // // // // //     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

// // // // // // // //     const email = await gmail.users.messages.get({
// // // // // // // //       userId: "me",
// // // // // // // //       id: req.params.id,
// // // // // // // //       format: "full"
// // // // // // // //     });

// // // // // // // //     const payload = email.data.payload;
// // // // // // // //     const { checkUrlSafety } = require("./safeBrowsing");
// // // // // // // //     // Extract body (HTML + text + nested)
// // // // // // // //     let body = "";

// // // // // // // //     if (payload.parts) {
// // // // // // // //       body = walkParts(payload.parts);
// // // // // // // //     } else if (payload.body?.data) {
// // // // // // // //       body = Buffer.from(payload.body.data, "base64").toString();
// // // // // // // //     }

// // // // // // // //     // Extract clean & expanded links
// // // // // // // //     const links = await extractLinks(body);

// // // // // // // //     res.json({
// // // // // // // //       headers: payload.headers,
// // // // // // // //       snippet: email.data.snippet,
// // // // // // // //       body,
// // // // // // // //       links
// // // // // // // //     });

// // // // // // // //   } catch (err) {
// // // // // // // //     console.error("Full Email Error:", err);
// // // // // // // //     res.status(500).json({ error: "Failed to load email" });
// // // // // // // //   }
// // // // // // // // });


// // // // // // // // // ============================================
// // // // // // // // // START SERVER
// // // // // // // // // ============================================

// // // // // // // // app.listen(5000, () => {
// // // // // // // //   console.log("Server running on port 5000");
// // // // // // // // });


// // // // // // // const express = require("express");
// // // // // // // const cors = require("cors");
// // // // // // // const authRoutes = require("./auth");
// // // // // // // const { getEmails } = require("./gmail");
// // // // // // // const { google } = require("googleapis");
// // // // // // // const { extractLinks } = require("./extractLinks");
// // // // // // // const { checkUrlSafety } = require("./safeBrowsing");

// // // // // // // const app = express();

// // // // // // // // CORS SETTINGS (Required for React)
// // // // // // // app.use(cors({
// // // // // // //   origin: "http://localhost:3000",
// // // // // // //   credentials: true
// // // // // // // }));

// // // // // // // // Google OAuth Routes
// // // // // // // app.use("/auth", authRoutes);


// // // // // // // // ================================
// // // // // // // // FAST INBOX (Loads only 20 emails)
// // // // // // // // ================================
// // // // // // // app.get("/emails", async (req, res) => {
// // // // // // //   try {
// // // // // // //     if (!global.oAuthClient) {
// // // // // // //       return res.status(401).json({ error: "Not authenticated" });
// // // // // // //     }

// // // // // // //     const inbox = await getEmails(global.oAuthClient);
// // // // // // //     res.json(inbox);

// // // // // // //   } catch (err) {
// // // // // // //     console.error("Inbox Fetch Error:", err);
// // // // // // //     res.status(500).json({ error: "Failed to fetch emails" });
// // // // // // //   }
// // // // // // // });


// // // // // // // // =====================================================
// // // // // // // // RECURSIVE BODY EXTRACTOR (Handles HTML, text, nested)
// // // // // // // // =====================================================
// // // // // // // const walkParts = (parts) => {
// // // // // // //   let body = "";

// // // // // // //   for (let part of parts) {

// // // // // // //     // Extract plain text
// // // // // // //     if (part.mimeType === "text/plain" && part.body?.data) {
// // // // // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // // // // //     }

// // // // // // //     // Extract HTML
// // // // // // //     if (part.mimeType === "text/html" && part.body?.data) {
// // // // // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // // // // //     }

// // // // // // //     // Nested parts (very common)
// // // // // // //     if (part.parts) {
// // // // // // //       body += walkParts(part.parts);
// // // // // // //     }
// // // // // // //   }

// // // // // // //   return body;
// // // // // // // };


// // // // // // // // =====================================================
// // // // // // // // FULL EMAIL LOADER + LINK EXTRACTION + SAFE BROWSING
// // // // // // // // =====================================================
// // // // // // // app.get("/email/:id", async (req, res) => {
// // // // // // //   try {
// // // // // // //     if (!global.oAuthClient) {
// // // // // // //       return res.status(401).json({ error: "Not authenticated" });
// // // // // // //     }

// // // // // // //     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

// // // // // // //     const email = await gmail.users.messages.get({
// // // // // // //       userId: "me",
// // // // // // //       id: req.params.id,
// // // // // // //       format: "full"
// // // // // // //     });

// // // // // // //     const payload = email.data.payload;

// // // // // // //     // Extract body
// // // // // // //     let body = "";
// // // // // // //     if (payload.parts) {
// // // // // // //       body = walkParts(payload.parts);
// // // // // // //     } else if (payload.body?.data) {
// // // // // // //       body = Buffer.from(payload.body.data, "base64").toString();
// // // // // // //     }

// // // // // // //     // Extract URLs from body
// // // // // // //     const links = await extractLinks(body);

// // // // // // //     // Scan all links with Google Safe Browsing
// // // // // // //     let scanResults = [];
// // // // // // //     for (let link of links) {
// // // // // // //       const scan = await checkUrlSafety(link);
// // // // // // //       scanResults.push(scan);
// // // // // // //     }

// // // // // // //     // Final response
// // // // // // //     return res.json({
// // // // // // //       headers: payload.headers,
// // // // // // //       snippet: email.data.snippet,
// // // // // // //       body,
// // // // // // //       links,
// // // // // // //       scans: scanResults
// // // // // // //     });

// // // // // // //   } catch (err) {
// // // // // // //     console.error("Email Load Error:", err);
// // // // // // //     res.status(500).json({ error: "Failed to load email" });
// // // // // // //   }
// // // // // // // });


// // // // // // // // ================================
// // // // // // // // START SERVER
// // // // // // // // ================================
// // // // // // // app.listen(5000, () => {
// // // // // // //   console.log("Server running on port 5000");
// // // // // // // });


// // // // // // const express = require("express");
// // // // // // const cors = require("cors");
// // // // // // const authRoutes = require("./auth");
// // // // // // const { getEmails } = require("./gmail");
// // // // // // const { google } = require("googleapis");
// // // // // // const { extractLinks } = require("./extractLinks");
// // // // // // const { checkUrlSafety } = require("./safeBrowsing");
// // // // // // const { scanUrlWithVirusTotal } = require("./virusTotal");

// // // // // // const app = express();

// // // // // // app.use(cors({
// // // // // //   origin: "http://localhost:3000",
// // // // // //   credentials: true
// // // // // // }));

// // // // // // app.use("/auth", authRoutes);

// // // // // // // FAST inbox (20 emails)
// // // // // // app.get("/emails", async (req, res) => {
// // // // // //   try {
// // // // // //     if (!global.oAuthClient)
// // // // // //       return res.status(401).json({ error: "Not authenticated" });

// // // // // //     const inbox = await getEmails(global.oAuthClient);
// // // // // //     res.json(inbox);

// // // // // //   } catch (err) {
// // // // // //     console.error("Inbox Error:", err);
// // // // // //     res.status(500).json({ error: "Failed to fetch emails" });
// // // // // //   }
// // // // // // });

// // // // // // // Extract body from nested MIME parts
// // // // // // const walkParts = (parts) => {
// // // // // //   let body = "";

// // // // // //   for (let part of parts) {

// // // // // //     if (part.mimeType === "text/plain" && part.body?.data) {
// // // // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // // // //     }

// // // // // //     if (part.mimeType === "text/html" && part.body?.data) {
// // // // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // // // //     }

// // // // // //     if (part.parts) {
// // // // // //       body += walkParts(part.parts);
// // // // // //     }
// // // // // //   }

// // // // // //   return body;
// // // // // // };

// // // // // // // Load full email + links + VirusTotal + SafeBrowsing
// // // // // // app.get("/email/:id", async (req, res) => {
// // // // // //   try {
// // // // // //     if (!global.oAuthClient)
// // // // // //       return res.status(401).json({ error: "Not authenticated" });

// // // // // //     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

// // // // // //     const email = await gmail.users.messages.get({
// // // // // //       userId: "me",
// // // // // //       id: req.params.id,
// // // // // //       format: "full"
// // // // // //     });

// // // // // //     const payload = email.data.payload;

// // // // // //     let body = "";

// // // // // //     if (payload.parts) {
// // // // // //       body = walkParts(payload.parts);
// // // // // //     } else if (payload.body?.data) {
// // // // // //       body = Buffer.from(payload.body.data, "base64").toString();
// // // // // //     }

// // // // // //     const links = await extractLinks(body);

// // // // // //     let scanResults = [];

// // // // // //     for (let link of links) {
// // // // // //       const safeResults = await checkUrlSafety(link);
// // // // // //       const vtResults = await scanUrlWithVirusTotal(link);

// // // // // //       scanResults.push({
// // // // // //         link,
// // // // // //         googleSafe: safeResults.safe,
// // // // // //         googleThreat: safeResults.threat,
// // // // // //         vtMalicious: vtResults.malicious,
// // // // // //         vtSuspicious: vtResults.suspicious,
// // // // // //         vtHarmless: vtResults.harmless
// // // // // //       });
// // // // // //     }

// // // // // //     res.json({
// // // // // //       headers: payload.headers,
// // // // // //       snippet: email.data.snippet,
// // // // // //       body,
// // // // // //       links,
// // // // // //       scans: scanResults
// // // // // //     });

// // // // // //   } catch (err) {
// // // // // //     console.error("Email Error:", err);
// // // // // //     res.status(500).json({ error: "Failed to load email" });
// // // // // //   }
// // // // // // });

// // // // // // app.listen(5000, () => {
// // // // // //   console.log("Server running on port 5000");
// // // // // // });


// // // // // const express = require("express");
// // // // // const cors = require("cors");
// // // // // const authRoutes = require("./auth");
// // // // // const { getEmails } = require("./gmail");
// // // // // const { google } = require("googleapis");
// // // // // const { extractLinks } = require("./extractLinks");
// // // // // const { checkUrlSafety } = require("./safeBrowsing");
// // // // // const { scanUrlWithVirusTotal } = require("./virusTotal");
// // // // // const { scanFileWithVirusTotal } = require("./virusTotalFile");

// // // // // const app = express();

// // // // // app.use(cors({
// // // // //   origin: "http://localhost:3000",
// // // // //   credentials: true
// // // // // }));

// // // // // app.use("/auth", authRoutes);

// // // // // // ================================
// // // // // // FAST INBOX (20 emails)
// // // // // // ================================
// // // // // app.get("/emails", async (req, res) => {
// // // // //   try {
// // // // //     if (!global.oAuthClient)
// // // // //       return res.status(401).json({ error: "Not authenticated" });

// // // // //     const inbox = await getEmails(global.oAuthClient);
// // // // //     res.json(inbox);

// // // // //   } catch (err) {
// // // // //     console.error("Inbox Error:", err);
// // // // //     res.status(500).json({ error: "Failed to fetch emails" });
// // // // //   }
// // // // // });

// // // // // // ================================
// // // // // // Helper: extract body from nested parts
// // // // // // ================================
// // // // // const walkParts = (parts) => {
// // // // //   let body = "";

// // // // //   for (let part of parts) {

// // // // //     if (part.mimeType === "text/plain" && part.body?.data) {
// // // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // // //     }

// // // // //     if (part.mimeType === "text/html" && part.body?.data) {
// // // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // // //     }

// // // // //     if (part.parts) {
// // // // //       body += walkParts(part.parts);
// // // // //     }
// // // // //   }

// // // // //   return body;
// // // // // };

// // // // // // ================================
// // // // // // Helper: find attachments in email
// // // // // // ================================
// // // // // const collectAttachments = (parts, attachments = []) => {
// // // // //   for (let part of parts) {
// // // // //     if (part.filename && part.body && part.body.attachmentId) {
// // // // //       attachments.push({
// // // // //         filename: part.filename,
// // // // //         mimeType: part.mimeType,
// // // // //         size: part.body.size,
// // // // //         attachmentId: part.body.attachmentId
// // // // //       });
// // // // //     }
// // // // //     if (part.parts) {
// // // // //       collectAttachments(part.parts, attachments);
// // // // //     }
// // // // //   }
// // // // //   return attachments;
// // // // // };

// // // // // // Decode base64url safely
// // // // // const decodeBase64Url = (data) => {
// // // // //   data = data.replace(/-/g, "+").replace(/_/g, "/");
// // // // //   return Buffer.from(data, "base64");
// // // // // };

// // // // // // ================================
// // // // // // FULL EMAIL: body + links + URL scans + ATTACHMENT scans
// // // // // // ================================
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

// // // // //     const payload = email.data.payload;

// // // // //     // 1) BODY (HTML + text)
// // // // //     let body = "";
// // // // //     if (payload.parts) {
// // // // //       body = walkParts(payload.parts);
// // // // //     } else if (payload.body?.data) {
// // // // //       body = Buffer.from(payload.body.data, "base64").toString();
// // // // //     }

// // // // //     // 2) LINKS + URL SCANS
// // // // //     const links = await extractLinks(body);
// // // // //     let urlScans = [];

// // // // //     for (let link of links) {
// // // // //       const safeResult = await checkUrlSafety(link);
// // // // //       const vtResult = await scanUrlWithVirusTotal(link);

// // // // //       urlScans.push({
// // // // //         link,
// // // // //         googleSafe: safeResult.safe,
// // // // //         googleThreat: safeResult.threat,
// // // // //         vtMalicious: vtResult.malicious,
// // // // //         vtSuspicious: vtResult.suspicious,
// // // // //         vtHarmless: vtResult.harmless
// // // // //       });
// // // // //     }

// // // // //     // 3) ATTACHMENTS DETECTION
// // // // //     let attachments = [];
// // // // //     if (payload.parts) {
// // // // //       attachments = collectAttachments(payload.parts);
// // // // //     }

// // // // //     // 4) ATTACHMENT SCANNING (limit to 2 to keep it fast)
// // // // //     let attachmentScans = [];
// // // // //     for (let i = 0; i < Math.min(attachments.length, 2); i++) {
// // // // //       const att = attachments[i];

// // // // //       const attRes = await gmail.users.messages.attachments.get({
// // // // //         userId: "me",
// // // // //         messageId: req.params.id,
// // // // //         id: att.attachmentId
// // // // //       });

// // // // //       const fileBuffer = decodeBase64Url(attRes.data.data);

// // // // //       const vtFileResult = await scanFileWithVirusTotal(fileBuffer, att.filename);

// // // // //       attachmentScans.push({
// // // // //         filename: att.filename,
// // // // //         mimeType: att.mimeType,
// // // // //         size: att.size,
// // // // //         vtMalicious: vtFileResult.malicious,
// // // // //         vtSuspicious: vtFileResult.suspicious,
// // // // //         vtHarmless: vtFileResult.harmless
// // // // //       });
// // // // //     }

// // // // //     res.json({
// // // // //       snippet: email.data.snippet,
// // // // //       body,
// // // // //       links,
// // // // //       urlScans,
// // // // //       attachments,
// // // // //       attachmentScans
// // // // //     });

// // // // //   } catch (err) {
// // // // //     console.error("Full Email Error:", err);
// // // // //     res.status(500).json({ error: "Failed to load email" });
// // // // //   }
// // // // // });

// // // // // app.listen(5000, () => {
// // // // //   console.log("Server running on port 5000");
// // // // // });

// // // // const express = require("express");
// // // // const cors = require("cors");
// // // // const { google } = require("googleapis");

// // // // require("dotenv").config();

// // // // const authRoutes = require("./auth");
// // // // const { getEmails } = require("./gmail");

// // // // const { extractLinks } = require("./extractLinks");
// // // // const { checkUrlSafety } = require("./safeBrowsing");
// // // // const { scanUrlWithVirusTotal } = require("./virusTotal");
// // // // const { scanFileWithVirusTotal } = require("./virusTotalFile");

// // // // const app = express();

// // // // app.use(cors({
// // // //   origin: "http://localhost:3000",
// // // //   credentials: true
// // // // }));

// // // // app.use("/auth", authRoutes);

// // // // // ------------------------------
// // // // // INBOX FETCH (FAST)
// // // // // ------------------------------
// // // // app.get("/emails", async (req, res) => {
// // // //   try {
// // // //     if (!global.oAuthClient) {
// // // //       return res.status(401).json({ error: "Not authenticated" });
// // // //     }

// // // //     const inbox = await getEmails(global.oAuthClient);
// // // //     res.json(inbox);

// // // //   } catch (err) {
// // // //     console.error("INBOX ERROR:", err);
// // // //     res.status(500).json({ error: "Failed to fetch inbox" });
// // // //   }
// // // // });

// // // // // ------------------------------
// // // // // HELPERS
// // // // // ------------------------------

// // // // // Recursively extract email body (HTML or text)
// // // // const walkParts = (parts) => {
// // // //   let body = "";
// // // //   for (let part of parts) {
// // // //     if (part.mimeType === "text/plain" && part.body?.data) {
// // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // //     }
// // // //     if (part.mimeType === "text/html" && part.body?.data) {
// // // //       body += Buffer.from(part.body.data, "base64").toString();
// // // //     }
// // // //     if (part.parts) {
// // // //       body += walkParts(part.parts);
// // // //     }
// // // //   }
// // // //   return body;
// // // // };

// // // // // Find attachments
// // // // const collectAttachments = (parts, result = []) => {
// // // //   for (let part of parts) {
// // // //     if (part.filename && part.body?.attachmentId) {
// // // //       result.push({
// // // //         filename: part.filename,
// // // //         mimeType: part.mimeType,
// // // //         size: part.body.size,
// // // //         attachmentId: part.body.attachmentId
// // // //       });
// // // //     }
// // // //     if (part.parts) {
// // // //       collectAttachments(part.parts, result);
// // // //     }
// // // //   }
// // // //   return result;
// // // // };

// // // // // Decode gmail base64url
// // // // function decodeBase64Url(data) {
// // // //   data = data.replace(/-/g, "+").replace(/_/g, "/");
// // // //   return Buffer.from(data, "base64");
// // // // }

// // // // // ------------------------------
// // // // // FULL EMAIL FETCH + SCANNING
// // // // // ------------------------------
// // // // app.get("/email/:id", async (req, res) => {
// // // //   try {
// // // //     if (!global.oAuthClient) {
// // // //       return res.status(401).json({ error: "Not authenticated" });
// // // //     }

// // // //     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

// // // //     const email = await gmail.users.messages.get({
// // // //       userId: "me",
// // // //       id: req.params.id,
// // // //       format: "full",
// // // //     });

// // // //     const payload = email.data.payload;

// // // //     // -------------------------
// // // //     // 1) BODY EXTRACTION
// // // //     // -------------------------
// // // //     let body = "";
// // // //     if (payload.parts) {
// // // //       body = walkParts(payload.parts);
// // // //     } else if (payload.body?.data) {
// // // //       body = Buffer.from(payload.body.data, "base64").toString();
// // // //     }

// // // //     // -------------------------
// // // //     // 2) URL EXTRACTION
// // // //     // -------------------------
// // // //     const links = await extractLinks(body);

// // // //     // -------------------------
// // // //     // 3) URL SCANNING
// // // //     // -------------------------
// // // //     let urlScans = [];
// // // //     for (let url of links) {
// // // //       const safeResult = await checkUrlSafety(url);
// // // //       const vtResult = await scanUrlWithVirusTotal(url);

// // // //       urlScans.push({
// // // //         link: url,
// // // //         googleSafe: safeResult.safe,
// // // //         googleThreat: safeResult.threat,
// // // //         vtMalicious: vtResult.malicious,
// // // //         vtSuspicious: vtResult.suspicious,
// // // //         vtHarmless: vtResult.harmless,
// // // //       });
// // // //     }

// // // //     // -------------------------
// // // //     // 4) ATTACHMENT EXTRACTION
// // // //     // -------------------------
// // // //     let attachments = [];
// // // //     if (payload.parts) {
// // // //       attachments = collectAttachments(payload.parts);
// // // //     }

// // // //     // -------------------------
// // // //     // 5) ATTACHMENT SCANNING
// // // //     // Limit to 2 attachments for VirusTotal free tier
// // // //     // -------------------------
// // // //     let attachmentScans = [];

// // // //     for (let i = 0; i < Math.min(attachments.length, 2); i++) {
// // // //       const att = attachments[i];

// // // //       const fileResponse = await gmail.users.messages.attachments.get({
// // // //         userId: "me",
// // // //         messageId: req.params.id,
// // // //         id: att.attachmentId
// // // //       });

// // // //       const fileBuffer = decodeBase64Url(fileResponse.data.data);

// // // //       const vtFileResult = await scanFileWithVirusTotal(
// // // //         fileBuffer,
// // // //         att.filename
// // // //       );

// // // //       attachmentScans.push({
// // // //         filename: att.filename,
// // // //         mimeType: att.mimeType,
// // // //         size: att.size,
// // // //         vtMalicious: vtFileResult.malicious,
// // // //         vtSuspicious: vtFileResult.suspicious,
// // // //         vtHarmless: vtFileResult.harmless
// // // //       });
// // // //     }

// // // //     // -------------------------
// // // //     // SEND COMBINED RESULT
// // // //     // -------------------------
// // // //     res.json({
// // // //       snippet: email.data.snippet,
// // // //       body,
// // // //       links,
// // // //       urlScans,
// // // //       attachments,
// // // //       attachmentScans
// // // //     });

// // // //   } catch (err) {
// // // //     console.error("FULL EMAIL ERROR:", err);
// // // //     res.status(500).json({ error: "Failed to load full email" });
// // // //   }
// // // // });

// // // // app.listen(5000, () => {
// // // //   console.log("🚀 Server running on http://localhost:5000");
// // // // });


// // // // ======================================================
// // // //  RAKSHAYANTRA AI - FULL SERVER WITH DOCKER SANDBOX
// // // // ======================================================

// // // const express = require("express");
// // // const cors = require("cors");
// // // const { google } = require("googleapis");
// // // const { exec } = require("child_process");
// // // require("dotenv").config();

// // // const authRoutes = require("./auth");
// // // const { getEmails } = require("./gmail");

// // // const { extractLinks } = require("./extractLinks");
// // // const { checkUrlSafety } = require("./safeBrowsing");
// // // const { scanUrlWithVirusTotal } = require("./virusTotal");
// // // const { scanFileWithVirusTotal } = require("./virusTotalFile");

// // // // ------------------------------
// // // // STATIC sandbox (HTML only)
// // // // ------------------------------
// // // const { runSandbox } = require("./sandbox"); // Your older static sandbox

// // // // ------------------------------
// // // // DOCKER-BASED SANDBOX (Dynamic)
// // // // ------------------------------
// // // function runDockerSandbox(url) {
// // //   return new Promise((resolve) => {
// // //     // Docker image name (build this once)
// // //     const dockerImage = "ry-sandbox";

// // //     exec(
// // //       `docker run --rm ${dockerImage} "${url}"`,
// // //       (err, stdout, stderr) => {
// // //         if (err) {
// // //           console.error("DOCKER ERROR:", err);
// // //           return resolve({ error: "Docker sandbox failed" });
// // //         }

// // //         try {
// // //           const parsed = JSON.parse(stdout);
// // //           resolve(parsed);
// // //         } catch (e) {
// // //           resolve({ error: "Invalid sandbox output" });
// // //         }
// // //       }
// // //     );
// // //   });
// // // }

// // // const app = express();
// // // app.use(express.json());

// // // app.use(
// // //   cors({
// // //     origin: "http://localhost:3000",
// // //     credentials: true,
// // //   })
// // // );

// // // // ------------------------------
// // // // AUTH ROUTES
// // // // ------------------------------
// // // app.use("/auth", authRoutes);

// // // // ------------------------------
// // // // FAST INBOX FETCH
// // // // ------------------------------
// // // app.get("/emails", async (req, res) => {
// // //   try {
// // //     if (!global.oAuthClient)
// // //       return res.status(401).json({ error: "Not authenticated" });

// // //     const inbox = await getEmails(global.oAuthClient);
// // //     res.json(inbox);
// // //   } catch (err) {
// // //     console.error("INBOX ERROR:", err);
// // //     res.status(500).json({ error: "Failed to fetch inbox" });
// // //   }
// // // });

// // // // ------------------------------
// // // // HELPERS
// // // // ------------------------------
// // // const walkParts = (parts) => {
// // //   let body = "";
// // //   for (let part of parts) {
// // //     if (part.mimeType === "text/plain" && part.body?.data) {
// // //       body += Buffer.from(part.body.data, "base64").toString();
// // //     }
// // //     if (part.mimeType === "text/html" && part.body?.data) {
// // //       body += Buffer.from(part.body.data, "base64").toString();
// // //     }
// // //     if (part.parts) body += walkParts(part.parts);
// // //   }
// // //   return body;
// // // };

// // // const collectAttachments = (parts, result = []) => {
// // //   for (let part of parts) {
// // //     if (part.filename && part.body?.attachmentId) {
// // //       result.push({
// // //         filename: part.filename,
// // //         mimeType: part.mimeType,
// // //         size: part.body.size,
// // //         attachmentId: part.body.attachmentId,
// // //       });
// // //     }
// // //     if (part.parts) collectAttachments(part.parts, result);
// // //   }
// // //   return result;
// // // };

// // // function decodeBase64Url(data) {
// // //   data = data.replace(/-/g, "+").replace(/_/g, "/");
// // //   return Buffer.from(data, "base64");
// // // }

// // // // ------------------------------
// // // // FULL EMAIL FETCH + SCANNING
// // // // ------------------------------
// // // app.get("/email/:id", async (req, res) => {
// // //   try {
// // //     if (!global.oAuthClient)
// // //       return res.status(401).json({ error: "Not authenticated" });

// // //     const gmail = google.gmail({
// // //       version: "v1",
// // //       auth: global.oAuthClient,
// // //     });

// // //     const email = await gmail.users.messages.get({
// // //       userId: "me",
// // //       id: req.params.id,
// // //       format: "full",
// // //     });

// // //     const payload = email.data.payload;

// // //     // 1) BODY
// // //     let body = "";
// // //     if (payload.parts) body = walkParts(payload.parts);
// // //     else if (payload.body?.data)
// // //       body = Buffer.from(payload.body.data, "base64").toString();

// // //     // 2) LINKS
// // //     const links = await extractLinks(body);

// // //     // 3) URL SCANS
// // //     let urlScans = [];
// // //     for (let url of links) {
// // //       const safeResult = await checkUrlSafety(url);
// // //       const vtResult = await scanUrlWithVirusTotal(url);

// // //       urlScans.push({
// // //         link: url,
// // //         googleSafe: safeResult.safe,
// // //         googleThreat: safeResult.threat,
// // //         vtMalicious: vtResult.malicious,
// // //         vtSuspicious: vtResult.suspicious,
// // //         vtHarmless: vtResult.harmless,
// // //       });
// // //     }

// // //     // 4) ATTACHMENTS
// // //     let attachments = [];
// // //     if (payload.parts) attachments = collectAttachments(payload.parts);

// // //     // 5) ATTACHMENT SCANS
// // //     let attachmentScans = [];
// // //     for (let i = 0; i < Math.min(attachments.length, 2); i++) {
// // //       const att = attachments[i];

// // //       const fileResponse = await gmail.users.messages.attachments.get({
// // //         userId: "me",
// // //         messageId: req.params.id,
// // //         id: att.attachmentId,
// // //       });

// // //       const fileBuffer = decodeBase64Url(fileResponse.data.data);
// // //       const vtFileResult = await scanFileWithVirusTotal(
// // //         fileBuffer,
// // //         att.filename
// // //       );

// // //       attachmentScans.push({
// // //         filename: att.filename,
// // //         mimeType: att.mimeType,
// // //         size: att.size,
// // //         vtMalicious: vtFileResult.malicious,
// // //         vtSuspicious: vtFileResult.suspicious,
// // //         vtHarmless: vtFileResult.harmless,
// // //       });
// // //     }

// // //     // SEND RESPONSE
// // //     res.json({
// // //       snippet: email.data.snippet,
// // //       body,
// // //       links,
// // //       urlScans,
// // //       attachments,
// // //       attachmentScans,
// // //     });
// // //   } catch (err) {
// // //     console.error("FULL EMAIL ERROR:", err);
// // //     res.status(500).json({ error: "Failed to load full email" });
// // //   }
// // // });

// // // // ------------------------------
// // // // STATIC SANDBOX ENDPOINT
// // // // ------------------------------
// // // app.post("/sandbox-static", async (req, res) => {
// // //   const { url } = req.body;
// // //   const result = await runSandbox(url);
// // //   res.json(result);
// // // });

// // // // ------------------------------
// // // // DOCKER DYNAMIC SANDBOX ENDPOINT
// // // // ------------------------------
// // // app.post("/sandbox", async (req, res) => {
// // //   const { url } = req.body;

// // //   if (!url) return res.json({ error: "URL missing" });

// // //   const report = await runDockerSandbox(url);
// // //   res.json(report);
// // // });

// // // // ------------------------------
// // // // START SERVER
// // // // ------------------------------
// // // app.listen(5000, () => {
// // //   console.log("🚀 Server running on http://localhost:5000");
// // // });



// // // ======================================================
// // //  RAKSHAYANTRA AI - FULL SERVER WITH DOCKER SANDBOX
// // // ======================================================

// // const express = require("express");
// // const cors = require("cors");
// // const { google } = require("googleapis");
// // const { exec } = require("child_process");
// // require("dotenv").config();

// // const authRoutes = require("./auth");
// // const { getEmails } = require("./gmail");

// // const { extractLinks } = require("./extractLinks");
// // const { checkUrlSafety } = require("./safeBrowsing");
// // const { scanUrlWithVirusTotal } = require("./virusTotal");
// // const { scanFileWithVirusTotal } = require("./virusTotalFile");

// // // const { runSandbox } = require("./sandbox"); // static sandbox
// // const { analyzeSandbox } = require("./sandbox/sandboxAnalyzer");

// // const app = express();
// // app.use(express.json());

// // app.use(
// //   cors({
// //     origin: "http://localhost:3000",
// //     credentials: true,
// //   })
// // );

// // // ------------------------------
// // // DOCKER SANDBOX RUNNER
// // // ------------------------------
// // function runDockerSandbox(url) {
// //   return new Promise((resolve) => {
// //     exec(
// //       `docker run --rm ry-sandbox "${url}"`,
// //       (err, stdout, stderr) => {
// //         if (err) {
// //           console.error("DOCKER ERROR:", err);
// //           return resolve({ error: "Docker sandbox failed" });
// //         }

// //         try {
// //           resolve(JSON.parse(stdout));
// //         } catch {
// //           resolve({ error: "Invalid sandbox output" });
// //         }
// //       }
// //     );
// //   });
// // }

// // // ------------------------------
// // // AUTH ROUTES
// // // ------------------------------
// // app.use("/auth", authRoutes);

// // // ------------------------------
// // // INBOX FAST FETCH
// // // ------------------------------
// // app.get("/emails", async (req, res) => {
// //   try {
// //     if (!global.oAuthClient)
// //       return res.status(401).json({ error: "Not authenticated" });

// //     const inbox = await getEmails(global.oAuthClient);
// //     res.json(inbox);
// //   } catch (err) {
// //     console.error("INBOX ERROR:", err.message);
// //     res.status(500).json({ error: "Failed to fetch inbox" });
// //   }
// // });

// // // ------------------------------
// // // HELPERS
// // // ------------------------------
// // const walkParts = (parts) => {
// //   let body = "";
// //   for (let part of parts) {
// //     if (part.mimeType === "text/plain" && part.body?.data) {
// //       body += Buffer.from(part.body.data, "base64").toString();
// //     }
// //     if (part.mimeType === "text/html" && part.body?.data) {
// //       body += Buffer.from(part.body.data, "base64").toString();
// //     }
// //     if (part.parts) body += walkParts(part.parts);
// //   }
// //   return body;
// // };

// // const collectAttachments = (parts, result = []) => {
// //   for (let part of parts) {
// //     if (part.filename && part.body?.attachmentId) {
// //       result.push({
// //         filename: part.filename,
// //         mimeType: part.mimeType,
// //         size: part.body.size,
// //         attachmentId: part.body.attachmentId,
// //       });
// //     }
// //     if (part.parts) collectAttachments(part.parts, result);
// //   }
// //   return result;
// // };

// // function decodeBase64Url(str) {
// //   str = str.replace(/-/g, "+").replace(/_/g, "/");
// //   return Buffer.from(str, "base64");
// // }

// // // ------------------------------
// // // FULL EMAIL ANALYSIS
// // // ------------------------------
// // app.get("/email/:id", async (req, res) => {
// //   try {
// //     if (!global.oAuthClient)
// //       return res.status(401).json({ error: "Not authenticated" });

// //     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

// //     const email = await gmail.users.messages.get({
// //       userId: "me",
// //       id: req.params.id,
// //       format: "full",
// //     });

// //     const payload = email.data.payload;

// //     // BODY
// //     let body = "";
// //     if (payload.parts) body = walkParts(payload.parts);
// //     else if (payload.body?.data)
// //       body = Buffer.from(payload.body.data, "base64").toString();

// //     // LINKS
// //     const links = await extractLinks(body);

// //     // SCAN URLS
// //     let urlScans = [];
// //     for (let url of links) {
// //       const safe = await checkUrlSafety(url);
// //       const vt = await scanUrlWithVirusTotal(url);

// //       urlScans.push({
// //         link: url,
// //         googleSafe: safe.safe,
// //         googleThreat: safe.threat,
// //         vtMalicious: vt.malicious,
// //         vtSuspicious: vt.suspicious,
// //       });
// //     }

// //     // ATTACHMENTS
// //     let attachments = [];
// //     if (payload.parts) attachments = collectAttachments(payload.parts);

// //     let attachmentScans = [];

// //     for (let i = 0; i < Math.min(attachments.length, 2); i++) {
// //       const att = attachments[i];

// //       const fileData = await gmail.users.messages.attachments.get({
// //         userId: "me",
// //         messageId: req.params.id,
// //         id: att.attachmentId,
// //       });

// //       const buffer = decodeBase64Url(fileData.data.data);

// //       const vt = await scanFileWithVirusTotal(buffer, att.filename);

// //       attachmentScans.push({
// //         filename: att.filename,
// //         vtMalicious: vt.malicious,
// //         vtSuspicious: vt.suspicious,
// //       });
// //     }

// //     res.json({
// //       snippet: email.data.snippet,
// //       body,
// //       links,
// //       urlScans,
// //       attachments,
// //       attachmentScans,
// //     });
// //   } catch (err) {
// //     console.error("EMAIL ERROR:", err.message);
// //     res.status(500).json({ error: "Failed to load full email" });
// //   }
// // });

// // // ------------------------------
// // // STATIC SANDBOX (optional)
// // // ------------------------------
// // app.post("/sandbox-static", async (req, res) => {
// //   const report = await runSandbox(req.body.url);
// //   res.json(report);
// // });

// // // ------------------------------
// // // DOCKER DYNAMIC SANDBOX
// // // ------------------------------
// // app.post("/sandbox", async (req, res) => {
// //   const { url } = req.body;
// //   if (!url) return res.json({ error: "URL missing" });

// //   const rawReport = await runDockerSandbox(url);
// //   const analysis = analyzeSandbox(rawReport);

// //   res.json({ raw: rawReport, analysis });
// // });

// // // ------------------------------
// // // START
// // // ------------------------------
// // app.listen(5000, () => {
// //   console.log("🚀 Server running on http://localhost:5000");
// // });



// // ======================================================
// //  RAKSHAYANTRA AI - 3 LAYER SECURITY BACKEND
// // ======================================================

// const express = require("express");
// const cors = require("cors");
// const { google } = require("googleapis");
// const { exec } = require("child_process");
// require("dotenv").config();

// const authRoutes = require("./auth");
// const { getEmails } = require("./gmail");

// const { extractLinks } = require("./extractLinks");
// const { checkUrlSafety } = require("./safeBrowsing");
// const { scanUrlWithVirusTotal } = require("./virusTotal");
// const { scanFileWithVirusTotal } = require("./virusTotalFile");

// const { analyzeSandbox } = require("./sandbox/sandboxAnalyzer");

// const app = express();
// app.use(express.json());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// // ---------------------------------------------------
// // DOCKER SANDBOX RUNNER
// // ---------------------------------------------------
// function runDockerSandbox(url) {
//   return new Promise((resolve) => {
//     exec(`docker run --rm ry-sandbox "${url}"`, (err, stdout) => {
//       if (err) return resolve({ error: "Docker sandbox failed" });

//       try {
//         resolve(JSON.parse(stdout));
//       } catch {
//         resolve({ error: "Invalid sandbox output" });
//       }
//     });
//   });
// }

// // ---------------------------------------------------
// // AUTH
// // ---------------------------------------------------
// app.use("/auth", authRoutes);

// // ---------------------------------------------------
// // INBOX FETCH
// // ---------------------------------------------------
// app.get("/emails", async (req, res) => {
//   try {
//     if (!global.oAuthClient)
//       return res.status(401).json({ error: "Not authenticated" });

//     const inbox = await getEmails(global.oAuthClient);
//     res.json(inbox);
//   } catch (e) {
//     res.status(500).json({ error: "Inbox error" });
//   }
// });

// // ---------------------------------------------------
// // HELPERS
// // ---------------------------------------------------
// const walkParts = (parts) => {
//   let body = "";
//   for (let part of parts) {
//     if (part.mimeType === "text/plain" && part.body?.data)
//       body += Buffer.from(part.body.data, "base64").toString();
//     if (part.mimeType === "text/html" && part.body?.data)
//       body += Buffer.from(part.body.data, "base64").toString();
//     if (part.parts) body += walkParts(part.parts);
//   }
//   return body;
// };

// const collectAttachments = (parts, result = []) => {
//   for (let p of parts) {
//     if (p.filename && p.body?.attachmentId) {
//       result.push({
//         filename: p.filename,
//         mimeType: p.mimeType,
//         size: p.body.size,
//         attachmentId: p.body.attachmentId,
//       });
//     }
//     if (p.parts) collectAttachments(p.parts, result);
//   }
//   return result;
// };

// function decodeBase64Url(str) {
//   return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64");
// }

// // ---------------------------------------------------
// // FULL EMAIL ANALYSIS (3-LAYER SECURITY)
// // ---------------------------------------------------
// app.get("/email/:id", async (req, res) => {
//   try {
//     if (!global.oAuthClient)
//       return res.status(401).json({ error: "Not authenticated" });

//     const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

//     const msg = await gmail.users.messages.get({
//       userId: "me",
//       id: req.params.id,
//       format: "full",
//     });

//     const payload = msg.data.payload;

//     // 1. Extract Body
//     let body = "";
//     if (payload.parts) body = walkParts(payload.parts);
//     else if (payload.body?.data)
//       body = Buffer.from(payload.body.data, "base64").toString();

//     // 2. Extract Links
//     const links = await extractLinks(body);

//     let urlScans = [];
//     let highestRiskLink = null;
//     let highestRiskScore = 0;

//     // -------------------------------------------------
//     // LAYER 1 & 2 → Safe Browsing + VirusTotal
//     // -------------------------------------------------
//     for (let url of links) {
//       const safe = await checkUrlSafety(url);
//       const vt = await scanUrlWithVirusTotal(url);

//       let risk = 0;
//       if (!safe.safe) risk += 40;
//       risk += vt.malicious * 25;
//       risk += vt.suspicious * 5;

//       urlScans.push({
//         url,
//         googleSafe: safe.safe,
//         googleThreat: safe.threat,
//         vtMalicious: vt.malicious,
//         vtSuspicious: vt.suspicious,
//         riskScore: risk,
//       });

//       if (risk > highestRiskScore) {
//         highestRiskScore = risk;
//         highestRiskLink = url;
//       }
//     }

//     // -------------------------------------------------
//     // ATTACHMENTS (VirusTotal)
//     // -------------------------------------------------
//     let attachments = [];
//     if (payload.parts) attachments = collectAttachments(payload.parts);

//     let attachmentScans = [];

//     for (let i = 0; i < Math.min(attachments.length, 2); i++) {
//       const att = attachments[i];

//       const fileRes = await gmail.users.messages.attachments.get({
//         userId: "me",
//         messageId: req.params.id,
//         id: att.attachmentId,
//       });

//       const buffer = decodeBase64Url(fileRes.data.data);

//       const vt = await scanFileWithVirusTotal(buffer, att.filename);

//       attachmentScans.push({
//         filename: att.filename,
//         vtMalicious: vt.malicious,
//         vtSuspicious: vt.suspicious,
//         riskScore: vt.malicious * 25 + vt.suspicious * 5,
//       });
//     }

//     // -------------------------------------------------
//     // LAYER 3 → DOCKER SANDBOX
//     // -------------------------------------------------
//     let sandbox = null;
//     let sandboxRisk = 0;

//     if (highestRiskLink) {
//       const raw = await runDockerSandbox(highestRiskLink);
//       sandbox = analyzeSandbox(raw);
//       sandboxRisk = sandbox.riskScore;
//     }

//     // -------------------------------------------------
//     // FINAL RISK SCORE
//     // -------------------------------------------------
//     let finalScore =
//       Math.max(highestRiskScore, sandboxRisk) +
//       attachmentScans.reduce((sum, a) => sum + a.riskScore, 0);

//     if (finalScore > 100) finalScore = 100;

//     let verdict = "SAFE";
//     if (finalScore >= 70) verdict = "MALICIOUS";
//     else if (finalScore >= 40) verdict = "SUSPICIOUS";

//     // FINAL RESPONSE
//     res.json({
//       body,
//       verdict,
//       finalScore,
//       urlScans,
//       attachmentScans,
//       sandbox,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ error: "Email analysis failed" });
//   }
// });

// // ---------------------------------------------------
// app.listen(5000, () => {
//   console.log("🚀 Server running on http://localhost:5000");
// });


// ======================================================
//  RAKSHAYANTRA AI - 3 LAYER SECURITY (FORCED SANDBOX)
// ======================================================

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const { exec } = require("child_process");
require("dotenv").config();

const authRoutes = require("./auth");
const { getEmails } = require("./gmail");

const { extractLinks } = require("./extractLinks");
const { checkUrlSafety } = require("./safeBrowsing");
const { scanUrlWithVirusTotal } = require("./virusTotal");
const { scanFileWithVirusTotal } = require("./virusTotalFile");

const { analyzeSandbox } = require("./sandbox/sandboxAnalyzer");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ---------------------------------------------------
// DOCKER SANDBOX RUNNER (ALWAYS RUNS)
// ---------------------------------------------------
function runDockerSandbox(url) {
  return new Promise((resolve) => {
    exec(`docker run --rm ry-sandbox "${url}"`, (err, stdout) => {
      if (err) return resolve({ error: "Docker sandbox failed" });

      try {
        resolve(JSON.parse(stdout));
      } catch {
        resolve({ error: "Invalid sandbox output" });
      }
    });
  });
}

// ---------------------------------------------------
// AUTH
// ---------------------------------------------------
app.use("/auth", authRoutes);

// ---------------------------------------------------
// INBOX
// ---------------------------------------------------
app.get("/emails", async (req, res) => {
  try {
    if (!global.oAuthClient)
      return res.status(401).json({ error: "Not authenticated" });

    const inbox = await getEmails(global.oAuthClient);
    res.json(inbox);
  } catch {
    res.status(500).json({ error: "Inbox error" });
  }
});

// ---------------------------------------------------
// HELPERS
// ---------------------------------------------------
const walkParts = (parts) => {
  let body = "";
  for (let p of parts) {
    if (p.mimeType === "text/plain" && p.body?.data)
      body += Buffer.from(p.body.data, "base64").toString();

    if (p.mimeType === "text/html" && p.body?.data)
      body += Buffer.from(p.body.data, "base64").toString();

    if (p.parts) body += walkParts(p.parts);
  }
  return body;
};

const collectAttachments = (parts, arr = []) => {
  for (let p of parts) {
    if (p.filename && p.body?.attachmentId) {
      arr.push({
        filename: p.filename,
        mimeType: p.mimeType,
        size: p.body.size,
        attachmentId: p.body.attachmentId,
      });
    }
    if (p.parts) collectAttachments(p.parts, arr);
  }
  return arr;
};

function decodeBase64Url(str) {
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

// ---------------------------------------------------
// FULL EMAIL ANALYSIS
// ALWAYS RUN ALL LAYERS
// ---------------------------------------------------
app.get("/email/:id", async (req, res) => {
  try {
    if (!global.oAuthClient)
      return res.status(401).json({ error: "Not authenticated" });

    const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: req.params.id,
      format: "full",
    });

    const payload = msg.data.payload;

    // 1. Extract Body
    let body = payload.parts
      ? walkParts(payload.parts)
      : Buffer.from(payload.body?.data || "", "base64").toString();

    // 2. Extract URLs
    const links = await extractLinks(body);

    // =============================
    // LAYER 1 & 2 → SAFE BROWSING + VT URL
    // =============================
    let urlScans = [];

    for (let url of links) {
      const safe = await checkUrlSafety(url);
      const vt = await scanUrlWithVirusTotal(url);

      urlScans.push({
        url,
        googleSafe: safe.safe,
        googleThreat: safe.threat,
        vtMalicious: vt.malicious,
        vtSuspicious: vt.suspicious,
      });
    }

    // =============================
    // LAYER 2 → ATTACHMENTS
    // =============================
    let attachments = payload.parts ? collectAttachments(payload.parts) : [];
    let attachmentScans = [];

    for (let i = 0; i < Math.min(attachments.length, 2); i++) {
      const att = attachments[i];

      const fileRes = await gmail.users.messages.attachments.get({
        userId: "me",
        messageId: req.params.id,
        id: att.attachmentId,
      });

      const buffer = decodeBase64Url(fileRes.data.data);
      const vt = await scanFileWithVirusTotal(buffer, att.filename);

      attachmentScans.push({
        filename: att.filename,
        vtMalicious: vt.malicious,
        vtSuspicious: vt.suspicious,
      });
    }

    // =============================
    // LAYER 3 → DOCKER SANDBOX
    // ALWAYS RUNS ON FIRST LINK
    // =============================
    let sandbox = null;

    if (links.length > 0) {
      const raw = await runDockerSandbox(links[0]); // always sandbox first URL
      sandbox = analyzeSandbox(raw);
    }

    // =============================
    // FINAL VERDICT (ANY UNSAFE = UNSAFE)
    // =============================
    let verdict = "SAFE";

    const urlMal = urlScans.some((u) => !u.googleSafe || u.vtMalicious > 0);
    const urlSusp = urlScans.some((u) => u.vtSuspicious > 0);

    const attMal = attachmentScans.some((a) => a.vtMalicious > 0);
    const attSusp = attachmentScans.some((a) => a.vtSuspicious > 0);

    const sandMal = sandbox && sandbox.riskScore >= 50;
    const sandSusp = sandbox && sandbox.riskScore > 20;

    if (urlMal || attMal || sandMal) verdict = "MALICIOUS";
    else if (urlSusp || attSusp || sandSusp) verdict = "SUSPICIOUS";

    // Final score is only for display
    let finalScore =
      (urlMal || attMal || sandMal) ? 90 :
      (urlSusp || attSusp || sandSusp) ? 55 : 5;

    res.json({
      body,
      verdict,
      finalScore,
      urlScans,
      attachmentScans,
      sandbox,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Email analysis failed" });
  }
});

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
