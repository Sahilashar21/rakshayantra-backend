// const { google } = require("googleapis");

// async function getEmails(oAuthClient) {
//   const gmail = google.gmail({ version: "v1", auth: oAuthClient });

//   let allMessages = [];
//   let nextPageToken = null;

//   do {
//     const response = await gmail.users.messages.list({
//       userId: "me",
//       maxResults: 20,
//       pageToken: nextPageToken || undefined,
//     });

//     if (response.data.messages) {
//       allMessages = allMessages.concat(response.data.messages);
//     }

//     nextPageToken = response.data.nextPageToken;

//   } while (nextPageToken);

//   // LIMIT to 50 emails to avoid slow demo
//   allMessages = allMessages.slice(0, 50);

//   let inbox = [];

//   for (let msg of allMessages) {
//     let detail = await gmail.users.messages.get({
//       userId: "me",
//       id: msg.id,
//       format: "full"
//     });

//     const headers = detail.data.payload.headers;

//     const subject = headers.find(h => h.name === "Subject")?.value || "";
//     const from = headers.find(h => h.name === "From")?.value || "";
//     const date = headers.find(h => h.name === "Date")?.value || "";

//     let body = "";

//     if (detail.data.payload.parts) {
//       const part = detail.data.payload.parts.find(p => p.mimeType === "text/plain");
//       if (part && part.body?.data) {
//         body = Buffer.from(part.body.data, "base64").toString();
//       }
//     }

//     inbox.push({
//       id: msg.id,
//       subject,
//       from,
//       date,
//       body
//     });
//   }

//   return inbox;
// }

// module.exports = { getEmails };

// const { google } = require("googleapis");

// async function getEmails(oAuthClient) {
//   const gmail = google.gmail({ version: "v1", auth: oAuthClient });

//   // Load ONLY 20 recent emails
//   const res = await gmail.users.messages.list({
//     userId: "me",
//     maxResults: 20
//   });

//   const messages = res.data.messages || [];
//   let inbox = [];

//   for (let msg of messages) {
//     let detail = await gmail.users.messages.get({
//       userId: "me",
//       id: msg.id,
//       format: "metadata",
//       metadataHeaders: ["Subject", "From", "Date"]
//     });

//     const headers = detail.data.payload.headers;

//     inbox.push({
//       id: msg.id,
//       subject: headers.find(h => h.name === "Subject")?.value || "",
//       from: headers.find(h => h.name === "From")?.value || "",
//       date: headers.find(h => h.name === "Date")?.value || "",
//       snippet: detail.data.snippet
//     });
//   }

//   return inbox;
// }

// module.exports = { getEmails };

const { google } = require("googleapis");

async function getEmails(oAuthClient) {
  const gmail = google.gmail({ version: "v1", auth: oAuthClient });

  // Load ONLY 20 emails (fast)
  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 20
  });

  const messages = res.data.messages || [];

  let inbox = [];

  for (let msg of messages) {
    const detail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "metadata",
      metadataHeaders: ["Subject", "From", "Date"]
    });

    const headers = detail.data.payload.headers;

    inbox.push({
      id: msg.id,
      subject: headers.find(h => h.name === "Subject")?.value || "(No Subject)",
      from: headers.find(h => h.name === "From")?.value || "",
      date: headers.find(h => h.name === "Date")?.value || ""
    });
  }

  return inbox;
}

module.exports = { getEmails };
