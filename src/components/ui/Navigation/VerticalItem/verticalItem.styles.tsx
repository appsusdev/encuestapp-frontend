import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
    return {
        navItem: {
            fontFamily: 'Poppins',
            height: 50,
            marginTop: 2,
            marginBottom: 2,
            cursor: 'pointer',
            textDecoration: 'none !important',
            width: 'calc(100% - 16px)',
            borderRadius: '0 30px 30px 0',
            '&.nav-item-header': {
                textTransform: 'uppercase',
            },
            '&.active': {
                backgroundColor: '#0A8FDC',
                pointerEvents: 'none',
                transition: 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
                '& .nav-item-text': {
                    color: theme.palette.common.white,
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    textTransform: 'capitalize'
                },
                '& .nav-item-icon': {
                    color: theme.palette.common.white,
                    fontFamily: 'Poppins'
                },
            },

            '&:hover, &:focus': {
                '& .nav-item-text': {
                    fontFamily: 'Poppins',
                    fontSize: 16,
                    color: theme.palette.common.white
                }
            },
            '& .nav-item-icon': {
                color: '#808183',
            },
            '& .nav-item-text': {
                color: '#808183',
                fontSize: 16,
                fontFamily: 'Poppins',
                textTransform: 'capitalize'
            },
        },
        listIcon: {
            fontSize: 18,
        },
        listItemText: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        icon: {
            color: theme.palette.common.white
        }
    };
});
export default useStyles;
