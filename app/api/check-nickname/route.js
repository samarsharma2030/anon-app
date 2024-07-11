import { clerkClient } from "@clerk/nextjs/server";
export default async (req, res) => {
  const { nickname } = req.query;
  try {
    const users = await clerkClient.users.getUserList({
      limit: 1,
      publicMetadata: { nickname }
    });
    res.status(200).json({ exists: users.length > 0 });
  } catch (error) {
    console.error("Error checking nickname:", error);
    res.status(500).json({ error: "Failed to check nickname" });
  }
};