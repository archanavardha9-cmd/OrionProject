const { spawn } = require('child_process');
const fs = require('fs');

async function screenshot(url, filename) {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,800',
    '--remote-debugging-port=9225',
    url
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const listRes = await fetch('http://127.0.0.1:9225/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('5174'));
    if (!pageTab) return;

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
    };

    // Wait 4 seconds for full render
    await new Promise(r => setTimeout(r, 4000));

    ws.send(JSON.stringify({
      id: 2,
      method: 'Page.captureScreenshot',
      params: { format: 'png' }
    }));

    await new Promise((resolve) => {
      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === 2) {
          const buffer = Buffer.from(data.result.data, 'base64');
          fs.writeFileSync(filename, buffer);
          console.log(`Saved screenshot to ${filename} (${buffer.length} bytes)`);
          resolve();
        }
      };
    });

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chromeProc.kill();
  }
}

async function run() {
  await screenshot('http://localhost:5174/explore', 'C:\\Users\\hp\\OneDrive\\Desktop\\OrionProject\\client\\screenshot_explore.png');
  await new Promise(r => setTimeout(r, 1000));
  await screenshot('http://localhost:5174/', 'C:\\Users\\hp\\OneDrive\\Desktop\\OrionProject\\client\\screenshot_home.png');
}

run();

