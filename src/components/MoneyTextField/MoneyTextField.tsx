import { memo } from "react";
import React from "react";
import {
  MenuItem,
  styled,
  TextField,
  TextFieldProps,
  Typography,
  Grid,
} from "@mui/material";

type Props = TextFieldProps & { currency?: string };

export default memo(
  styled(function MoneyTextField(props: Props) {
    return (
      <TextField
        type={"number"}
        variant={"outlined"}
        InputProps={{
          startAdornment: props.currency ? (
            <Typography sx={{ mr: 1 }}>{props.currency}</Typography>
          ) : null,
          inputProps: {
            min: 0,
          },
        }}
        {...props}
      />
    );
  })({})
);
