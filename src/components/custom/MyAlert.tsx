import { Snackbar, makeStyles } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { FormattedMessage } from 'react-intl';
import { Theme } from '@material-ui/core/styles';

interface PropsAlert {
    open: boolean,
    message: string,
    typeAlert: "error" | "success" | "info" | "warning",
    time: number,
    handleClose: () => void,
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
}));
export const MyAlert = (props: PropsAlert) => {

    const {open, message, typeAlert, time, handleClose} = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
        <Snackbar  
                open={ open } 
                style={{ width: 'auto', maxWidth: '30vw', marginLeft: '40px'}}
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
        </div>
    )
}
