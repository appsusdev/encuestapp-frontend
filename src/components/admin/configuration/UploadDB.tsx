import { Divider, Paper, Box, makeStyles, Grid, TextField, Link } from '@material-ui/core';
import clsx from 'clsx';
import { Fonts } from '../../../shared/constants/AppEnums';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        fontFamily: 'Poppins',
    },
    title: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: Fonts.MEDIUM,
        color: theme.palette.grey[800]
    },
    inputSelect: {
        width: '100%',
        marginTop: 8,
    },
    typography: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
    btn: {
        width: '100%',
        fontWeight: Fonts.REGULAR,
        textTransform: 'capitalize',
        color: 'white',
        fontSize: 14,
        marginTop: '28px',
        borderRadius: '4px'
    },
    buttons: {
        fontWeight: Fonts.REGULAR,
        textTransform: 'capitalize',
        color: 'white',
        fontSize: 14,
        // paddingTop: 12,
        // paddingBottom: 12,
        borderRadius: '4px',
        width: '10vw',
        marginLeft: '5px'
    },
    cancel: {
        background: '#F04F47',
        '&:hover': {
            background: '#D94040'
        },
    },
    save: {
        background: '#0A8FDC',
        '&:hover': {
            background: '#0A6DDC'
        }
    },
}));

export const UploadDB = () => {
    const classes = useStyles();

    const handleUpload = () => {
        // console.log('Upload')
    }

    return (
        <Paper >
            
            <Box >       
                <Box className={clsx(classes.root, classes.title)}> 
                    <FormattedMessage id="UploadCitizenDB"/>
                </Box>
                <Divider variant="middle" />
                <Box className={classes.root}>
                    <Box display="flex" justifyContent="flex-end">
                        <Link component="button">
                            <FormattedMessage id="UploadExcel"/>    
                        </Link>    
                    </Box>
                    
                    <Grid container spacing={4}>
                        <Grid item xs={9} className={classes.typography}>
                            <label className="form-text"><FormattedMessage id='UploadExcel' /></label>
                            <TextField
                                className={classes.inputSelect}
                                // onChange={handleChange}
                                // value={survey}
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <TextField
                                id="contained-button-file"
                                type="file"
                                style={{display: 'none'}}
                            
                            />
                            <label htmlFor="contained-button-file">
                                <Button className={clsx(classes.btn, classes.save)}  size="medium" component="span" onClick={handleUpload}>
                                <FormattedMessage id='Attach' />
                                </Button>
                            </label>
                        </Grid>

                    </Grid>

                    <Box mt={2} display="flex" flexDirection="row-reverse">
                        <Button className={clsx(classes.buttons, classes.save)} >
                            <FormattedMessage id="Save" />
                        </Button>
                        <Button className={clsx(classes.buttons, classes.cancel)} >
                            <FormattedMessage id="Cancel" />
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    )
}
