// layout.jsx
import { Inter } from "next/font/google";
import "./globals.css"; // Import your global CSS here
import { ClerkProvider } from "@clerk/nextjs";
import useInteractionRequestNotifications from "./hooks/useInteractionRequestNotifications";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Anon App",
  description: "Interact with other people anonymously around you",
};

// Ensure there's only one default export in the file
export default function RootLayout({ children }) {
  useInteractionRequestNotifications;

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
