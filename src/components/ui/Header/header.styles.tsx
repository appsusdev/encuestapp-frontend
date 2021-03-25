import { makeStyles } from '@material-ui/core/styles';
import { CremaTheme } from '../../../types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => ({
    appToolbar: {
        paddingLeft: 20,
        paddingRight: 20,
        minHeight: 56,
        [theme.breakpoints.up('sm')]: {
            minHeight: 70,
        },
        [theme.breakpoints.up('md')]: {
            paddingLeft: 30,
            paddingRight: 30,
        }
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    menuIcon: {
        width: 35,
        height: 35,
    },
    appBar: {
        width: '100%',
        boxShadow: '4px 3px 4px 0px rgba(0,0,0,0.12)',
        [theme.breakpoints.up('lg')]: {
            left: '305px',
            width: 'calc(100vw - 19rem)',
        },
        [theme.breakpoints.up('xl')]: {
            width: 'calc(100vw - 21.6rem)',
        },
    },
    icon: {
        display: 'flex',
        float: 'right'
    }
}));

export default useStyles;
