const { spawn } = require('child_process');

async function test() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9224',
    'http://localhost:5174/explore'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const listRes = await fetch('http://127.0.0.1:9224/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('5174'));
    if (!pageTab) return;

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
    };

    await new Promise(r => setTimeout(r, 3000));

    // Evaluate in page
    ws.send(JSON.stringify({
      id: 2,
      method: 'Runtime.evaluate',
      params: {
        expression: `({
          canvasWrapper: document.querySelector('.walkthrough-canvas-wrapper')?.innerHTML.substring(0, 300),
          canvasDisplay: document.querySelector('.walkthrough-canvas-wrapper > div')?.style.display,
          loaderPresent: !!document.querySelector('.scene-loader'),
          canvasWidth: document.querySelector('canvas')?.width,
          canvasHeight: document.querySelector('canvas')?.height
        })`,
        returnByValue: true
      }
    }));

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === 2) {
        console.log("EVAL RESULT:", data.result.result.value);
      }
    };

    await new Promise(r => setTimeout(r, 2000));
    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chromeProc.kill();
  }
}

test();

