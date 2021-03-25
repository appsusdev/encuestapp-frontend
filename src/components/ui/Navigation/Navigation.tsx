import React from 'react';
import List from '@material-ui/core/List';

import VerticalItem from './VerticalItem/VerticalItem';

interface NavigationProps { }

const Navigation: React.FC<NavigationProps> = () => {
    return (
        <List>
            <VerticalItem />
        </List>
    );
};

export default Navigation;