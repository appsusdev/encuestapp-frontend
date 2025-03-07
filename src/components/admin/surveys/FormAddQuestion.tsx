import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { useIntl, FormattedMessage } from "react-intl";
import * as yup from "yup";
import clsx from "clsx";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Checkbox,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { Alert } from "@material-ui/lab";
import { MyTextField } from "../../custom/MyTextField";
import {
  uiCloseSuccessAlert,
  uiCloseModalAssign,
  uiCloseQuestion,
} from "../../../redux/actions/uiActions";
import { QuestionOptions, Survey, Chapter } from "../../../interfaces/Survey";
import { useStyles } from "../../../shared/styles/useStyles";
import {
  startLoadingChapters,
  startNewQuestion,
  questionCleanActive,
  chapterQuestionCleanActive,
  startEditQuestion,
} from "../../../redux/actions/surveysActions";
import { AppState } from "../../../redux/reducers/rootReducer";
import { TypeQuestion, TypeDirectedTo } from "../../../enums/enums";
import { MyAlert } from "../../custom/MyAlert";
import { surveyCleanActive } from "../../../redux/actions/surveysActions";

export const FormAddQuestion = () => {
  const intl = useIntl();
  const classes = useStyles();
  const dispatch = useDispatch();

  const { municipio } = useSelector<AppState, AppState["auth"]>(
    (state) => state.auth
  );
  const { activeSurvey, activeQuestion, chapters, chapterQuestion } =
    useSelector<AppState, AppState["survey"]>((state) => state.survey);
  const { successAlert, openQuestion } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const survey: Survey = activeSurvey;
  const list: Chapter[] = chapters;

  const [options, setOptions] = useState<QuestionOptions[]>(
    activeQuestion && activeQuestion.options ? activeQuestion.options : []
  );
  const [state, setState] = useState(false);

  useEffect(() => {
    municipio && dispatch(startLoadingChapters(municipio, survey.idSurvey));
    // eslint-disable-next-line
  }, [dispatch]);

  const validationSchema = yup.object({
    chapter: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    question: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    directedTo: yup.number(),
    chart: yup.boolean(),
    type: yup.string(),
    label: yup.string(),
    description: yup.boolean(),
    textDescription: yup.string(),
    typeDescription: yup.string(),
  });

  interface myFormValues {
    chapter: string;
    question: string;
    directedTo: number;
    chart: boolean;
    type: TypeQuestion;
    options: QuestionOptions[] | null;
    label: string;
    description: boolean;
    textDescription: string;
    typeDescription: Partial<TypeQuestion>;
    answers: any[];
    questionNumber: number;
  }

  let initialValues: Partial<myFormValues> = {
    chapter: "",
    question: "",
    directedTo: 0,
    chart: false,
    type: TypeQuestion.TEXT_INPUT,
    label: "",
    description: false,
    textDescription: "",
    typeDescription: TypeQuestion.TEXT_INPUT,
    options: options,
    answers: [],
    questionNumber: 0,
  };

  if (activeQuestion && chapterQuestion) {
    initialValues = {
      chapter: chapterQuestion.id,
      question: activeQuestion.question,
      directedTo: activeQuestion.directedTo === "PreguntasIndividual" ? 0 : 1,
      chart: activeQuestion.chart,
      type: activeQuestion.type,
      label: "",
      description: false,
      textDescription: "",
      typeDescription: TypeQuestion.TEXT_INPUT,
      options: options,
      answers: activeQuestion.answers,
      questionNumber: activeQuestion.questionNumber,
    };
  }

  const onClose = () => {
    if (openQuestion) {
      dispatch(chapterQuestionCleanActive());
      dispatch(questionCleanActive());
      dispatch(uiCloseQuestion());
    } else {
      dispatch(uiCloseModalAssign());
      dispatch(surveyCleanActive());
    }
  };

  const addOptions = (values: Partial<myFormValues>) => {
    const label = values.label;
    const value = options.length;
    const description = values.description;
    const typeDescription = values.typeDescription;
    const textDescription = values.textDescription;
    if (label) {
      setState(false);
      const newOption = {
        label,
        value,
        description,
        typeDescription,
        textDescription,
      };
      setOptions([...options, newOption]);
      values.label = "";
      values.description = false;
      values.textDescription = "";
    } else {
      setState(true);
    }
  };

  const deleteOption = (option: QuestionOptions) => {
    const newOptions = options.filter((item) => item.value !== option.value);
    setOptions(newOptions);
  };

  const closeSuccess = () => {
    dispatch(uiCloseSuccessAlert());
  };

  return (
    <Box m={1}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting, resetForm }) => {
          if (
            data.type === TypeQuestion.SELECT ||
            data.type === TypeQuestion.CHECK ||
            data.type === TypeQuestion.RADIO
          ) {
            data.options = options;
          } else {
            data.options = null;
          }
          setSubmitting(true);
          if (activeQuestion) {
            // Editar pregunta
            await dispatch(
              startEditQuestion(data, survey.idSurvey, activeQuestion.id)
            );
          } else {
            data.answers = [];
            // Agregar pregunta
            await dispatch(startNewQuestion(data, survey.idSurvey));
            resetForm({});
          }
          setOptions([]);
          setSubmitting(false);
        }}
      >
        {({ values, isSubmitting, handleChange, handleSubmit }) => (
          <Form className={classes.input} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <label className="form-text">
                  <FormattedMessage id="SelectChapter" />
                </label>
                <MyTextField
                  name="chapter"
                  variant="outlined"
                  select
                  className={classes.myTextFieldRoot}
                  disabled={activeQuestion ? true : false}
                >
                  {list.map((chapter) => (
                    <MenuItem key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </MenuItem>
                  ))}
                </MyTextField>
              </Grid>

              <Grid item xs={12}>
                <label className="form-text">
                  <FormattedMessage id="Question" />
                </label>
                <MyTextField
                  name="question"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={5}>
                <label className="form-text">
                  <FormattedMessage id="DirectedTo" />
                </label>
                <MyTextField
                  name="directedTo"
                  variant="outlined"
                  select
                  className={classes.myTextFieldRoot}
                  disabled={activeQuestion ? true : false}
                >
                  <MenuItem value={0}>{TypeDirectedTo.INDIVIDUAL}</MenuItem>
                  <MenuItem value={1}>{TypeDirectedTo.HOGAR}</MenuItem>
                </MyTextField>
              </Grid>

              <Grid item xs={3}>
                {(values.type === TypeQuestion.NUMBER ||
                  values.type === TypeQuestion.SELECT ||
                  values.type === TypeQuestion.CHECK ||
                  values.type === TypeQuestion.RADIO ||
                  values.type === TypeQuestion.DATE) && (
                  <Box mt={2}>
                    <Tooltip
                      title={`${intl.formatMessage({ id: "MessageSix" })}`}
                    >
                      <Checkbox
                        checked={values.chart}
                        name="chart"
                        onChange={handleChange}
                        color="default"
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </Tooltip>
                    <label className="form-text">
                      <FormattedMessage id="Chart" />
                    </label>
                  </Box>
                )}
              </Grid>

              <Grid item xs={4}>
                <label className="form-text">
                  <FormattedMessage id="Type" />
                </label>
                <MyTextField
                  name="type"
                  variant="outlined"
                  select
                  className={classes.myTextFieldRoot}
                >
                  <MenuItem value={TypeQuestion.TEXT_INPUT}>
                    <FormattedMessage id="Text" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.NUMBER}>
                    <FormattedMessage id="Number" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.TEXT_AREA}>
                    <FormattedMessage id="TextArea" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.SELECT}>
                    <FormattedMessage id="Select" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.CHECK}>
                    <FormattedMessage id="Checkbox" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.RADIO}>
                    <FormattedMessage id="Radius" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.DEPARTMENT}>
                    <FormattedMessage id="Department" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.TOWN}>
                    <FormattedMessage id="Town" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.FILE}>
                    <FormattedMessage id="Attachment" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.GEOLOCATION}>
                    <FormattedMessage id="Geolocation" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.PICTURE}>
                    <FormattedMessage id="Image" />
                  </MenuItem>
                  <MenuItem value={TypeQuestion.DATE}>
                    <FormattedMessage id="Date" />
                  </MenuItem>
                </MyTextField>
              </Grid>

              {(values.type === TypeQuestion.SELECT ||
                values.type === TypeQuestion.CHECK ||
                values.type === TypeQuestion.RADIO) && (
                <>
                  <Grid item xs={12}>
                    <Box mb={-1}>
                      <label
                        className="form-text"
                        style={{ color: "#F04F47", fontSize: 12 }}
                      >
                        <FormattedMessage id="MessageFour" />
                      </label>
                    </Box>
                  </Grid>

                  <Grid item xs={4}>
                    <label className="form-text">
                      <FormattedMessage id="AddOptions" />
                    </label>
                    <MyTextField
                      name="label"
                      variant="outlined"
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
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                      <label className="form-text">
                        <FormattedMessage id="Description" />
                      </label>
                    </Box>
                  </Grid>

                  <Grid item xs={4}>
                    <label className="form-text">
                      <FormattedMessage id="TypeDescription" />
                    </label>
                    <MyTextField
                      name="typeDescription"
                      variant="outlined"
                      select
                      className={classes.myTextFieldRoot}
                    >
                      <MenuItem value={TypeQuestion.TEXT_INPUT}>
                        <FormattedMessage id="Text" />
                      </MenuItem>
                      <MenuItem value={TypeQuestion.NUMBER}>
                        <FormattedMessage id="Number" />
                      </MenuItem>
                      <MenuItem value={TypeQuestion.TEXT_AREA}>
                        <FormattedMessage id="TextArea" />
                      </MenuItem>
                    </MyTextField>
                  </Grid>

                  <Grid item xs={5}>
                    <label className="form-text">
                      <FormattedMessage id="DescriptionName" />
                    </label>
                    <MyTextField
                      name="textDescription"
                      variant="outlined"
                      className={classes.myTextFieldRoot}
                      disabled={values.description === false}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Button
                      size="medium"
                      style={{
                        color: "#fff",
                        height: "40px",
                        width: "100%",
                        marginTop: "25px",
                        textTransform: "capitalize",
                      }}
                      className={classes.save}
                      onClick={() => addOptions(values)}
                    >
                      <FormattedMessage id="AddOption" />
                    </Button>
                  </Grid>
                  <Grid item xs={3}></Grid>
                  {state === true && (
                    <Grid item xs={12}>
                      <Alert severity="error" color="error">
                        <FormattedMessage id="ValidOption" />
                      </Alert>
                    </Grid>
                  )}
                  {options &&
                    options.length > 0 &&
                    options.map((option, index) => {
                      return (
                        <Grid
                          container
                          key={index}
                          style={{ marginTop: "10px" }}
                        >
                          <Grid item xs={3}>
                            <Checkbox
                              color="default"
                              disabled
                              inputProps={{ "aria-label": "primary checkbox" }}
                            />
                            <label className="form-text">{option.label}</label>
                          </Grid>
                          <Grid item xs={5}>
                            <Box style={{ marginTop: "10px" }}>
                              {option.textDescription}
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            {option.description && (
                              <MyTextField
                                name="option"
                                variant="outlined"
                                disabled
                                type="number"
                              />
                            )}
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip
                              title={`${intl.formatMessage({ id: "Delete" })}`}
                            >
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                style={{ marginLeft: "5px" }}
                                onClick={() => deleteOption(option)}
                              >
                                {" "}
                                <DeleteOutlineOutlinedIcon />{" "}
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      );
                    })}
                </>
              )}
            </Grid>

            <Box mt={3} display="flex" flexDirection="row-reverse">
              {!isSubmitting ? (
                <Button
                  className={clsx(classes.btn, classes.save)}
                  autoFocus
                  type="submit"
                  disabled={isSubmitting}
                >
                  <FormattedMessage id="Save" />
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
              <Button
                className={clsx(classes.btn, classes.cancel)}
                onClick={onClose}
              >
                <FormattedMessage id="Cancel" />
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <MyAlert
        open={successAlert}
        typeAlert="success"
        message={"QuestionAddSuccess"}
        time={1000}
        handleClose={closeSuccess}
      />
    </Box>
  );
};
