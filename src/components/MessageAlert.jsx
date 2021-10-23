import { Alert, Snackbar } from "@mui/material";
import React from "react";

export const MessageAlert = (props) => {
    const { successMessage, handleCloseSuccessAlert, errorMessage, handleCloseErrorAlert } = props;

    return (<>
        <Snackbar open={successMessage !== undefined} autoHideDuration={6000} onClose={handleCloseSuccessAlert}>
            <Alert onClose={handleCloseSuccessAlert} severity="success" sx={{ width: '100%' }}>
                {successMessage}
            </Alert>
        </Snackbar>
        <Snackbar open={errorMessage !== undefined} autoHideDuration={8000} onClose={handleCloseErrorAlert}>
            <Alert onClose={handleCloseErrorAlert} severity="error" sx={{ width: '100%' }}>
                {errorMessage}
            </Alert>
        </Snackbar>
    </>);
}