import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './components.css';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export function ButtonUsage() {
  return (
    <>
        <br />
        <Button
            variant="contained"
            disableRipple
            disableElevation
            sx={{
                outline: "none",
                "&:focus": { outline: "none" }
            }}
            >
            Click me
        </Button>
        <br />
    </>
  );
}

export function Form(){
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className="TextArea">
            <div className="nameRow">
                <TextField
                    size="small"
                    variant="outlined"
                    label="First Name"
                    defaultValue="John"
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                    size="small"
                    variant="outlined"
                    label="Last Name"
                    defaultValue="Doe"
                    slotProps={{ inputLabel: { shrink: true } }}
                />
            </div>

            <TextField size="small" variant="outlined" label="Email" type="email" slotProps={{ inputLabel: { shrink: true } }}/>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    size='small'
                />
            </FormControl>
        </div>
    );
}
