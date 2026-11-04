const { spawn } = require('child_process');

async function testDebug() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,800',
    '--remote-debugging-port=9228',
    'http://localhost:5174/explore'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const listRes = await fetch('http://127.0.0.1:9228/json');
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
          if (!window.__MALL_DEBUG) return 'NO DEBUG OBJ';
          const { camera, scene } = window.__MALL_DEBUG;
          return {
            camPos: [camera.position.x, camera.position.y, camera.position.z],
            camRot: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
            childCount: scene.children.length,
            childNames: scene.children.map(c => c.name || c.type)
          };
        })()`,
        returnByValue: true
      }
    }));

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === 2) {
        console.log("MALL DEBUG STATE:", data.result.result.value);
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

testDebug();

