import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moovs Data Prep",
  description: "Prepare your data for import into Moovs via OneSchema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
