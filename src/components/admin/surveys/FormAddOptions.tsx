import { useDispatch } from 'react-redux';
import { Form, Formik } from 'formik';
import { useIntl, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import clsx from 'clsx';

import { Box, Button, Checkbox, Grid, makeStyles, MenuItem } from '@material-ui/core';
import { Fonts } from '../../../shared/constants/AppEnums';
import { uiCloseModalAdd } from '../../../actions/ui';
import { AntSwitch } from '../../custom/CustomizedSwitch';
import { MyTextField } from '../../custom/MyTextField';
import { TypeEnum } from '../../../interfaces/Survey';

const useStyles = makeStyles(() => ({
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
    save: {
        background: '#0A8FDC',
        '&:hover': {
            background: '#0A6DDC'
        }
    }
}));

interface MyFormValues {
    label: string,
    description?: boolean,
    textDescription?: string,
    typeDescription?: Partial<TypeEnum>,
}


export const FormAddOptions = () => {

    const intl = useIntl();
    const classes = useStyles();
    const dispatch = useDispatch();

    const validationSchema = yup.object({
        label: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        description: yup.boolean(),
        textDescription: yup.string(),
        typeDescription: yup.string()
    });

    const initialValues: MyFormValues = {
        label: '',
        description: false,
        textDescription: '',
        typeDescription: TypeEnum.TEXT_INPUT
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
                {({ values, handleChange, handleSubmit }) => (

                    // <Form className={classes.input}>

                        <Grid container spacing={2}>

                        <Grid item xs={12}>
                                        <Box mb={-1}>
                                            <label className="form-text" style={{ color: '#F04F47', fontSize: 12 }}><FormattedMessage id='MessageFour' /></label>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <label className="form-text"><FormattedMessage id='AddOptions' /></label>
                                        <MyTextField
                                            name="label"
                                            variant='outlined'
                                            className={classes.myTextFieldRoot}
                                        />
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Box mt={2}>
                                            <Checkbox
                                                checked={values.description}
                                                name="description"
                                                onChange={handleChange}
                                                color="default"
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                            <label className="form-text"><FormattedMessage id='Description' /></label>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <label className="form-text"><FormattedMessage id='TypeDescription' /></label>
                                        <MyTextField
                                            name="typeDescription"
                                            variant='outlined'
                                            select
                                            className={classes.myTextFieldRoot}
                                        >
                                            <MenuItem value={"TEXT_INPUT"}>Texto</MenuItem>
                                            <MenuItem value={"NUMBER"}>Número</MenuItem>
                                            <MenuItem value={"TEXT_AREA"}>Área de texto</MenuItem>
                                        </MyTextField>
                                    </Grid>

                                    <Grid item xs={5}>
                                        <label className="form-text"><FormattedMessage id='DescriptionName' /></label>
                                        <MyTextField
                                            name="textDescription"
                                            variant='outlined'
                                            className={classes.myTextFieldRoot}
                                        />
                                    </Grid>

                                    <Grid item xs={4}>

                                        <Button size="medium" style={{ color: '#fff', height: '40px', width: '100%', marginTop: '25px', textTransform: 'capitalize' }} className={classes.save}
                                            type='button' 
                                            
                                        >    
                                            <FormattedMessage id='AddOption' />
                                        </Button>
                                    </Grid>

                        </Grid>


                    // </Form>
                )}
            </Formik>
        </Box>
    )
}
