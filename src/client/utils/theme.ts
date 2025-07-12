import { createTheme } from "@mui/material/styles";

const catppuccinMocha = {
  rosewater: "#f5e0dc",
  pink: "#f5c2e7",
  red: "#f38ba8",
  peach: "#fab387",
  yellow: "#f9e2af",
  green: "#a6e3a1",
  sky: "#89dceb",
  lavender: "#b4befe",
  text: "#cdd6f4",
  subtext0: "#a6adc8",
  overlay0: "#6c7086",
  surface2: "#585b70",
  base: "#1e1e2e",
  mantle: "#181825",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: catppuccinMocha.pink },
    secondary: { main: catppuccinMocha.lavender },
    error: { main: catppuccinMocha.red },
    warning: { main: catppuccinMocha.peach },
    info: { main: catppuccinMocha.sky },
    success: { main: catppuccinMocha.green },
    background: {
      default: catppuccinMocha.base,
      paper: catppuccinMocha.mantle,
    },
    text: {
      primary: catppuccinMocha.text,
      secondary: catppuccinMocha.subtext0,
      disabled: catppuccinMocha.overlay0,
    },
    divider: catppuccinMocha.surface2,
  },
  typography: {
    fontFamily: '"Fira Code", "Fira Mono", monospace',
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
  },
});

export default theme;
