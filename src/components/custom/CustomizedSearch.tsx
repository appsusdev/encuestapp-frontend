import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { useIntl } from 'react-intl';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        minWidth: 100,
        width: 400,
        height: '42px',
        position: 'absolute',
        left: '100%',
        transform: 'translate(-100%, 0)',
        [theme.breakpoints.down('sm')]: {
            width: '60%',
        },
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
}));

export const CustomizedSearch = () => {
    const classes = useStyles();
    const intl = useIntl();

    return (
        <Paper className={classes.root}>
            <InputBase
                className={classes.input}
                placeholder={`${intl.formatMessage({ id: 'Search'})} ...`}
                inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton className={classes.iconButton} aria-label='search'>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}