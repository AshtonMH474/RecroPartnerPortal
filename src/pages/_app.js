import Head from "next/head";
import "@/styles/globals.css";
import "@/styles/gears.css";
import BG from "@/components/BG";
import { AuthProvider } from "@/context/auth";
import { DownloadsProvider } from "@/context/downloads";
import { MaterialsProvider } from "@/context/materials";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <BG/>
      <AuthProvider>
        <DownloadsProvider>
          <MaterialsProvider>
            <Component {...pageProps} />
          </MaterialsProvider>
        </DownloadsProvider>
      </AuthProvider>
    </>
  );
}
