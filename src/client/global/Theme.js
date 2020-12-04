import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

export const ThemeContext = React.createContext({});

export default function Theme(props) {
  const [darkMode, setDarkmode] = React.useState("dark");
  const [darkModeOn, setDarkmodeOn] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const theme = createMuiTheme({
    palette: {
      type: darkMode,
      primary: {
        light: "#B1DAFC",
        main: "#72B5E9",
      },
      secondary: {
        main: "#F9C80E",
      },
      warning: {
        main: "#E97720",
      },
      success: {
        main: "#53DD6C",
      },
      background: {
        default: darkMode === "dark" ? "#181818" : "#fafafa",
        paper: darkMode === "dark" ? "#202931" : "#fff",
      },
    },
    typography: {
      button: {
        textTransform: "none", //enable lower case in button
      },
    },
  });

  const switchDarkMode = () => {
    if (darkMode === "dark") {
      setDarkmode("light");
      setDarkmodeOn(false);
    } else {
      setDarkmode("dark");
      setDarkmodeOn(true);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const ret = {
    switchDarkMode: switchDarkMode,
    darkmodeOn: darkModeOn,
    handleDrawerToggle: handleDrawerToggle,
    mobileOpen: mobileOpen,
  };

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={ret}>
        {props.children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}
