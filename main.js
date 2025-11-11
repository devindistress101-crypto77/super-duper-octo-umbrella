async function runScan() {
  const urls = document.getElementById("urls").value.split("\n").map(u => u.trim()).filter(Boolean);
  if (urls.length === 0) return alert("Enter at least one URL.");

  document.getElementById("results").textContent = "Scanning...";
  const report = { generated: new Date().toISOString(), results: [] };

  for (const url of urls) {
    const entry = { url, time: new Date().toISOString() };
    try {
      const r = await fetch(url, { method: "GET", cache: "no-store", mode: "no-cors" });
      if (r.type === "opaque") {
        entry.verdict = "unknown (CORS/opaque)";
      } else {
        entry.status = r.status;
        const t = await r.text();
        const s = t.toLowerCase();
        const flags = ["iboss","blocked","access denied","this site is blocked","content filtered","forbidden","policy"];
        entry.verdict = flags.some(w => s.includes(w)) ? "blocked" :
                        (r.status >= 200 && r.status < 400) ? "reachable" :
                        "unknown (" + r.status + ")";
      }
    } catch (err) {
      entry.verdict = "network error or blocked";
      entry.error = String(err);
    }
    report.results.push(entry);
    document.getElementById("results").textContent = JSON.stringify(report, null, 2);
  }
}

function clearAll() {
  document.getElementById("urls").value = "";
  document.getElementById("results").textContent = "";
}

function copyJSON() {
  navigator.clipboard.writeText(document.getElementById("results").textContent);
  alert("Results copied to clipboard.");
}
