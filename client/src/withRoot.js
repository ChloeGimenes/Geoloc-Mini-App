import React from "react";
import { MuiThemeProvider, createMuiTheme, withTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";

import CssBaseline from "@material-ui/core/CssBaseline";

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#fafafa"
      // light: purple[300],
      // main: purple[500],
      // dark: purple[700]
    },
    secondary: {
      main: "#767676"
      // light: green[300],
      // main: green[500],
      // dark: green[700]
    }
  },
  typography: {
    useNextVariants: true
  }
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        {/* https://material-ui.com/getting-started/usage/#cssbaseline */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
