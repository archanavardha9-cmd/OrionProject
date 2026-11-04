const http = require('http');
const { spawn } = require('child_process');

// Start chrome with remote debugging
const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  'http://localhost:5174/explore'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    console.log("CHROME TABS:", tabs);
  } catch (e) {
    console.error("CDP ERROR:", e.message);
  } finally {
    chromeProc.kill();
  }
}, 3000);

