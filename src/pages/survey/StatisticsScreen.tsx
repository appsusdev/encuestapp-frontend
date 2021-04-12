import { FormattedMessage } from 'react-intl';
import { Box } from '@material-ui/core';
import AppAnimate from '../../components/ui/AppAnimate/AppAnimate';

export const StatisticsScreen = () => {
    return (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
            <Box>
                <Box mb={3} fontSize={20}>
                    <h1><FormattedMessage id='Statistics' /></h1>
                </Box>
                <Box component='p' fontSize={16}>
                    You can start from here..
                </Box>
            </Box>
        </AppAnimate>
    )
}
