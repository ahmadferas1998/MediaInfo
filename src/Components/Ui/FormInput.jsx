import React from 'react';
import TextField from '@mui/material/TextField';

const FormInput = ({ label, type, value, onChange, error, placeholder }) => {
  return (
    <div className="row m-1 mt-3">
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={Boolean(error)}
        helperText={error ? `${label} is required` : ''}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            color: 'white !important', // Text color with !important
            '& fieldset': {
              borderColor: 'white !important', // Border color with !important
            },
            '&:hover fieldset': {
              borderColor: 'white !important', // Hover border color with !important
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white !important', // Focused border color with !important
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white !important', // Label color with !important
            '&.Mui-focused': {
              color: 'white !important', // Focused label color with !important
            },
          },
          '& .MuiFormHelperText-root': {
            color: 'white !important', // Helper text color with !important
          },
        }}
      />
    </div>
  );
};

export default FormInput;
