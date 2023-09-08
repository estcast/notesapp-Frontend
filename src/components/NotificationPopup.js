import React from "react";
import { Stack, Snackbar} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function NotificationPopup({state, severity, text}) {

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar open={state} autoHideDuration={6000} >
        <Alert severity={severity} sx={{ width: "100%" }} >
          {text}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default NotificationPopup;
