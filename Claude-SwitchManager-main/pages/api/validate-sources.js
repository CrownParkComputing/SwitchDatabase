export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { titlesUrl, versionsUrl } = req.body;

  try {
    const validSources = [];
    const invalidSources = [];

    // Validate titles URL
    try {
      const titlesResponse = await fetch(titlesUrl);
      if (titlesResponse.ok) {
        validSources.push(titlesUrl);
      } else {
        invalidSources.push(titlesUrl);
      }
    } catch (error) {
      invalidSources.push(titlesUrl);
    }

    // Validate versions URL
    try {
      const versionsResponse = await fetch(versionsUrl);
      if (versionsResponse.ok) {
        validSources.push(versionsUrl);
      } else {
        invalidSources.push(versionsUrl);
      }
    } catch (error) {
      invalidSources.push(versionsUrl);
    }

    const message = `Validation complete. Valid sources: ${validSources.length}, Invalid sources: ${invalidSources.length}`;
    res.status(200).json({ message, validSources, invalidSources });
  } catch (error) {
    res.status(500).json({ message: 'Error validating sources', error: error.message });
  }
}