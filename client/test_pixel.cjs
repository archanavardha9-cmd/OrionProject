const { spawn } = require('child_process');

async function testPixel() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,800',
    '--remote-debugging-port=9226',
    'http://localhost:5174/explore'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const listRes = await fetch('http://127.0.0.1:9226/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('5174'));
    if (!pageTab) return;

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
    };

    await new Promise(r => setTimeout(r, 3500));

    ws.send(JSON.stringify({
      id: 2,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const canvas = document.querySelector('canvas');
          if (!canvas) return 'NO CANVAS';
          const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
          if (!gl) return 'NO GL';
          const pixel = new Uint8Array(4);
          gl.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
          return {
            width: canvas.width,
            height: canvas.height,
            pixel: Array.from(pixel),
            rect: canvas.getBoundingClientRect()
          };
        })()`,
        returnByValue: true
      }
    }));

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === 2) {
        console.log("GL PIXEL EVAL:", data.result.result.value);
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

testPixel();

