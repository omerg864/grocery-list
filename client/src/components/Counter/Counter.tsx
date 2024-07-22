import { Container, ButtonGroup, Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { IoMdAdd } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(grey[50]),
  backgroundColor: grey[50],
  borderColor: grey[200],
  "&:hover": {
    backgroundColor: grey[100],
    borderColor: grey[300]
  }
}));

const StyledInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& input": {
      textAlign: "center",
      width: 40,
    },
    },   "& .MuiInputBase-root.Mui-disabled": {
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
            borderRadius: 0
        }
    }
});

interface CounterProps {
    count: number;
    addCounter?: () => void;
    removeCounter?: () => void;
    handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export default function App(props: CounterProps) {

  return (
    <Container sx={{flex: 0, padding: 0}}>
      <ButtonGroup>
        <StyledButton
          onClick={props.removeCounter}
          disabled={props.disabled ? props.disabled : props.count === 1}
        >
          <IoMdRemove fontSize="small" />
        </StyledButton>
        <StyledInput disabled={props.disabled } sx={{ "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "white", "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8cffcb"
            }} }} size="small" onChange={props.handleChange} value={props.count} />
        <StyledButton disabled={props.disabled} onClick={props.addCounter}>
          <IoMdAdd fontSize="small" />
        </StyledButton>
      </ButtonGroup>
    </Container>
  );
}
