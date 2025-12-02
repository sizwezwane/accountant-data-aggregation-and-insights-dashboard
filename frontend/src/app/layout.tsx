import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import ThemeRegistry from "@/providers/ThemeRegistry";

export const metadata: Metadata = {
  title: "Adsum Accountant Dashboard",
  description: "Data Aggregation and Insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
