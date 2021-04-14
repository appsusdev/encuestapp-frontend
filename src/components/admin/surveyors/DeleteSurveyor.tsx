import { FormattedMessage } from 'react-intl';
import { Box, TextareaAutosize, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Fonts } from '../../../shared/constants/AppEnums';

const styles = makeStyles((theme: Theme) => ({
    title: {
        fontFamily: 'Poppins',
        fontSize: 16,
        fontWeight: Fonts.MEDIUM,
        color: theme.palette.grey[800],
        textAlign: 'center',
        marginBottom: '15px'
    },
    textarea: {
        width: '100%'
    },
    typography: {
        fontFamily: 'Poppins !important'
    },
}));

export const DeleteSurveyor = () => {
    const classes = styles();

    return (
        <Box m={1} className={classes.typography}>
            <Typography className={classes.title}>
                <FormattedMessage id="MessageOne"/>
            </Typography>

            <Typography variant="body2" className={classes.typography}>
                <FormattedMessage id="MessageTwo"/>
            </Typography>
            
            <Box mt={1}>
                <TextareaAutosize className={classes.textarea} aria-label="minimum height" rowsMin={6} placeholder="" disabled />
            </Box>

            <Typography variant="body2" className={classes.typography}>
                <FormattedMessage id="MessageThree"/>
            </Typography>
        </Box >
    )
}
