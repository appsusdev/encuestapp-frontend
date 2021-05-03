import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { FormattedMessage } from 'react-intl';

interface PropsAlert {
    open: boolean,
    message: string,
    typeAlert: "error" | "success" | "info" | "warning",
    time: number,
    handleClose: () => void,
}
export const MyAlert = (props: PropsAlert) => {

    const {open, message, typeAlert, time, handleClose} = props;

    return (
        <Snackbar  
                open={ open } 
                style={{ maxWidth: '40vw', marginLeft: '50%'}}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }} 
                autoHideDuration={time} 
                onClose={ handleClose }
            >
                <Alert onClose={ handleClose } severity={typeAlert}>
                    <FormattedMessage id={`${message}`}/>
                </Alert>
        </Snackbar>
    )
}
