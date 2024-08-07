import requestIp from 'request-ip';

export default function handler(req, res) {
  const clientIp = requestIp.getClientIp(req);
  const allowedIp = process.env.ALLOWED_IP;

  if (clientIp === allowedIp) {
    res.status(200).json({ authorized: true });
  } else {
    res.status(403).json({ authorized: false });
  }
}