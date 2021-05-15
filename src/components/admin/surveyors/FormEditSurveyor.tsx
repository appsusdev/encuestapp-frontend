import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import { useIntl, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import clsx from 'clsx';

import { Box, Button, Grid, IconButton, Card, CardMedia, Tooltip, MenuItem } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import { uiCloseModalEdit, uiCloseSuccessAlert } from '../../../redux/actions/uiActions';
import { MyTextField } from '../../custom/MyTextField';
import { useStyles } from '../../../shared/styles/useStyles';
import { AppState } from '../../../redux/reducers/rootReducer';
import { TypeDoc } from '../../../enums/enums';
import { startEditSurveyor, startLoadingSurveyors } from '../../../redux/actions/surveyorsActions';
import { Surveyor } from '../../../interfaces/Surveyor';
import { MyAlert } from '../../custom/MyAlert';
import logo from '../../../assets/images/user.jpg'

export const FormEditSurveyor = () => {

    const intl = useIntl();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { activeSurveyor } = useSelector<AppState, AppState['surveyor']>(state => state.surveyor);
    const { successAlert } = useSelector<AppState, AppState['ui']>(state => state.ui);
    const { municipios } = useSelector<AppState, AppState['auth']>(state => state.auth);
    const surveyor: any = activeSurveyor;


    const validationSchema = yup.object({
        typeDoc: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        document: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`).min(6,`${intl.formatMessage({ id: 'MinimumPassword' })}`),
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

    const initialValues: Partial<Surveyor> = {
        typeDoc: surveyor.typeDoc,
        document: surveyor.document,
        firstName: surveyor.firstName,
        secondName: surveyor.secondName,
        firstLastName: surveyor.firstLastName,
        secondLastName: surveyor.secondLastName,
        username: '',
        email: surveyor.email,
        mobilePhone: surveyor.mobilePhone,
        address: surveyor.address,
        profileImage: null
    }

    const onClose = () => {
        dispatch(uiCloseModalEdit());
    }

    const closeSuccess = () => {
        dispatch( uiCloseSuccessAlert() );
        dispatch( uiCloseModalEdit() );
        (municipios) && dispatch( startLoadingSurveyors(municipios[0]));
    }

    return (
        <Box m={1}>
            <Formik
                validateOnChange={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting }) => {
                    setSubmitting(true);
                    dispatch(startEditSurveyor(data));
                    setSubmitting(false);
                }}>
                {({ values, isSubmitting }) => (

                    <Form className={classes.input}>

                        <Grid container spacing={2}>

                            <Grid item xs={4} >

                                <Grid item xs={12}>
                                    <MyTextField
                                        name="image"
                                        variant='outlined'
                                        label={<FormattedMessage id='Image' />}
                                        className={classes.myTextFieldRoot}
                                        disabled
                                    />
                                </Grid>

                                <Grid item >
                                    <Card className={classes.card}>
                                        <CardMedia
                                            className={classes.media}
                                            image={logo}
                                            title="Paella dish"
                                        />
                                    </Card>
                                </Grid>

                                <Grid container style={{ marginTop: '15px' }}>

                                    <Grid item xs={11}>
                                        <MyTextField
                                            accept="image/*"
                                            type="file"
                                            name="profileImage"
                                            id="icon-button-file"
                                            style={{ display: 'none' }}
                                        />
                                        <MyTextField disabled={true} variant="outlined" style={{ color: 'black' }} placeholder={values.profileImage} name='hola' className={classes.myTextFieldRoot} />
                                    </Grid>


                                    <Grid item xs={1}>
                                        <Box mt={1} ml={-1}>
                                            <Tooltip title={`${intl.formatMessage({ id: 'SearchImage' })}`}>
                                                <label htmlFor="icon-button-file">
                                                    <IconButton component="span"><PhotoCamera /></IconButton>
                                                </label>
                                            </Tooltip>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} style={{ marginTop: '8px' }}>
                                    <label className="form-text"><FormattedMessage id='UserType' /></label>
                                    <MyTextField
                                        name="userType"
                                        variant='outlined'
                                        className={classes.myTextFieldRoot}
                                        label={`${intl.formatMessage({ id: 'Surveyor'})}`}
                                        disabled
                                    />
                                </Grid>


                            </Grid>

                            <Grid item xs={8} >

                                <Grid item xs={12}>
                                    <MyTextField
                                        name="data"
                                        variant='outlined'
                                        label={<FormattedMessage id='Data' />}
                                        className={classes.myTextFieldRoot}
                                        disabled
                                    />
                                </Grid>

                                <Grid container spacing={2}>

                                    <Grid item xs={6} style={{ marginTop: '10px' }}>
                                        <label className="form-text"><FormattedMessage id='FirstName' /></label>
                                        <MyTextField
                                            name="firstName"
                                            variant='outlined'
                                            className={classes.myTextFieldRoot}
                                        />
                                    </Grid>

                                    <Grid item xs={6} style={{ marginTop: '10px' }}>
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
                                            InputLabelProps={{ shrink: false }} 
                                            className={classes.myTextFieldRoot}
                                            label={`${values.firstName} ${values.secondName} ${values.firstLastName} ${values.secondLastName}`}
                                            disabled={true}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <label className="form-text"><FormattedMessage id='Email' /></label>
                                        <MyTextField
                                            name="email"
                                            variant='outlined'
                                            className={classes.myTextFieldRoot}
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <label className="form-text"><FormattedMessage id='DocumentType' /></label>
                                        <MyTextField
                                            name="typeDoc"
                                            variant='outlined'
                                            select
                                            className={classes.myTextFieldRoot}
                                        >
                                            <MenuItem value={TypeDoc.CC}><FormattedMessage id='CitizenshipCard' /></MenuItem>
                                            <MenuItem value={TypeDoc.CE}><FormattedMessage id='ForeignersIdentityCard' /></MenuItem>
                                            <MenuItem value={TypeDoc.PASSPORT}><FormattedMessage id='Passport' /></MenuItem>
                                        </MyTextField>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <label className="form-text"><FormattedMessage id='DocumentNumber' /></label>
                                        <MyTextField
                                            name="document"
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

                                </Grid>

                            </Grid>
                        </Grid>

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

            <MyAlert open={successAlert} typeAlert="success" message="UpdatedSurveyor" time={2000} handleClose={closeSuccess}/>
        </Box>
    )
}
