# K6 Performance Testing Guide (macOS)

Complete guide to setting up, running, and viewing k6 performance test reports on macOS.

## 📋 Prerequisites

- **Homebrew** - macOS package manager
- **k6** - Performance testing tool
- **Node.js** - For generating HTML reports
- **VSCode** (optional) - For viewing reports with Live Server

## 🚀 Quick Start

### 1. Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install k6

```bash
brew install k6
```

### 3. Verify Installation

```bash
k6 version
```

### 4. Install Node.js (if not installed)

```bash
brew install node
node --version
```

## 📝 Creating Your First Test

### Basic Test Script (`script.js`)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,              // 10 virtual users
  duration: '30s',      // Run for 30 seconds
};

export default function() {
  const res = http.get('https://test-api.k6.io/public/crocodiles/');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

### Run the Test

```bash
# Basic run
k6 run script.js

# Run with JSON output for reports
k6 run --out json=results.json script.js

# Custom VUs and duration
k6 run --vus 20 --duration 1m script.js
```

## 📊 Generate HTML Report

### Step 1: Create Report Generator
Create `generate-report.js`, see the existing file as example.

### Step 2: Run Test and Generate Report

```bash
# Run k6 test with JSON output
k6 run --out json=results.json script.js

# Generate HTML report
node generate-report.js results.json

# Open report in default browser
open results.html
```

**Or chain them together:**
```bash
k6 run --out json=results.json script.js && node generate-report.js results.json && open results.html
```

## 🌐 View Report with Live Server (VSCode)

### Install Live Server Extension

1. Open VSCode
2. Press `Cmd+Shift+X`
3. Search for **"Live Server"** by Ritwick Dey
4. Click **Install**

### Open Report

1. Right-click on `results.html` in VSCode
2. Select **"Open with Live Server"**
3. Your browser will open with the report at `http://127.0.0.1:5500/results.html`
4. Report auto-refreshes when you re-run tests!

### Alternative: Open in Browser Directly

```bash
# Safari (default browser)
open results.html

# Chrome
open -a "Google Chrome" results.html

# Firefox
open -a Firefox results.html
```

### Local Execution with Cloud Visualization

```bash
# Run test locally but view results in k6 Cloud
k6 login cloud
k6 run --out cloud script.js
```

This gives you:
- ✅ Fast local execution
- ✅ Beautiful cloud dashboard
- ✅ Historical test comparison
- ✅ Share results with team

### Run Test in Cloud (Distributed Load)

```bash
# Execute from k6's cloud infrastructure
k6 cloud script.js
```

Benefits:
- Load generated from multiple global locations
- No local resource usage
- More realistic distributed traffic patterns

### Environment Variables

```bash
# Use environment variables in tests
k6 run -e BASE_URL=https://api.example.com -e API_KEY=secret script.js
```

Access in script:
```javascript
const BASE_URL = __ENV.BASE_URL || 'https://default.com';
const API_KEY = __ENV.API_KEY;
```

### Debug Mode

```bash
# See detailed HTTP request/response data
k6 run --http-debug script.js

# Full debug output
k6 run --http-debug="full" script.js
```

### Save Multiple Output Formats

```bash
# Save to multiple formats simultaneously
k6 run --out json=results.json --out csv=results.csv script.js
```

### Quick Smoke Test by running 1 Virtual User for 30 sec

```bash
# Test with minimal load
k6 run --vus 1 --duration 30s script.js
```

### Tag Requests for Better Analysis

```javascript
http.get('https://api.example.com/users', {
  tags: { name: 'GetUsers', page: 'home' }
});
```

## 🔍 Viewing k6 Cloud Results

### Step 1: Login to k6 Cloud

```bash
# One-time setup
k6 login cloud
```

This will open your browser for authentication.

**Alternative with API token:**
```bash
k6 login cloud --token YOUR_API_TOKEN
```

Get your token at: https://app.k6.io/account/api-token

### Step 2: Run Test with Cloud Output

```bash
# Run locally, send results to cloud
k6 run --out cloud script.js
```

You'll see a URL in the output:
```
output: cloud (https://app.k6.io/runs/{currentRunId})
```

**Open that URL to view results!**

### Step 3: Access Cloud Dashboard
Go to https://eshayakhmedov.grafana.net/a/k6-app/projects to see results per project

**Direct link:**
```bash
open https://app.k6.io
```

**Navigate to:**
1. Go to https://app.k6.io
2. Click **"Test Runs"** in sidebar
3. Select your test run
4. View detailed metrics and charts

### What You'll See in Cloud:

- 📈 **Performance charts** - Response times, throughput, errors
- 🌍 **Geographic data** - Load distribution (if using cloud execution)
- ⏱️ **Timeline view** - How metrics changed over time
- ✅ **Check results** - Pass/fail status of your assertions
- 📊 **Comparison** - Compare with previous test runs

### Quick Workflow

```bash
# Login once
k6 login cloud

# Run test
k6 run --out cloud script.js

# Open dashboard
open https://app.k6.io
```

**Note:** k6 Cloud also emails you a link to results after each test run!

## 🛠️ Useful Commands

```bash
# Check k6 version
k6 version

# Validate script without running
k6 inspect script.js

# Run with specific number of iterations (not duration)
k6 run --iterations 100 script.js

# Check cloud login status
k6 login cloud --show

# Generate test script from HAR file
k6 archive script.js

# List available outputs
k6 run --help
```

## 📁 Project Structure

```
k6/
├── script.js              # Main test script
├── generate-report.js     # HTML report generator
├── results.json           # Test results (JSON)
├── results.html           # Generated HTML report
└── README.md              # This file
```

## 🔗 Useful Resources

- **k6 Documentation:** https://k6.io/docs/
- **k6 Cloud Dashboard:** https://app.k6.io
- **API Documentation:** https://k6.io/docs/javascript-api/
- **Examples:** https://k6.io/docs/examples/
- **Community Forum:** https://community.k6.io

## 📝 Notes

- **Free k6 Cloud tier:** 50 test runs/month, 14-day result retention
- **Local HTML reports:** Stored permanently on your machine
- **Best practice:** Start with smoke tests (1 VU), then scale up
- **Tip:** Use `--out cloud` even for local runs to get better visualizations

---

**Happy Testing! 🚀**