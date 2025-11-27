// // const express = require("express");
// // const cors = require("cors");
// // const authRoutes = require("./auth");
// // const { getEmails } = require("./gmail");

// // const app = express();

// // // IMPORTANT: allow only frontend origin
// // app.use(cors({
// //   origin: "http://localhost:3000",
// //   credentials: true
// // }));

// // app.use("/auth", authRoutes);

// // // GET REAL EMAILS
// // app.get("/emails", async (req, res) => {
// //   try {
// //     if (!global.oAuthClient)
// //       return res.status(401).json({ error: "Not authenticated" });

// //     const inbox = await getEmails(global.oAuthClient);
// //     res.json(inbox);
// //   } catch (e) {
// //     console.log(e);
// //     res.status(500).json({ error: "Failed to fetch emails" });
// //   }
// // });

// // app.listen(5000, () => console.log("Server running on port 5000"));


// const express = require("express");
// const cors = require("cors");
// const authRoutes = require("./auth");
// const { getEmails } = require("./gmail");
// const { google } = require("googleapis");
// const { extractLinks } = require("./extractLinks");

// const app = express();

// // FIXED CORS (required for React)
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));

// app.use("/auth", authRoutes);


// // ============================================
// // GET FAST INBOX (only headers, loads quickly)
// // ============================================

// app.get("/emails", async (req, res) => {
//   try {
//     if (!global.oAuthClient)
//       return res.status(401).json({ error: "Not authenticated" });

//     const inbox = await getEmails(global.oAuthClient);
//     res.json(inbox);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ error: "Failed to fetch emails" });
//   }
// });


// // ============================================
// // GET FULL EMAIL + LINK EXTRACTION
// // ============================================

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

//     // Extract plain text body
//     let body = "";
//     const parts = email.data.payload.parts;

//     if (parts) {
//       const textPart = parts.find(p => p.mimeType === "text/plain");
//       if (textPart?.body?.data) {
//         body = Buffer.from(textPart.body.data, "base64").toString();
//       }
//     }

//     // Extract clean links
//     const links = await extractLinks(body);

//     res.json({
//       headers: email.data.payload.headers,
//       snippet: email.data.snippet,
//       body,
//       links
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to load full email" });
//   }
// });


// // ============================================
// // START SERVER
// // ============================================

// app.listen(5000, () => console.log("Server running on port 5000"));


const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth");
const { getEmails } = require("./gmail");
const { google } = require("googleapis");
const { extractLinks } = require("./extractLinks");

const app = express();

// Allow React frontend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Google OAuth Routes
app.use("/auth", authRoutes);


// ============================================
// FAST INBOX — loads 20 most recent emails
// ============================================

app.get("/emails", async (req, res) => {
  try {
    if (!global.oAuthClient) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const inbox = await getEmails(global.oAuthClient);
    res.json(inbox);

  } catch (err) {
    console.error("Inbox Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});


// ============================================
// FULL EMAIL LOADER (body + links)
// Handles HTML, nested MIME, etc.
// ============================================

// Helps extract body from nested parts
const walkParts = (parts) => {
  let body = "";

  for (let part of parts) {

    // Extract plain text
    if (part.mimeType === "text/plain" && part.body?.data) {
      body += Buffer.from(part.body.data, "base64").toString();
    }

    // Extract HTML
    if (part.mimeType === "text/html" && part.body?.data) {
      body += Buffer.from(part.body.data, "base64").toString();
    }

    // Recursively handle nested parts
    if (part.parts) {
      body += walkParts(part.parts);
    }
  }

  return body;
};


app.get("/email/:id", async (req, res) => {
  try {
    if (!global.oAuthClient) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const gmail = google.gmail({ version: "v1", auth: global.oAuthClient });

    const email = await gmail.users.messages.get({
      userId: "me",
      id: req.params.id,
      format: "full"
    });

    const payload = email.data.payload;

    // Extract body (HTML + text + nested)
    let body = "";

    if (payload.parts) {
      body = walkParts(payload.parts);
    } else if (payload.body?.data) {
      body = Buffer.from(payload.body.data, "base64").toString();
    }

    // Extract clean & expanded links
    const links = await extractLinks(body);

    res.json({
      headers: payload.headers,
      snippet: email.data.snippet,
      body,
      links
    });

  } catch (err) {
    console.error("Full Email Error:", err);
    res.status(500).json({ error: "Failed to load email" });
  }
});


// ============================================
// START SERVER
// ============================================

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
