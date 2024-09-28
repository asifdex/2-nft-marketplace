import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Layout from "../Provider/layout";
import { useRouter } from "next/router";
import { ThemeProvider } from "@/Provider/themeProvider";
import { Provider } from "react-redux";
import store  from "@/components/store/store";

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);
  const { pathname } = useRouter();
  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      {ready ? (
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Provider store={store}>
            <Layout pathname={pathname}>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </ThemeProvider>
      ) : null}
    </>
  );
}
