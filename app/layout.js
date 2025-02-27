// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { Poppins } from "next/font/google";

import "@mantine/core/styles.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  createTheme,
} from "@mantine/core";
import Providers from "./Provider";

export const theme = createTheme({
  fontFamily: "Poppins, sans-serif",
  headings: { fontFamily: "Poppins, sans-serif" },
  primaryColor: "blue",
});
export const metadata = {
  title: "CSMPL Search Widget",
  description: "Zoho CRM Widget",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={poppins.className}>
        <MantineProvider theme={theme}>
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
