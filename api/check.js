export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ status: "error", message: "Missing URL" });

  try {
    const response = await fetch(url, { method: "GET", redirect: "follow" });
    const text = await response.text();

    const blockedPhrases = ["blocked", "access denied", "content filtered", "iboss", "forbidden"];
    const found = blockedPhrases.some(p => text.toLowerCase().includes(p));

    if (!response.ok) {
      return res.status(200).json({ status: "error", message: `HTTP ${response.status}` });
    }

    if (found) {
      return res.status(200).json({ status: "blocked", message: "Blocked text detected" });
    } else {
      return res.status(200).json({ status: "reachable", message: "OK" });
    }

  } catch (err) {
    return res.status(200).json({ status: "error", message: err.message });
  }
}
