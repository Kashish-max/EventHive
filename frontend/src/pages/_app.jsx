import '@/styles/globals.scss'

import { ThemeProvider } from "@material-tailwind/react";
import { wrapper } from "@/store/store";

function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default wrapper.withRedux(App);