import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

// Custom 'Document' is used to modify your 'index.html'
// and is only rendered in the server (browser APIs like onClick won't work.)
// Document's getInitialProps() is not called during client-side transitions nor when the page is statically optimized
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    // Customizing `renderPage`
    // We're wrapping App inside styled-components Provider to properly work with SSR
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          // wrapping the whole react tree (App)
          enhanceApp: (App) => (props) =>
            // collectStyles() wraps passed component in a provider
            sheet.collectStyles(<App {...props} />),
        })

      // Run the parent `getInitialProps` passing in the modified ctx.
      // It now includes the custom `renderPage`
      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        // provide style tag
        styles: (
          <>
            {initialProps.styles}
            {/* returns an array of React elements */}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal() // make sheet object available for garbage-collection
    }
  }
}
