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
                '--TextField-brandBorderColor': 'var(--color-secondary)',
                '--TextField-color': 'var(--color-secondary)',
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
                borderColor: 'var(--color-secondary)',
              },
              '&.Mui-disabled .MuiOutlinedInput-input': {
                color: 'var(--color-secondary)',
                WebkitTextFillColor: 'var(--color-secondary)',
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
                '--TextField-brandBorderColor': 'var(--color-secondary)',
                '--TextField-color': 'var(--color-secondary)',
              },
              '&.Mui-disabled .MuiAutocomplete-input': {
                color: 'var(--color-secondary)',
                WebkitTextFillColor: 'var(--color-secondary)',
              },
              '&.Mui-disabled .MuiAutocomplete-clearIndicator': {
                color: 'var(--color-secondary)',
              },
              '&.Mui-disabled .MuiIconButton-root': {
                color: 'var(--color-secondary)',
              },
            },
            popupIndicator: {
              '&.Mui-disabled': {
                color: "var(--color-secondary)"
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
              color: 'var(--color-secondary)',
            },
          },
          iconOutlined: {
            '&.Mui-disabled': {
              color: 'var(--color-secondary)',
            },
          }
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              color: 'var(--color-secondary)',
            },
            color: 'white',
          },
        },
      },
      }
});

export default formTheme;