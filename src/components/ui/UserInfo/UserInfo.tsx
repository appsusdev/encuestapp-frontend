import React, { useContext } from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { orange } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppContext from '../../../context/AppContext';
import AppContextPropsType from '../../../types/AppContextPropsType';
import { Fonts, ThemeMode } from '../../../shared/constants/AppEnums';
import user from '../../../assets/images/user.jpg'
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { startLogout } from '../../../redux/actions/authActions';

const useStyles = makeStyles(theme => {
    return {
        crUserInfo: {
            backgroundColor: 'rgba(0,0,0,.08)',
            paddingTop: 9,
            paddingBottom: 9,
            minHeight: 56,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [theme.breakpoints.up('sm')]: {
                paddingTop: 10,
                paddingBottom: 10,
                minHeight: 70,
            },
        },
        profilePic: {
            fontSize: 24,
            backgroundColor: orange[500],
        },
        userInfo: {
            width: 'calc(100% - 75px)',
        },
        userName: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 16,
            fontWeight: Fonts.MEDIUM,
            color: (props: { themeMode: ThemeMode }) =>
                props.themeMode === ThemeMode.LIGHT ? '#313541' : 'white',
        },
        designation: {
            marginTop: -2,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#74788d',
        },
        pointer: {
            cursor: 'pointer',
        },
    };
});

const UserInfo: React.FC<{}> = () => {
    const { themeMode } = useContext<AppContextPropsType>(AppContext);
    const classes = useStyles({ themeMode });
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch( startLogout() );
    }


    return (
        <Box
            px={{ xs: 4, xl: 7 }}
            className={clsx(classes.crUserInfo, 'cr-user-info')}>
            <Box display='flex' alignItems='center'>
                <Avatar className={classes.profilePic} src={user} />
                <Box ml={4} className={clsx(classes.userInfo, 'user-info')}>
                    <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'>
                        <Box mb={0} className={clsx(classes.userName)}>
                            Administrador
                        </Box>
                        <Box
                            ml={3}
                            className={classes.pointer}
                            color={themeMode === 'light' ? '#313541' : 'white'}>
                            <ExpandMoreIcon onClick={handleClick} />
                            <Menu
                                id='simple-menu'
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}>
                                <MenuItem>
                                    <FormattedMessage id='MyAccount'/>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <FormattedMessage id='Logout'/>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                    <Box className={classes.designation}>Appsus</Box>
                </Box>
            </Box>
        </Box>
    );
};

export default UserInfo;
