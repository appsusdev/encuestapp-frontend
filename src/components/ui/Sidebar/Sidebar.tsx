import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';

import { toggleNavCollapsed } from '../../../redux/actions/settingActions';
import { AppState } from '../../../redux/reducers/rootReducer';
import AppContext from '../../../context/AppContext';
import AppContextPropsType from '../../../types/AppContextPropsType';
import UserInfo from '../../../components/ui/UserInfo/UserInfo';
import Navigation from '../Navigation/Navigation';
import useStyles from './sidebar.styles';

interface AppSidebarProps {
    position?: 'left' | 'bottom' | 'right' | 'top';
    variant?: string;
}

const Sidebar: React.FC<AppSidebarProps> = ({
    position = 'left',
    variant = '',
}) => {
    const dispatch = useDispatch();
    const { navCollapsed } = useSelector<AppState, AppState['setting']>(
        ({ setting }) => setting,
    );
    const { themeMode } = useContext<AppContextPropsType>(AppContext);

    const handleToggleDrawer = () => {
        dispatch(toggleNavCollapsed());
    };
    const classes = useStyles({ themeMode });
    let sidebarClasses = classes.sidebarStandard;
    return (
        <>
            <Hidden lgUp>
                <Drawer
                    anchor={position}
                    open={navCollapsed}
                    onClose={() => handleToggleDrawer()}
                    classes={{
                        root: clsx(variant),
                        paper: clsx(variant),
                    }}
                    style={{ position: 'absolute' }}>
                    <Box height='100%' className={classes.container}>
                        <Box className={clsx(classes.sidebarBg, sidebarClasses)}>
                            <UserInfo />
                            <Navigation />
                        </Box>
                    </Box>
                </Drawer>
            </Hidden>
            <Hidden mdDown>
                <Box height='100%' className={clsx(classes.container, 'app-sidebar')}>
                    <Box className={clsx(classes.sidebarBg, sidebarClasses)}>
                        <UserInfo />
                        <Navigation />
                    </Box>
                </Box>
            </Hidden>
        </>
    );
};

export default Sidebar;