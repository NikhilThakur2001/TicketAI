import type { Metadata } from "next";
import { AuthProvider } from "../components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TicketAI",
  description: "JIRA-like Kanban Board System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
