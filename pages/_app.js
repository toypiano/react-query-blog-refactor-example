import React from 'react'
import App from 'next/app'
import { createGlobalStyle } from 'styled-components'
import normalize from 'styled-normalize'

const GlobalStyles = createGlobalStyle`
  ${normalize}; // pulled from original normalize.css and parsed into styled ready format
  // data-reactroot attribute used to be added to the root element before react 16
  html, body, body, [data-reactroot] {
    min-height: 100%;
    width: 100%;
  }

  html, body {
    font-size: 16px;
    font-family: "Helvetica", "Georgia", sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`

// MyApp is the custom 'App' that overrides the default 'App'
// Custom App allows you to:
// 1. persist layout between page changes
// 2. keep state when navigating pages
// 3. handle error using 'componentDidCatch'
// 4. inject additional data into pages
// 5. add global css
export default class MyApp extends App {
  render() {
    // Component prop - the active 'page'
    // pageProps - an object with the initial props that were preloaded for the page
    // by one of Next.js data fetching methods. (otherwise it's an empty object)
    const { Component, pageProps } = this.props

    return (
      <>
        {/* Inject global css created with styled-components */}
        <GlobalStyles />
        <Component {...pageProps} />
      </>
    )
  }
}
