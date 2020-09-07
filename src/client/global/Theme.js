import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue, grey } from "@material-ui/core/colors";
import { DataContext } from "./Data";

export const ThemeContext = React.createContext({});

export default function Theme(props) {
  const [darkMode, setDarkmode] = React.useState("dark");
  const [darkModeOn, setDarkmodeOn] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const dataContext = React.useContext(DataContext);

  const theme = createMuiTheme({
    palette: {
      type: darkMode,
      primary: {
        main: blue[600],
      },
      secondary: {
        main: grey[300],
      },
    },
    typography: {
      button: {
        textTransform: 'none' //enable lower case in button
      }
    }
  });

  const switchDarkMode = () => {
    if (darkMode === "dark") {
      setDarkmode("light");
      setDarkmodeOn(false);
    } else {
      setDarkmode("dark");
      setDarkmodeOn(true);
    }
    dataContext.incCounter();
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
