import Providers from "./providers";
import './globals.css';


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
