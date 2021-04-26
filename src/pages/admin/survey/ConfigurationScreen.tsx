import { Box } from '@material-ui/core';
import AppAnimate from '../../../components/ui/AppAnimate/AppAnimate';
import { UploadDB } from '../../../components/admin/configuration/UploadDB';

export const ConfigurationScreen = () => {
    return (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
            <Box>
                <Box mb={3} fontSize={16}>
                    <UploadDB />
                </Box>
    
            </Box>
        </AppAnimate>
    )
}
