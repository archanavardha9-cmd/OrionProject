const { execSync } = require('child_process');

const cmd = '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --disable-gpu --dump-dom http://localhost:5174/explore';
try {
  const html = execSync(cmd).toString();
  const m = html.match(/<section class="explorer-scene-shell"[\s\S]*?<\/section>/);
  if (m) {
    console.log("FULL SECTION LENGTH:", m[0].length);
    console.log(m[0].substring(0, 1500));
  }
} catch (e) {
  console.error(e.message);
}
