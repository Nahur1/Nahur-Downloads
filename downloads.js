const repository = 'Nahur1/Nahur-Downloads';
const releaseHost = new URL('https://github.com/');
const releasePath = '/' + repository + '/releases/download/';
const byId = (id) => document.getElementById(id);

async function showLatestRelease() {
  const response = await fetch('https://api.github.com/repos/' + repository + '/releases/latest', {
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return;
  const release = await response.json();
  const version = /^apps-v(\d+\.\d+\.\d+)$/.exec(release.tag_name)?.[1];
  if (!version || !Array.isArray(release.assets)) return;
  const names = {
    setup: 'Nahur-Setup-' + version + '.exe',
    portable: 'Nahur-Portable-' + version + '.exe',
    apk: 'Nahur-Android-' + version + '.apk',
    'win-sha': 'SHA256SUMS-Windows.txt',
    'android-sha': 'SHA256SUMS-Android.txt',
  };
  for (const [id, name] of Object.entries(names)) {
    const asset = release.assets.find(entry => entry.name === name);
    if (!asset) continue;
    byId(id).href = new URL(releasePath + release.tag_name + '/' + name, releaseHost).href;
    if (id === 'apk' && asset.size > 0) {
      byId('apk-size').textContent = new Intl.NumberFormat('fa-IR',{maximumFractionDigits:1}).format(asset.size / 1048576) + ' مگابایت';
    }
  }
  byId('version').textContent = 'v' + version + ' ↗';
}

showLatestRelease().catch(() => { /* GitHub Releases remains available without the API. */ });
