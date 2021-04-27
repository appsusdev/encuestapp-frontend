import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Formik } from 'formik';
import { useIntl, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import clsx from 'clsx';

import { Box, Button, Grid, MenuItem, Checkbox, Tooltip, IconButton } from '@material-ui/core';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { Alert } from '@material-ui/lab';
import { MyTextField } from '../../custom/MyTextField';
import { uiCloseModalAdd } from '../../../redux/actions/uiActions';
import { TypeEnum, QuestionOptions } from '../../../interfaces/Survey';
import { useStyles } from '../../../shared/styles/useStyles';

export const FormAddQuestion = () => {

    const intl = useIntl();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [options, setOptions] = useState<QuestionOptions[]>([]);

    const [state, setState] = useState(false);

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
        options: QuestionOptions[],
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
        options: options
    }

    const onClose = () => {
        dispatch(uiCloseModalAdd());
    }

    const addOptions = (values: Partial<myFormValues>) => {

        const label = values.label;
        const value = options.length;
        const description = values.description;
        const typeDescription = values.typeDescription;
        const textDescription = values.textDescription;
        if(label) {
            setState(false);
            const newOption = { label, value, description, typeDescription, textDescription }
            setOptions([...options, newOption]);
            values.label = "";
            values.description = false;
            values.textDescription = "";
        } else {
            setState(true);
        }
    }

    const deleteOption = (option: QuestionOptions) => {
        const newOptions = options.filter( item => item.value !== option.value)
        setOptions(newOptions);
    }

    return (
        <Box m={1}>
            <Formik
                validateOnChange={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting }) => {
                    data.options = options;
                    console.log(data);
                    setSubmitting(true);
                    // dispatch( guardar en BD);
                    setSubmitting(false);
                }}>
                {({ values, isSubmitting, handleChange, handleSubmit }) => (

                    <Form className={classes.input} onSubmit={handleSubmit}>

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
                                <Tooltip title={`${intl.formatMessage({ id: 'MessageSix' })}`}> 
                                
                                    <Checkbox
                                        checked={values.chart}
                                        name="chart"
                                        onChange={handleChange}
                                        color="default"
                                        disabled={(values.type === 'TEXT_INPUT') || (values.type === 'TEXT_AREA') || (values.type === 'REGION') || (values.type === 'FILE') || (values.type === 'GEOLOCATION') || (values.type === 'PICTURE')}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                </Tooltip>
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
                                    <Grid item xs={3}></Grid>
                                    {
                                        (state === true) &&
                                        <Grid item xs={12}>
                                            <Alert severity="error" color="error">
                                                Debe agregar una opción válida
                                            </Alert>
                                        </Grid>
                                    }
                                    {
                                        (options.length > 0) &&
                                        options.map((option, index) => {
                                            return (
                                            <Grid container key={index} style={{marginTop: '10px'}}>
                                            
                                                <Grid item xs={3}>
                                                    <Checkbox
                                                        color="default"
                                                        disabled
                                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                                    />
                                                    <label className="form-text">{option.label}</label>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Box style={{marginTop: '10px'}}>
                                                        {option.textDescription} 
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={5}>
                                                {
                                                    (option.description) &&
                                                     <MyTextField 
                                                        name="option"
                                                        variant="outlined"
                                                        disabled
                                                        type="number"
                                                     />
                                                }
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <Tooltip title={`${intl.formatMessage({ id: 'Delete' })}`}>
                                                        <IconButton aria-label="expand row" size="small" style={{marginLeft: '5px'}} onClick={() => deleteOption(option) }> <DeleteOutlineOutlinedIcon /> </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                            )
                                        })
                                    }
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
                                // onClick={handleSubmit}
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
