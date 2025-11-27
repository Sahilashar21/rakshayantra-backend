const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

const router = express.Router();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// LOGIN
router.get("/login", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"]
  });

  res.redirect(authUrl);
});

// CALLBACK
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  global.oAuthClient = oAuth2Client;

  res.redirect(process.env.FRONTEND_URL + "/inbox");
});

module.exports = router;
