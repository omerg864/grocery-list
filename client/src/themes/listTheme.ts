import { Theme, createTheme } from "@mui/material";


const listTheme = (outerTheme: Theme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiListItemButton: {
          styleOverrides: {
            root: {
                background: 'rgba(255, 255, 255, 0.31)',
                'borderRadius': '8px',
                'boxShadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'backdropFilter': 'blur(5.8px)',
                'WebkitBackdropFilter': 'blur(5.8px)',
                'border': '1px solid rgba(255, 255, 255, 0.5)',
            },
          },
        },
        MuiListItem: {
          styleOverrides: {
            root: {
              marginBottom: '10px',
            },
          },
        },
        MuiListItemIcon: {
          styleOverrides: {
            root: {
              color: 'white',
            },
          },
        },
        MuiListItemText: {
          styleOverrides: {
            primary: {
              color: 'white',
            },
          },
        }
      },
});

export default listTheme;