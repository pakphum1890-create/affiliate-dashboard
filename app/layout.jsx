import "./globals.css";

export const metadata = {
  title: "Affiliate Dashboard",
  description: "TikTok + Shopee affiliate creator dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
