import React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import { toggleNavCollapsed } from '../../../redux/actions/settingActions';
import Logo from '../Logo/Logo';
import useStyles from './header.styles';

interface AppHeaderProps { }

const AppHeader: React.FC<AppHeaderProps> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <>
            <AppBar color='inherit' className={clsx(classes.appBar, 'app-bar')}>
                <Toolbar className={classes.appToolbar}>
                    <Hidden lgUp>
                        <IconButton
                            edge='start'
                            className={classes.menuButton}
                            color='inherit'
                            aria-label='open drawer'
                            onClick={() => dispatch(toggleNavCollapsed())}>
                            <MenuIcon className={classes.menuIcon} />
                        </IconButton>
                    </Hidden>
                    <Logo />
                    <Box className={classes.grow} />
                </Toolbar>
            </AppBar>
        </>
    );
};
export default AppHeader;
