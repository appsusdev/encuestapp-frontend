import { makeStyles } from '@material-ui/core/styles';
import authBackground from '../../assets/images/auth-background.jpg';
import { Fonts } from '../../shared/constants/AppEnums';

export const useStylesAuth = makeStyles(theme => ({
    appAuth: {
        flex: 1,
        display: 'flex',
        position: 'relative',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        background: `url(${authBackground}) no-repeat center center`,
        backgroundSize: 'cover',

        '& .scrollbar-container': {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        '& .main-content-view': {
            padding: 20,
        },
        '& .footer': {
            marginRight: 0,
            marginLeft: 0,
        },
    },
    imgRoot: {
        cursor: 'pointer',
        display: 'inline-block',
        width: 140,
    },
    cardRoot: {
        margin: -40,
        maxWidth: '36rem',
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        position: 'relative',
        paddingTop: 20,
        marginBottom: 0,
        [theme.breakpoints.up('xl')]: {
            paddingTop: 32,
        },
        '&:before': {
            content: "''",
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            width: 130,
            height: 9,
            borderBottomRightRadius: 80,
            borderBottomLeftRadius: 80,

            marginRight: 'auto',
            marginLeft: 'auto',
            backgroundColor: '#0A8FDC',
        },
    },
    textUppercase: {
        textTransform: 'uppercase',
    },
    card: {
        margin: -60,
        maxWidth: 576,
        width: '100%',
        textAlign: 'center',
        padding: 24,
        paddingBottom: 20,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        [theme.breakpoints.up('sm')]: {
            padding: 40,
            paddingBottom: 20,
        },
        [theme.breakpoints.up('md')]: {
            padding: 48,
            paddingBottom: 20,
        },
        [theme.breakpoints.up('xl')]: {
            paddingLeft: 48,
            paddingRight: 48,
        },
        '&:before': {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            width: 130,
            height: 9,
            borderBottomRightRadius: 80,
            borderBottomLeftRadius: 80,
            marginRight: 'auto',
            marginLeft: 'auto',
            backgroundColor: '#0A8FDC',
        },
    },
    form: {
        textAlign: 'left',
        [theme.breakpoints.up('xl')]: {
            marginBottom: 0,
        },
        marginBottom: 0,
        marginLeft: 14,
        marginRight: 14,
        marginTop: -30,
    },
    textField: {
        width: '100%',
        marginBottom: 15,
    },
    btnRoot: {
        width: '100%',
        fontWeight: Fonts.REGULAR,
        textTransform: 'capitalize',
        fontSize: 16,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: '4px',
        background: '#F04F47',
        '&:hover': {
            background: '#D94040'
        }
    },
    textSecondary: {
        color: '#0A8FDC',
        marginLeft: 10,
    },
    underlineNone: {
        textDecoration: 'none',
    },
    textGrey: {
        color: '#495057',
    },
    textSize: {
        fontSize: '14px',
        color: '#495057'
    }
}));

export default useStylesAuth;