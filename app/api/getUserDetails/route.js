// pages/api/getUserDetails.js
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { senderId } = req.body;
      const auth = getAuth({ req, res });
      const sender = await auth.users.getUser(senderId);
      res.status(200).json({ nickname: sender.publicMetadata.nickname });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed)`);
  }
}
