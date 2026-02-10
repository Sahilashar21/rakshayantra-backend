/**
 * In-memory scan report database
 * In production, use MongoDB, PostgreSQL, etc.
 */

let scanReports = [];

// Add a new scan report
function saveScanReport(report) {
  const reportWithId = {
    ...report,
    savedAt: new Date().toISOString()
  };
  
  scanReports.push(reportWithId);
  
  console.log(`💾 Saved scan report: ${report.emailId} | Verdict: ${report.verdict} | Total in DB: ${scanReports.length}`);
  
  // Keep only last 100 scans in memory
  if (scanReports.length > 100) {
    scanReports = scanReports.slice(-100);
  }
  
  return reportWithId;
}

// Get all scans from a specific date
function getScansByDate(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return scanReports.filter(report => {
    const reportDate = new Date(report.timestamp);
    return reportDate >= startOfDay && reportDate <= endOfDay;
  });
}

// Get all scans
function getAllScans() {
  return scanReports;
}

// Get scan by ID
function getScanById(scanId) {
  return scanReports.find(r => r.scanId === scanId);
}

// Get today's scans
function getTodayScans() {
  const today = getScansByDate(new Date());
  console.log(`📅 Getting today's scans: ${today.length} found`);
  return today;
}

// Get statistics for a date
function getStatsByDate(date) {
  const scans = getScansByDate(date);
  
  if (scans.length === 0) {
    return {
      total: 0,
      safe: 0,
      suspicious: 0,
      dangerous: 0,
      averageRiskScore: 0
    };
  }
  
  const stats = {
    total: scans.length,
    safe: scans.filter(s => s.verdict === "SAFE").length,
    suspicious: scans.filter(s => s.verdict === "SUSPICIOUS").length,
    dangerous: scans.filter(s => s.verdict === "MALICIOUS" || s.verdict === "DANGEROUS").length,
    averageRiskScore: Math.round(scans.reduce((sum, s) => sum + (s.finalScore || s.riskScore || 0), 0) / scans.length),
    topThreats: getThreatSummary(scans)
  };
  
  return stats;
}

// Get threat summary
function getThreatSummary(scans) {
  const threats = {};
  
  scans.forEach(scan => {
    if (scan.summaryReasons && Array.isArray(scan.summaryReasons)) {
      scan.summaryReasons.forEach(reason => {
        threats[reason] = (threats[reason] || 0) + 1;
      });
    }
  });
  
  return Object.entries(threats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([threat, count]) => ({ threat, count }));
}

module.exports = {
  saveScanReport,
  getScansByDate,
  getAllScans,
  getScanById,
  getTodayScans,
  getStatsByDate,
  getThreatSummary
};
