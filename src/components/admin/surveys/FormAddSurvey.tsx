import { useDispatch } from 'react-redux';
import { Form, Formik } from 'formik';
import { useIntl, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import clsx from 'clsx';

import { Box, Button, Grid } from '@material-ui/core';
import { uiCloseModalAdd } from '../../../actions/ui';
import { AntSwitch } from '../../custom/CustomizedSwitch';
import { MyTextField } from '../../custom/MyTextField';
import { useStyles } from '../../../shared/styles/useStyles';

interface MyFormValues {
    code: string;
    creationDate: string;
    state: boolean;
    name: string;
}

export const FormAddSurvey = () => {

    const intl = useIntl();
    const classes = useStyles();
    const dispatch = useDispatch();

    const validationSchema = yup.object({
        code: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        creationDate: yup.date(),
        state: yup.boolean(),
        name: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`)
    });

    const initialValues: MyFormValues = {
        code: '',
        creationDate: new Date().toLocaleDateString('en-CA'),
        state: false,
        name: ''
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
        </Box>
    )
}
