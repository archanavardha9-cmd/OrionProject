const { spawn } = require('child_process');

async function test() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    'http://localhost:5174/explore'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const listRes = await fetch('http://127.0.0.1:9223/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('5174'));
    if (!pageTab) {
      console.log("No page tab found");
      return;
    }

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Runtime.enable' }));
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.method === 'Console.messageAdded') {
        console.log('[BROWSER CONSOLE]', data.params.message.text);
      }
      if (data.method === 'Runtime.exceptionThrown') {
        console.log('[BROWSER EXCEPTION]', JSON.stringify(data.params.exceptionDetails));
      }
      if (data.method === 'Log.entryAdded') {
        console.log('[BROWSER LOG]', data.params.entry.text);
      }
    };

    await new Promise(r => setTimeout(r, 4000));
    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chromeProc.kill();
  }
}

test();

