
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import { useIntl, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import clsx from 'clsx';

import { Box, Button, Grid, MenuItem, IconButton, Tooltip, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import { uiCloseModalAdd, uiCloseAlert, uiCloseSuccessAlert, uiCloseErrorAlert, uiOpenSuccessAlert } from '../../../redux/actions/uiActions';
import { MyTextField } from '../../custom/MyTextField';
import { useStyles } from '../../../shared/styles/useStyles';
import { Surveyor } from '../../../interfaces/Surveyor';
import { TypeDoc } from '../../../enums/enums';
import { useState } from 'react';
import { startNewSurveyor } from '../../../redux/actions/surveyorsActions';
import { AppState } from '../../../redux/reducers/rootReducer';
import { MyAlert } from '../../custom/MyAlert';
import { addSurveyorToTown, updateTowns } from '../../../services/firebase/surveyors';

export const FormAddSurveyor = () => {
    const initialValues: Partial<Surveyor> = {
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

    const intl = useIntl();
    const classes = useStyles();

    const dispatch = useDispatch();
    const [noValid, setNoValid] = useState(false);
    const [labelImage, setLabelImage] = useState('');
    const [email, setEmail] = useState<string | undefined>('');
    const { alert, errorAlert, successAlert } = useSelector<AppState, AppState['ui']>(state => state.ui);
    const { municipios } = useSelector<AppState, AppState['auth']>(state => state.auth);
    const { surveyorFromDB } = useSelector<AppState, AppState['surveyor']>(state => state.surveyor);
    const surveyorDB: any = surveyorFromDB;

    const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png'];

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
        profileImage: yup.mixed().test(
            'fileFormat',
            'Archivo no soportado',
            (value) => { 
                setLabelImage(value?.split('\\').pop());
                const file = value?.split('\\').pop()?.split('.');
                let fileType = '';
                if(file) {
                    fileType = file[file.length-1];
                    (!SUPPORTED_FORMATS.includes(fileType)) ? setNoValid(true) : setNoValid(false);
                } 
                if(!value) return true
                return SUPPORTED_FORMATS.includes(fileType)
            }
          )
    });


    const onClose = () => {
        dispatch(uiCloseModalAdd());
    }

    const handleAddSurveyor = async() => {
        const surveyorTown = { email: email, encuestasAsignadas: [] };

        if(surveyorDB) {
            const townsSurveyor: string[] = surveyorDB.municipios;
            municipios?.forEach( (town: string) => {
                townsSurveyor.push(town);
            });

            const updateSurveyor = { municipios: townsSurveyor}
            await updateTowns(email, updateSurveyor);
        }

        if(municipios) {
            await addSurveyorToTown(municipios, email, surveyorTown);
            dispatch( uiCloseAlert() );
            dispatch( uiOpenSuccessAlert() );
        }
    }

    const closeDialog = () => {
        dispatch( uiCloseAlert() );
        dispatch( uiCloseErrorAlert() );
    }

    const closeSuccess = () => {
        dispatch( uiCloseSuccessAlert() );
        dispatch( uiCloseModalAdd() );
    }

    return (
        <Box m={1}>
            <Formik
                validateOnChange={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true);
                    setEmail(values.email);
                    console.log(values)
                    dispatch( startNewSurveyor(values) );
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
                                    <MenuItem value={TypeDoc.CC}><FormattedMessage id='CitizenshipCard' /></MenuItem>
                                    <MenuItem value={TypeDoc.CE}><FormattedMessage id='ForeignersIdentityCard' /></MenuItem>
                                    <MenuItem value={TypeDoc.PASSPORT}><FormattedMessage id='Passport' /></MenuItem>
                                </MyTextField>
                            </Grid>

                            <Grid item xs={8}>
                                <label className="form-text"><FormattedMessage id='DocumentNumber' /></label>
                                <MyTextField
                                    name="document"
                                    variant='outlined'
                                    type='number'
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
                                    label={`${values.firstName} ${values.secondName} ${values.firstLastName} ${values.secondLastName}`}
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
                                    name="profileImage"
                                    type="file"
                                    id="icon-button-file"
                                    style={{ display: 'none' }}
                                />
                                <MyTextField 
                                    disabled={true} variant="outlined" style={{ color: 'black' }} label={labelImage} name='hola' className={classes.myTextFieldRoot} />
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
                            {
                                (noValid) &&
                                <Grid item xs={12}>
                                    <Box mt={-2} ml={2} style={{ fontSize: 12, color: 'red'}}>
                                        <FormattedMessage id='ValidFiles'/>
                                    </Box>
                                </Grid>
                            }
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
            
            <Dialog
                open={alert}
                onClose={closeDialog}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogContent>
                    <DialogContentText>
                        <FormattedMessage id='MessageExistsSurveyor'/> <br/>
                        {email}<br/><br/>
                        <FormattedMessage id='MessageAddSurveyor'/> 
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={closeDialog} color="primary">
                        <FormattedMessage id='Cancel'/> 
                    </Button>
                    <Button onClick={handleAddSurveyor} color="primary" autoFocus>
                        <FormattedMessage id='Accept'/> 
                    </Button>
                </DialogActions>
            </Dialog>

            <MyAlert open={successAlert} typeAlert="success" message="SurveyorAddSuccess" time={2000} handleClose={closeSuccess}/>
            <MyAlert open={errorAlert} typeAlert="error" message="MessageExistsSurveyorTown" time={2000} handleClose={closeDialog}/>
        </Box>
    )
}