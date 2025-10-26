import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday Chris and Dina!",
  description: "A birthday surprise for Chris and Dina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans`}>
        {children}

        <div className="fixed bottom-2 -translate-x-1/2 left-1/2 text-center text-white font-light w-full">
          ©{new Date().getFullYear()} all rights reserved to Christiena and Dina
          Gamal Shehata
        </div>
      </body>
    </html>
  );
}
