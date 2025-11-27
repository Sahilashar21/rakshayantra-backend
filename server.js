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



import React, { useEffect, useState } from "react";
import api from "../api";
import '../inbox.css';
export default function InboxPage() {
  const [emails, setEmails] = useState([]);
  const [selected, setSelected] = useState(null);
  const [body, setBody] = useState("");
  const [links, setLinks] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load inbox
  useEffect(() => {
    api.get("/emails")
      .then(res => {
        setEmails(res.data);
        setLoading(false);

        if (res.data.length > 0) {
          loadFullEmail(res.data[0].id, res.data[0]);
        }
      })
      .catch(err => {
        console.error("INBOX LOAD ERROR:", err);
      });
  }, []);

  // Load full body + links + scan results
  const loadFullEmail = (id, emailMeta) => {
    setSelected(emailMeta);

    api.get(`/email/${id}`)
      .then(res => {
        setBody(res.data.body || "");
        setLinks(res.data.links || []);
        setScans(res.data.scans || []);
      })
      .catch(err => console.error("EMAIL BODY ERROR:", err));
  };

  if (loading)
    return <h2 className="loading">Loading inbox...</h2>;

  return (
    <>
      {/* Header */}
      <div className="header">
        <div className="logo">RakshaYantra AI</div>
        <div className="tagline">AI-Powered Phishing Detection & Email Security</div>
      </div>

      {/* Main Container */}
      <div className="container">
        {/* Left Sidebar: Inbox Scanner */}
        <div className="sidebar">
          <h2>Inbox Scanner</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search emails..." />
          </div>
          <a href="http://localhost:5000/auth/login" className="login-btn">
            Login with Google
          </a>
          <ul className="email-list">
            {emails.map(email => (
              <li
                key={email.id}
                className={`email-item ${selected?.id === email.id ? 'selected' : ''}`}
                onClick={() => loadFullEmail(email.id, email)}
              >
                <h4>{email.subject}</h4>
                <p>{email.from}</p>
                <small>{email.date}</small>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel: Email Analysis */}
        <div className="main-panel">
          {selected ? (
            <>
              <h2>{selected.subject}</h2>
              <p>{selected.from}</p>
              <i>{selected.date}</i>
              <hr />
              <div className="email-body" dangerouslySetInnerHTML={{ __html: body }} />
              <hr />
              <div className="links-section">
                <h3>Extracted Links:</h3>
                {links.length === 0 ? <p>No links found</p> : (
                  <ul className="links-list">
                    {links.map((l, i) => (
                      <li key={i}>
                        <a href={l} target="_blank" rel="noreferrer">{l}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <hr />
              <div className="scans-section">
                <h3>Scan Results:</h3>
                {scans.map((s, i) => (
                  <div key={i} className="scan-item">
                    <b>{s.link}</b>
                    <div className={`status ${s.safe ? 'safe' : 'dangerous'}`}>
                      {s.safe ? 'SAFE ✓' : `DANGEROUS — ${s.threat}`}
                    </div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${!s.safe ? 'danger' : ''}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <h2>Select an email to analyze</h2>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        RakshaYantra AI - Protecting Against Phishing Threats | <a href="#">Learn More</a> | Powered by Advanced AI
      </div>
    </>
  );
}
