// generate-report.js
const fs = require('fs');

const filename = process.argv[2] || 'results.json';

if (!fs.existsSync(filename)) {
  console.error(`Error: File '${filename}' not found!`);
  process.exit(1);
}

const data = fs.readFileSync(filename, 'utf8');
const lines = data.trim().split('\n');

const metrics = {};
let totalRequests = 0;
let failedRequests = 0;

lines.forEach(line => {
  try {
    const json = JSON.parse(line);
    
    if (json.type === 'Metric') {
      if (!metrics[json.metric]) {
        metrics[json.metric] = [];
      }
      metrics[json.metric].push(json.data);
    }
    
    if (json.type === 'Point') {
      if (json.metric === 'http_req_duration') {
        totalRequests++;
      }
      if (json.metric === 'http_req_failed' && json.data.value === 1) {
        failedRequests++;
      }
    }
  } catch (e) {}
});

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>K6 Performance Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 40px; background: #f8f9fa; }
    .metric-card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .metric-card h3 { color: #667eea; font-size: 0.9em; text-transform: uppercase; margin-bottom: 10px; }
    .metric-value { font-size: 2.5em; font-weight: bold; color: #2d3748; margin-bottom: 5px; }
    .success { color: #48bb78; }
    .error { color: #f56565; }
    .details { padding: 40px; }
    .section { margin-bottom: 40px; }
    .section h2 { color: #2d3748; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; text-align: left; }
    td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
    tr:hover { background: #f7fafc; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ K6 Performance Test Report</h1>
      <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
    <div class="summary">
      <div class="metric-card">
        <h3>Total Requests</h3>
        <div class="metric-value">${totalRequests}</div>
      </div>
      <div class="metric-card">
        <h3>Success Rate</h3>
        <div class="metric-value ${failedRequests === 0 ? 'success' : 'error'}">
          ${totalRequests > 0 ? ((totalRequests - failedRequests) / totalRequests * 100).toFixed(1) : 0}%
        </div>
        <div>${totalRequests - failedRequests} succeeded, ${failedRequests} failed</div>
      </div>
    </div>
    <div class="details">
      <div class="section">
        <h2>📈 Metrics Collected</h2>
        <table>
          <tr><th>Metric</th><th>Count</th></tr>
          ${Object.keys(metrics).map(key => `<tr><td>${key}</td><td>${metrics[key].length}</td></tr>`).join('')}
        </table>
      </div>
    </div>
  </div>
</body>
</html>`;

const outputFile = filename.replace('.json', '.html');
fs.writeFileSync(outputFile, html);

console.log('✅ HTML report generated!');
console.log(`📄 Report: ${outputFile}`);
