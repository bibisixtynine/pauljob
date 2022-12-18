import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="Générateur IA de Lettre de Motivation" key="title"/>
        <meta property="og:description" content="construit avec passion" key="description"/>
        <meta
          property="og:image"
          content="https://upload.wikimedia.org/wikipedia/commons/f/f1/CoffeeMath.png"
        />
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
