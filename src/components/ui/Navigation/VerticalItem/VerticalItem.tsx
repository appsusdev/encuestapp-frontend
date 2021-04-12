import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import List from '@material-ui/core/List';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import PollOutlinedIcon from '@material-ui/icons/PollOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined';
import { Routes, RoutesName } from '../../../../helpers/getRoutes';
import useStyles from './verticalItem.styles';
import '../../../../shared/styles/app.scss'

interface VerticalItemProps {}

const VerticalItem: React.FC<VerticalItemProps> = () => {
    const classes = useStyles();

    const routes = Routes();
    const routesName = RoutesName();
    const items = [
        { route: routes[0], name: routesName[0], component: (<HomeOutlinedIcon />) },
        { route: routes[1], name: routesName[1], component: (<PeopleOutlineIcon />) },
        { route: routes[2], name: routesName[2], component: (<PollOutlinedIcon />) },
        { route: routes[3], name: routesName[3], component: (<SettingsOutlinedIcon />) },
        { route: routes[4], name: routesName[4], component: (<TrendingUpOutlinedIcon />) },
    ];

    return (
        <>
            <List >
                {
                    items.map((item) => (
                        <ListItem key={item.name} activeClassName='active' className={clsx(classes.navItem, 'nav-item')} component={NavLink} to={item.route}>
                            <ListItemIcon className={clsx(classes.listIcon, 'nav-item-icon')}>{item.component}</ListItemIcon>
                            <ListItemText classes={{ primary: 'nav-item-text' }} primary={item.name} />
                        </ListItem>
                    ))
                }
            </List>
        </>
    );
};

export default VerticalItem;
