import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import { useIntl, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import clsx from 'clsx';

import { Box, Button, Grid } from '@material-ui/core';
import { uiCloseModalAdd, uiCloseErrorAlert, uiCloseSuccessAlert } from '../../../redux/actions/uiActions';
import { AntSwitch } from '../../custom/CustomizedSwitch';
import { MyTextField } from '../../custom/MyTextField';
import { useStyles } from '../../../shared/styles/useStyles';
import { Survey } from '../../../interfaces/Survey';
import { startNewSurvey } from '../../../redux/actions/surveysActions';
import { MyAlert } from '../../custom/MyAlert';
import { AppState } from '../../../redux/reducers/rootReducer';

export const FormAddSurvey = () => {

    const intl = useIntl();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { errorAlert, successAlert } = useSelector<AppState, AppState['ui']>(state => state.ui);

    const validationSchema = yup.object({
        code: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        creationDate: yup.date(),
        state: yup.boolean(),
        name: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`)
    });

    const initialValues: Partial<Survey> = {
        code: '',
        creationDate: new Date().toLocaleDateString('en-CA'),
        state: false,
        name: ''
    }

    const onClose = () => {
        dispatch(uiCloseModalAdd());
    }

    const closeAlert = () => {
        dispatch(uiCloseErrorAlert());
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
                onSubmit={(data, { setSubmitting }) => {
                    setSubmitting(true);
                    dispatch( startNewSurvey(data));
                    setSubmitting(false);
                }}>
                {({ values, isSubmitting, handleChange }) => (

                    <Form className={classes.input}>

                        <Grid container spacing={2}>

                            <Grid item xs={5}>
                                <label className="form-text"><FormattedMessage id='Code' /></label>
                                <MyTextField
                                    name="code"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                            <Grid item xs={5}>
                                <label className="form-text"><FormattedMessage id='CreationDate' /></label>
                                <MyTextField
                                    name="creationDate"
                                    variant='outlined'
                                    type="date"
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <label className="form-text" ><FormattedMessage id='State' /></label>
                                <Box mt={2}>
                                    <AntSwitch checked={values.state} name="state" onChange={handleChange} />
                                </Box>
                            </Grid>


                            <Grid item xs={12}>
                                <label className="form-text"><FormattedMessage id='Name' /></label>
                                <MyTextField
                                    name="name"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                        </Grid>

                        <Box mt={2} display="flex" flexDirection="row-reverse">
                            <Button className={clsx(classes.btn, classes.save)} autoFocus
                                type='submit'
                                disabled={isSubmitting} >
                                <FormattedMessage id="Accept" />
                            </Button>
                            <Button className={clsx(classes.btn, classes.cancel)} onClick={onClose}>
                                <FormattedMessage id="Cancel" />
                            </Button>
                        </Box>

                    </Form>
                )}
            </Formik>

            <MyAlert open={successAlert} typeAlert="success" message="SurveyCreated" time={2000} handleClose={closeSuccess}/>
            <MyAlert open={errorAlert} typeAlert="error" message="MessageExistsSurvey" time={2000} handleClose={closeAlert}/>
        </Box>
    )
}
