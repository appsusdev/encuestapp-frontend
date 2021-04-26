import { Box } from '@material-ui/core';
import React from 'react';
import AppAnimate from '../../components/ui/AppAnimate/AppAnimate';

export const HomeScreen = () => {
    return (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
            <Box>
                <Box mb={3} fontSize={20}>
                    <h1>Home super-admin</h1>
                </Box>
                <Box component='p' fontSize={16}>
                    You can start from here..
                </Box>
            </Box>
        </AppAnimate>
    )
}
