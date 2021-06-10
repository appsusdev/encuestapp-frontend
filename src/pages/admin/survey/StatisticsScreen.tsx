import { Box } from '@material-ui/core';
import AppAnimate from '../../../components/ui/AppAnimate/AppAnimate';
import { StatisticsTabs } from '../../../components/admin/statistics/StatisticsTabs';

export const StatisticsScreen = () => {
    return (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
            <Box>
                <StatisticsTabs />
            </Box>
        </AppAnimate>
    )
}
