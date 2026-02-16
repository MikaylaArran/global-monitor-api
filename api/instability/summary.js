export default async function handler(req, res) {
  // Allow your GitHub Pages site to call this API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const repoUrl = process.env.REPO_JSON_URL;

    if (!repoUrl) {
      return res.status(500).json({ error: "Missing REPO_JSON_URL env var" });
    }

    const r = await fetch(repoUrl, {
      headers: { "Accept": "application/json" }
    });

    if (!r.ok) {
      return res.status(502).json({ error: `Upstream fetch failed: ${r.status}` });
    }

    const data = await r.json();

    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
