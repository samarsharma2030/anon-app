import { clerkClient } from '@clerk/nextjs/server';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { userId, nickname } = req.body;
  if (!userId || !nickname) {
    return res.status(400).json({ error: 'User ID and nickname are required' });
  }
  try {
    const existingUsers = await clerkClient.users.getUserList({ limit: 100 });
    const nicknameExists = existingUsers.some(
      (existingUser) => existingUser.publicMetadata.nickname === nickname
    );
    if (nicknameExists) {
      return res.status(400).json({ error: 'Nickname is already taken' });
    }
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        nickname,
      },
    });
    return res.status(200).json({ message: 'Nickname updated successfully' });
  } catch (error) {
    console.error('Error updating nickname:', error);
    return res.status(500).json({ error: 'Failed to update nickname' });
  }
}