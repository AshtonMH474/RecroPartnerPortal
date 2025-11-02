import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png"/>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* safari */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>


        {/* chrome and firefox */}
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png"/>
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png"></link>
        


        
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
