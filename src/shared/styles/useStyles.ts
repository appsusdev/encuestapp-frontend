import { makeStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { Fonts } from '../constants/AppEnums';

export const useStyles = makeStyles((theme: Theme) => ({
    input: {
        fontSize: 14,
        '& input::placeholder': {
            fontSize: 16,
            color: theme.palette.background.default,
            fontWeight: Fonts.MEDIUM,
        },
    },
    inputSelect: {
        width: '100%',
        marginTop: 8,
    },
    myTextFieldRoot: {
        width: '100%',
        marginTop: 8,
        '& label': {
            color: `${theme.palette.grey[800]} !important`,
            fontFamily: 'Poppins',
            fontSize: 15,
        }
    },
    btn: {
        fontWeight: Fonts.REGULAR,
        textTransform: 'capitalize',
        color: theme.palette.common.white,
        fontSize: 14,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: '4px',
        width: '10vw',
        marginLeft: '5px'
    },
    btnAction: {
        width: '100%',
        fontWeight: Fonts.REGULAR,
        textTransform: 'capitalize',
        color: theme.palette.common.white,
        fontSize: 14,
        marginTop: '28px',
        borderRadius: '4px'
    },
    cancel: {
        background: theme.palette.error.main,
        '&:hover': {
            background: theme.palette.error.dark
        },
    },
    save: {
        background: theme.palette.info.main,
        '&:hover': {
            background: theme.palette.info.dark
        }
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    typography: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
    table: {
        minWidth: 500,
    },
    media: {
        width: '100%',
        height: '100%',
    },
    card: {
        height: '247px !important',
        marginTop: '12px',
        maxWidth: 345,
    },
    paper: {
        minHeight: '400px'
    },
    root: {
        margin: 0,
        padding: theme.spacing(2),
        fontFamily: 'Poppins',
    },
    title: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: Fonts.MEDIUM,
        color: theme.palette.grey[800]
    },
    swal: {
        height: '50hv'
    },
    colorLoading: {
        color: theme.palette.info.main,
    },
    rootLoading: {
        flexGrow: 1
    },
    paperLoading: {
        height: '100%',
        width: '100%'
    },

}));