import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Form } from 'formik';
import clsx from 'clsx';
import * as yup from 'yup';

import { Box, Button, CircularProgress, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Chapter, Survey } from '../../../interfaces/Survey';
import { ChapterTable } from './ChapterTable';
import { MyAlert } from '../../custom/MyAlert';
import { MyTextField } from '../../custom/MyTextField';
import { useStyles } from '../../../shared/styles/useStyles';
import { uiCloseModalDelete, uiCloseErrorAlert, uiCloseSuccessAlert, uiCloseModalAlert } from '../../../redux/actions/uiActions';
import { startNewChapter, setChapters, chapterCleanActive } from '../../../redux/actions/surveysActions';
import { cleanActiveSurvey } from '../../../redux/actions/surveyorsActions';
import { AppState } from '../../../redux/reducers/rootReducer';

export const FormAddChapter = () => {

    const intl = useIntl();
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const { activeSurvey, activeChapter } = useSelector<AppState, AppState['survey']>(state => state.survey);
    const { errorAlert, successAlert, modalAlert } = useSelector<AppState, AppState["ui"]>((state) => state.ui);
    const survey: Survey = activeSurvey;
    const chapter: Chapter = activeChapter;
    
    let initialValues: Partial<Chapter> = {
        number: '',
        name: ''
    }
    if(chapter) {
        initialValues = {
            number: chapter.number,
            name: chapter.name
        }
    }
    
    const validationSchema = yup.object({
        number: yup.number().typeError(`${intl.formatMessage({ id: "NumericValue" })}`).required(`${intl.formatMessage({ id: 'RequiredFile' })}`),
        name: yup.string().required(`${intl.formatMessage({ id: 'RequiredFile' })}`)
    });

    const onClose = () => {
        dispatch( uiCloseModalDelete() );
        dispatch( cleanActiveSurvey() );
        dispatch( chapterCleanActive() ); 
        dispatch( setChapters([]) );
    }

    const closeError = () => {
        dispatch(uiCloseErrorAlert());
    };

    const closeSuccess = () => {
        dispatch(uiCloseSuccessAlert());
        dispatch(uiCloseModalAlert());
    };

    const handleNewChapter = () => {
        dispatch(chapterCleanActive());
    }

    return (
        <Box m={1}>
            <Formik
                enableReinitialize
                validateOnChange={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async(data, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    let action: boolean = true;
                    if(chapter) {
                        action = false
                        await dispatch( startNewChapter(data, survey.idSurvey, action, chapter.id) );
                    } else {
                        await dispatch( startNewChapter(data, survey.idSurvey, action) );
                    }
                    setSubmitting(false);
                    resetForm({});
                }}>
                {({ isSubmitting }) => (

                    <Form className={classes.input}>

                        <Grid container spacing={2}>
                            {
                                (chapter) &&
                                <Grid container spacing={2} >
                                    <Box m={2} display="flex" justifyContent="space-between" width='100%'>
                                        <Grid item xs={8}> <FormattedMessage id="EditChapterMessage"/></Grid>
                                        <Grid item xs={3}> 
                                        <Button className={clsx(classes.btnAction, classes.cancel)} onClick={handleNewChapter}>
                                            <AddIcon/> <FormattedMessage id="Chapter" />
                                            </Button>
                                        </Grid>
                                    </Box>
                                </Grid>
                            }
                            <Grid item xs={2}>
                                <label className="form-text"><FormattedMessage id='Number' /></label>
                                <MyTextField
                                    name="number"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                    />
                            </Grid>

                            <Grid item xs={10}>
                                <label className="form-text"><FormattedMessage id='Name' /></label>
                                <MyTextField
                                    name="name"
                                    variant='outlined'
                                    className={classes.myTextFieldRoot}
                                />
                            </Grid>

                        </Grid>

                        <Box mt={2} display="flex" flexDirection="row-reverse">
                            {!isSubmitting ? (
                                <Button
                                    className={clsx(classes.btn, classes.save)}
                                    autoFocus
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    <FormattedMessage id="Accept" />
                                </Button>
                            ) : (
                                <Button
                                    className={clsx(classes.btn, classes.save)}
                                    autoFocus
                                    type="button"
                                    disabled={true}
                                >
                                    <CircularProgress className={classes.btnLoading} />
                                </Button>
                            )}
                            <Button className={clsx(classes.btn, classes.cancel)} onClick={onClose}>
                                <FormattedMessage id="Cancel" />
                            </Button>
                        </Box>

                    </Form>

                )}
            </Formik>

            <ChapterTable />

            <MyAlert
                open={errorAlert}
                typeAlert="error"
                message="MessageExistsChapter"
                time={2000}
                handleClose={closeError}
            />

            <MyAlert
                open={successAlert}
                typeAlert="success"
                message={(chapter)? "ChapterEditSuccess" : "ChapterAddSuccess"}
                time={2000}
                handleClose={closeSuccess}
            />

            <MyAlert
                open={modalAlert}
                typeAlert="success"
                message="ChapterDeletedSuccess"
                time={2000}
                handleClose={closeSuccess}
            />

        </Box>
    )
}
