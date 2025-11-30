// export function analyzeSandbox(report) {
//   let flags = [];
//   let risk = 0;

//   // 1. Too many redirects
//   const redirectCount = report.responses.filter(r => r.status >= 300 && r.status < 400).length;
//   if (redirectCount > 2) {
//     flags.push(`High redirect count (${redirectCount})`);
//     risk += 15;
//   }

//   // 2. Hidden iframes
//   if (report.html.includes("<iframe") && report.html.includes("display:none")) {
//     flags.push("Hidden tracking iframe detected");
//     risk += 20;
//   }

//   // 3. Suspicious forms asking password
//   if (report.html.match(/type="password"/i)) {
//     flags.push("Password input found — possible credential harvest");
//     risk += 25;
//   }

//   // 4. Suspicious external JS
//   const suspiciousJS = report.requests.filter(req =>
//     req.url.includes(".xyz") ||
//     req.url.includes("track") ||
//     req.url.includes("verify") ||
//     req.url.includes("cdn") ||
//     req.url.includes("auth") ||
//     req.url.includes("login")
//   );
  
//   if (suspiciousJS.length > 0) {
//     flags.push("Suspicious external JavaScript resources loaded");
//     risk += 20;
//   }

//   // 5. Obfuscated JS
//   if (report.html.match(/eval\(/) || report.html.match(/atob\(/)) {
//     flags.push("Detected obfuscated JavaScript (eval/atob)");
//     risk += 30;
//   }

//   // 6. Console errors
//   const errors = report.logs.filter(l => l.type === "error");
//   if (errors.length > 0) {
//     flags.push("Page triggered JavaScript errors (often found in phishing kits)");
//     risk += 10;
//   }

//   // Final risk cap
//   if (risk > 100) risk = 100;

//   return {
//     riskScore: risk,
//     flags,
//   };
// }


exports.analyzeSandbox = function (report) {
  let flags = [];
  let risk = 0;

  // 1. Too many redirects
  const redirectCount = report.responses.filter(
    (r) => r.status >= 300 && r.status < 400
  ).length;

  if (redirectCount > 2) {
    flags.push(`High redirect count (${redirectCount})`);
    risk += 15;
  }

  // 2. Hidden iframes
  if (
    report.html.includes("<iframe") &&
    report.html.includes("display:none")
  ) {
    flags.push("Hidden tracking iframe detected");
    risk += 20;
  }

  // 3. Suspicious forms asking password
  if (report.html.match(/type="password"/i)) {
    flags.push("Password input found — possible credential harvest");
    risk += 25;
  }

  // 4. Suspicious external JS
  const suspiciousJS = report.requests.filter(
    (req) =>
      req.url.includes(".xyz") ||
      req.url.includes("track") ||
      req.url.includes("verify") ||
      req.url.includes("cdn") ||
      req.url.includes("auth") ||
      req.url.includes("login")
  );

  if (suspiciousJS.length > 0) {
    flags.push("Suspicious external JavaScript resources loaded");
    risk += 20;
  }

  // 5. Obfuscated JS
  if (report.html.match(/eval\(/) || report.html.match(/atob\(/)) {
    flags.push("Detected obfuscated JavaScript (eval/atob)");
    risk += 30;
  }

  // 6. Console errors
  const errors = report.logs.filter((l) => l.type === "error");

  if (errors.length > 0) {
    flags.push(
      "Page triggered JavaScript errors (often found in phishing kits)"
    );
    risk += 10;
  }

  // Final cap
  if (risk > 100) risk = 100;

  return {
    riskScore: risk,
    flags,
  };
};
