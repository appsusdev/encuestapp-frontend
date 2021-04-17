import { useDispatch } from 'react-redux';
import { Form, Formik } from 'formik';
import { useIntl, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import clsx from 'clsx';

import { Box, Button, Grid, makeStyles, MenuItem, Checkbox } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { Fonts } from '../../../shared/constants/AppEnums';
import { uiCloseModalAdd } from '../../../actions/ui';
import { MyTextField } from '../../custom/MyTextField';
import { TypeEnum } from '../../../interfaces/Survey';
import { useState } from 'react';

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

export const FormAddQuestion = () => {

    interface Options {
        label: string;
        description?: boolean;
        textDescription?: string;
        typeDescription?: Partial<TypeEnum>
    }

    const intl = useIntl();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [options, setOptions] = useState<Options[]>([]);

    const validationSchema = yup.object({
        chapter: yup.string(),
        question: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        directedTo: yup.number(),
        chart: yup.boolean(),
        type: yup.string(),
        label: yup.string(),
        description: yup.boolean(),
        textDescription: yup.string(),
        typeDescription: yup.string(),
        deparment: yup.boolean(),
        town: yup.boolean(),
    });

    interface myFormValues {
        chapter: string,
        question: string,
        directedTo: number,
        chart: boolean,
        type: TypeEnum,
        label: string,
        description: boolean,
        textDescription: string,
        typeDescription: Partial<TypeEnum>,
        department: boolean,
        town: boolean,
    }

    const initialValues: Partial<myFormValues> = {
        chapter: '',
        question: '',
        directedTo: 1,
        chart: false,
        type: TypeEnum.TEXT_INPUT,
        label: '',
        description: false,
        textDescription: '',
        typeDescription: TypeEnum.TEXT_INPUT,
        department: false,
        town: false,
    }

    const onClose = () => {
        dispatch(uiCloseModalAdd());
    }

    const addOptions = (values: Partial<myFormValues>) => {
        const label = values.label;
        const description = values.description;
        const typeDescription = values.typeDescription;
        const textDescription = values.textDescription;
        if(label) {
            console.log(options);
            const newOption = { label, description, typeDescription, textDescription }
            setOptions([...options, newOption])
            return console.log('Option', newOption)
        } else {
            console.log('No existe label');
        }
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

                            <Grid item xs={12}>
                                <label className="form-text"><FormattedMessage id='SelectChapter' /></label>
                                <MyTextField
                                    name="chapter"
                                    variant='outlined'
                                    select
                                    className={classes.myTextFieldRoot}
                                >
                                    <MenuItem value={0}>Datos básicos</MenuItem>
                                    <MenuItem value={1}>Datos del hogar</MenuItem>
                                </MyTextField>
                            </Grid>

                            <Grid item xs={12}>
                                <label className="form-text"><FormattedMessage id='Question' /></label>
                                <MyTextField
                                    name="question"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                            <Grid item xs={5}>
                                <label className="form-text"><FormattedMessage id='DirectedTo' /></label>
                                <MyTextField
                                    name="directedTo"
                                    variant='outlined'
                                    select
                                    className={classes.myTextFieldRoot}
                                >
                                    <MenuItem value={0}>Al hogar</MenuItem>
                                    <MenuItem value={1}>A cada persona</MenuItem>
                                </MyTextField>
                            </Grid>

                            <Grid item xs={3}>
                                <Box mt={2}>
                                    <Checkbox
                                        checked={values.chart}
                                        name="chart"
                                        onChange={handleChange}
                                        color="default"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                    <label className="form-text"><FormattedMessage id='Chart' /></label>
                                </Box>
                            </Grid>

                            <Grid item xs={4}>
                                <label className="form-text"><FormattedMessage id='Type' /></label>
                                <MyTextField
                                    name="type"
                                    variant='outlined'
                                    select
                                    className={classes.myTextFieldRoot}
                                >
                                    <MenuItem value={"TEXT_INPUT"}>Texto</MenuItem>
                                    <MenuItem value={"NUMBER"}>Número</MenuItem>
                                    <MenuItem value={"TEXT_AREA"}>Área de texto</MenuItem>
                                    <MenuItem value={"SELECT"}>Select</MenuItem>
                                    <MenuItem value={"CHECK"}>Checkbox</MenuItem>
                                    <MenuItem value={"RADIO"}>Radio</MenuItem>
                                    <MenuItem value={"REGION"}>Región</MenuItem>
                                    <MenuItem value={"FILE"}>Adjunto</MenuItem>
                                    <MenuItem value={"GEOLOCATION"}>Geolocalización</MenuItem>
                                    <MenuItem value={"PICTURE"}>Imagen</MenuItem>
                                    <MenuItem value={"DATE"}>Fecha</MenuItem>
                                </MyTextField>
                            </Grid>

                            {
                                (values.type === 'SELECT' || values.type === 'CHECK' || values.type === 'RADIO') &&
                                <>
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
                                            disabled={(values.description===false)}
                                        />
                                    </Grid>

                                    <Grid item xs={4}>

                                        <Button size="medium" style={{ color: '#fff', height: '40px', width: '100%', marginTop: '25px', textTransform: 'capitalize' }} className={classes.save}
                                            onClick={() => addOptions(values)}
                                        >
                                            <FormattedMessage id='AddOption' />
                                        </Button>
                                    </Grid>
                                </>
                            }
                            {
                                (values.type === 'REGION') &&
                                <>
                                    <Grid item xs={12}>
                                        <Box mb={-1}>
                                            <label className="form-text" style={{ color: '#F04F47', fontSize: 12 }}><FormattedMessage id='MessageFive' /></label>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        {/* <Box mt={2}> */}

                                        <Checkbox
                                            checked={values.department}
                                            name="department"
                                            onChange={handleChange}
                                            color="default"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                        <label className="form-text"><FormattedMessage id='Department' /></label>

                                        <Checkbox
                                            checked={values.town}
                                            name="town"
                                            onChange={handleChange}
                                            color="default"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                        <label className="form-text"><FormattedMessage id='Town' /></label>
                                        {/* </Box> */}

                                    </Grid>
                                </>
                            }
                        </Grid>
                        {/* <Divider/> */}

                        <Box mt={3} display="flex" flexDirection="row-reverse">
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
