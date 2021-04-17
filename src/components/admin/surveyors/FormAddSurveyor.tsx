import { useDispatch } from 'react-redux';
import { Form, Formik } from 'formik';
import { useIntl, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import clsx from 'clsx';

import { Box, Button, Grid, makeStyles, MenuItem, IconButton, Tooltip } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { PhotoCamera } from '@material-ui/icons';
import { Fonts } from '../../../shared/constants/AppEnums';
import { uiCloseModalAdd } from '../../../actions/ui';
import { MyTextField } from '../../custom/MyTextField';

const useStyles = makeStyles((theme: Theme) => ({
    input: {
        fontSize: 14,
        '& input::placeholder': {
            fontSize: 16,
            color: '#000',
            fontWeight: Fonts.MEDIUM,
        },
    },
    myTextFieldRoot: {
        width: '100%',
        marginTop: 8,
    },
    btn: {
        fontWeight: Fonts.REGULAR,
        textTransform: 'capitalize',
        color: 'white',
        fontSize: 14,
        paddingTop: 12,
        paddingBottom: 12,
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
    }
}));

interface MyFormValues {
    typeDoc: string;
    document: number | '';
    firstName: string;
    secondName: string;
    firstLastName: string;
    secondLastName: string;
    username: string;
    email: string;
    mobilePhone: number | '';
    address: string;
    profileImage: string;
}

export const FormAddSurveyor = () => {

    const intl = useIntl();
    const classes = useStyles();
    const dispatch = useDispatch();

    const validationSchema = yup.object({
        typeDoc: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        document: yup.number().typeError(`${intl.formatMessage({ id: 'NumericValue' })}`).required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        firstName: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        secondName: yup.string(),
        firstLastName: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        secondLastName: yup.string(),
        username: yup.string(),
        email: yup.string().email(`${intl.formatMessage({ id: 'InvalidEmail' })}`).required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        mobilePhone: yup.number().typeError(`${intl.formatMessage({ id: 'NumericValue' })}`).required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        address: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        profileImage: yup.mixed()
    });

    const initialValues: MyFormValues = {
        typeDoc: '',
        document: '',
        firstName: '',
        secondName: '',
        firstLastName: '',
        secondLastName: '',
        username: '',
        email: '',
        mobilePhone: '',
        address: '',
        profileImage: ''
    }

    const onClose = () => {
        dispatch(uiCloseModalAdd());
    }

    return (
        <Box m={1}>
            <Formik
                validateOnChange={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting }) => {
                    console.log(data);
                    setSubmitting(true);
                    // dispatch( guardar en BD);
                    setSubmitting(false);
                }}>
                {({ values, isSubmitting }) => (

                    <Form className={classes.input}>

                        <Grid container spacing={2}>

                            <Grid item xs={4}>
                                <label className="form-text"><FormattedMessage id='DocumentType' /></label>
                                <MyTextField
                                    name="typeDoc"
                                    variant='outlined'
                                    select
                                    className={classes.myTextFieldRoot}
                                >
                                    <MenuItem value={1}><FormattedMessage id='CitizenshipCard' /></MenuItem>
                                    <MenuItem value={2}><FormattedMessage id='ForeignersIdentityCard' /></MenuItem>
                                    <MenuItem value={3}><FormattedMessage id='Passport' /></MenuItem>
                                </MyTextField>
                            </Grid>

                            <Grid item xs={8}>
                                <label className="form-text"><FormattedMessage id='DocumentNumber' /></label>
                                <MyTextField
                                    name="document"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label className="form-text"><FormattedMessage id='FirstName' /></label>
                                <MyTextField
                                    name="firstName"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label className="form-text"><FormattedMessage id='SecondName' /></label>
                                <MyTextField
                                    name="secondName"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>


                            <Grid item xs={6}>
                                <label className="form-text"><FormattedMessage id='FirstLastName' /></label>
                                <MyTextField
                                    name="firstLastName"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label className="form-text"><FormattedMessage id='SecondLastName' /></label>
                                <MyTextField
                                    name="secondLastName"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                            <Grid item xs={6} >
                                <label className="form-text"><FormattedMessage id='SurveyorName' /></label>
                                <MyTextField
                                    name="username"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                    placeholder={`${values.firstName} ${values.secondName} ${values.firstLastName} ${values.secondLastName}`}
                                    disabled={true}
                                    style={{ color: 'black' }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label className="form-text"><FormattedMessage id='Email' /></label>
                                <MyTextField
                                    name="email"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label className="form-text"><FormattedMessage id='Mobile' /></label>
                                <MyTextField
                                    name="mobilePhone"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label className="form-text"><FormattedMessage id='Address' /></label>
                                <MyTextField
                                    name="address"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label className="form-text"><FormattedMessage id='ProfileImage' /></label>
                                <MyTextField
                                    accept="image/*"
                                    type="file"
                                    name="profileImage"
                                    id="icon-button-file"
                                    style={{ display: 'none' }}
                                />
                                <MyTextField disabled={true} variant="outlined" style={{ color: 'black' }} placeholder={values.profileImage} name='hola' className={classes.myTextFieldRoot} />
                            </Grid>


                            <Grid item xs={6}>
                                <Box mt={3} ml={-2}>
                                    <Tooltip title={`${intl.formatMessage({ id: 'SearchImage' })}`}>
                                    <label htmlFor="icon-button-file">
                                        <IconButton component="span"><PhotoCamera /></IconButton>
                                    </label>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>
                        {/* <Divider/> */}

                        <Box mt={2} display="flex" flexDirection="row-reverse">
                            <Button className={clsx(classes.btn, classes.save)} autoFocus
                                type='submit'
                                disabled={isSubmitting} >
                                <FormattedMessage id="Save" />
                            </Button>
                            <Button className={clsx(classes.btn, classes.cancel)} onClick={onClose}>
                                <FormattedMessage id="Cancel" />
                            </Button>
                        </Box>

                    </Form>
                )}
            </Formik>
        </Box>
    )
}
