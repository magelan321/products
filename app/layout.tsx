import Link from "next/link";
import Providers from "./providers";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Providers>
          <main style={{ padding: 16 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
