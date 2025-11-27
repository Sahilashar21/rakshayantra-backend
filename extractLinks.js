const axios = require("axios");
const cheerio = require("cheerio");

// REGEX to find URLs in plain text
const urlRegex = /(https?:\/\/[^\s]+)/g;

// ---------------------------------------------
// Extract URLs from plain text body
// ---------------------------------------------
function extractTextLinks(body) {
  const matches = body.match(urlRegex);
  return matches ? matches : [];
}

// ---------------------------------------------
// Extract URLs from HTML emails
// ---------------------------------------------
function extractHtmlLinks(html) {
  const $ = cheerio.load(html);
  const links = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (href) links.push(href);
  });

  return links;
}

// ---------------------------------------------
// Clean tracking URLs (especially Gmail redirects)
// ---------------------------------------------
function cleanUrl(url) {
  try {
    let u = new URL(url);

    // Gmail redirect example:
    // https://www.google.com/url?q=http://malicious.com
    if (u.hostname === "www.google.com" && u.searchParams.get("q")) {
      return u.searchParams.get("q");
    }

    return url;
  } catch {
    return url;
  }
}

// ---------------------------------------------
// Expand shortened URLs (bit.ly, tinyurl…)
// ---------------------------------------------
async function expandUrl(url) {
  try {
    const res = await axios.head(url, { maxRedirects: 5 });
    return res.request.res.responseUrl || url;
  } catch (err) {
    return url;
  }
}

// ---------------------------------------------
// MAIN FUNCTION – Extract ALL links (text + HTML)
// ---------------------------------------------
async function extractLinks(body) {
  if (!body) return [];

  // Extract from plain text
  let textLinks = extractTextLinks(body);

  // Extract from HTML
  let htmlLinks = extractHtmlLinks(body);

  // Combine both
  let combined = [...textLinks, ...htmlLinks].map(cleanUrl);

  // Expand shortened URLs
  const expanded = [];
  for (let link of combined) {
    expanded.push(await expandUrl(link));
  }

  // Remove duplicates
  return [...new Set(expanded)];
}

module.exports = { extractLinks };
