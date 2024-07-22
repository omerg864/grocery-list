import { Theme, createTheme } from "@mui/material";


const formTheme = (outerTheme: Theme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': 'white',
              '--TextField-color': 'white',
              '&.Mui-disabled': {
                '--TextField-brandBorderColor': 'white',
                '--TextField-color': 'white',
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: 'var(--TextField-brandBorderColor)',
            },
            input: {
              color: 'var(--TextField-color)',
            },
            root: {
              '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
              '&.Mui-disabled .MuiOutlinedInput-input': {
                color: 'white',
                WebkitTextFillColor: 'white',
              },
            },
          },
        },
        MuiAutocomplete: {
          styleOverrides: {
            root: {
              notchedOutline: {
                borderColor: 'var(--TextField-brandBorderColor)',
              },
              input: {
                color: 'var(--TextField-color)',
              },
              '--TextField-brandBorderColor': 'var(--TextField-color)',
              '--TextField-color': 'var(--TextField-color)',
              '&.Mui-disabled .MuiAutocomplete-inputRoot': {
                '--TextField-brandBorderColor': 'white',
                '--TextField-color': 'white',
              },
              '&.Mui-disabled .MuiAutocomplete-input': {
                color: 'var(--TextField-color)',
                WebkitTextFillColor: 'var(--TextField-color)', // Fix for certain browsers
              },
              '&.Mui-disabled .MuiAutocomplete-clearIndicator': {
                color: 'white',
              },
              '&.Mui-disabled .MuiIconButton-root': {
                color: 'var(--TextField-color)',
              },
            },
            popupIndicator: {
              '&.Mui-disabled': {
                color: "white"
              }
            }
          },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: 'white',
          },
          select: {
            color: 'white',
          },
          root: {
            '--TextField-brandBorderColor': 'white',
            '&.Mui-disabled': {
              color: 'white',
            },
          },
          iconOutlined: {
            '&.Mui-disabled': {
              color: 'white',
            },
          }
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              color: 'white',
            },
            color: 'white',
          },
        },
      },
      }
});

export default formTheme;