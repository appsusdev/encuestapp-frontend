import { Box } from '@material-ui/core';
import AppAnimate from '../../components/ui/AppAnimate/AppAnimate';
import { HomeTabs } from '../../components/admin/home/HomeTabs';

export const HomeScreen = () => {


    return (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
            <Box>
                <HomeTabs />
            </Box>
        </AppAnimate>
    )
}