module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const pat = process.env.GITHUB_PAT;
  if (!pat) {
    return res.status(500).json({ error: 'GitHub PAT not configured' });
  }

  try {
    const response = await fetch('https://api.github.com/repos/IgnatMaldive/micro8/dispatches', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${pat}`,
      },
      body: JSON.stringify({ event_type: 'create-dated-file' }),
    });

    if (response.ok) {
      res.status(200).json({ message: 'Webhook triggered successfully' });
    } else {
      res.status(response.status).json({ error: `GitHub API error: ${response.statusText}` });
    }
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};