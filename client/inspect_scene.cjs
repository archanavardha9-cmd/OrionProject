const { spawn } = require('child_process');

async function inspectScene() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,800',
    '--remote-debugging-port=9227',
    'http://localhost:5174/explore'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const listRes = await fetch('http://127.0.0.1:9227/json');
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
          // Find R3F root or fiber node
          const fiberKey = Object.keys(canvas).find(k => k.startsWith('__reactFiber$'));
          const fiber = canvas[fiberKey];
          
          let state = null;
          let curr = fiber;
          while (curr && !state) {
            if (curr.memoizedProps && curr.memoizedProps.state) {
              state = curr.memoizedProps.state;
            }
            curr = curr.return;
          }
          
          // Or search window.__r3f
          const r3f = window.__r3f;

          return {
            hasFiber: !!fiber,
            fiberType: fiber?.elementType?.name || fiber?.type?.name,
            canvasDataEngine: canvas.getAttribute('data-engine'),
            webglVersion: (canvas.getContext('webgl2') ? 'webgl2' : 'webgl1')
          };
        })()`,
        returnByValue: true
      }
    }));

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === 2) {
        console.log("SCENE INSPECT RESULT:", data.result.result.value);
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

inspectScene();

