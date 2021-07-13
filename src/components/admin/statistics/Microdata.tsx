import clsx from "clsx";
import { Formik, Form } from "formik";
import { useEffect, useState, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import * as yup from "yup";

import {
  TextField,
  Divider,
  Grid,
  Paper,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Link,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { MyTextField } from "../../custom/MyTextField";
import { getCopyArrayOrObject } from "../../../helpers/getCopyArrayOrObject";
import { Chapter, ISurveyAnswers, Survey } from "../../../interfaces/Survey";
import { Surveyor } from "../../../interfaces/Surveyor";
import { useStyles } from "../../../shared/styles/useStyles";
import {
  startLoadingMicrodata,
  setTransmittedSurveys,
  setInfoTransmittedSurveys,
} from "../../../redux/actions/surveyorsActions";
import { startLoading, finishLoading } from "../../../redux/actions/uiActions";
import { AppState } from "../../../redux/reducers/rootReducer";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Poppins",
    fontSize: 14,
  },
});

export const Microdata = () => {
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();
  const componentRef = useRef<HTMLDivElement>(null);
  const { dataSurveys } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const { surveyors, surveysTransmitted, idResponsibleCitizens } = useSelector<
    AppState,
    AppState["surveyor"]
  >((state) => state.surveyor);
  const { loading } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const surveys: any[] = dataSurveys;
  const idCitizens: string[] = idResponsibleCitizens;
  const listSurveyors: Partial<Surveyor>[] = surveyors;
  const [surveySelected, setSurveySelected] = useState("");
  const [surveyorSelected, setSurveyorSelected] = useState("");
  const [, setSurveyorsEmail] = useState<string[]>([]);
  const [surveyorsName, setSurveyorsName] = useState<any[]>([]);
  const [errorSurvey, setErrorSurvey] = useState(false);
  const [errorSurveyor, setErrorSurveyor] = useState(false);
  const [valid, setValid] = useState({ survey: false, surveyor: false });
  const transmitted: Partial<Survey>[] =
    getCopyArrayOrObject(surveysTransmitted);
  const [show, setShow] = useState(false);
  let arrayQuestionsInd: any[] = [];
  let arrayQuestionsHome: any[] = [];
  let questions: any[] = [];

  if (transmitted.length > 0 && transmitted[0].chapters) {
    transmitted[0].chapters.forEach((chapter: Partial<Chapter>) => {
      chapter.questions?.forEach((question) => {
        surveyorSelected !== "Todos" &&
          (question.answers = question.answers.filter(
            (answer: Partial<ISurveyAnswers>) =>
              answer.idEncuestador === surveyorSelected &&
              (answer.idEncuestaCiudadano &&
              idCitizens.includes(answer.idEncuestaCiudadano))
          ));

        if (question.directedTo === "PreguntasIndividual") {
          arrayQuestionsInd.push(question);
        } else {
          arrayQuestionsHome.push(question);
        }
        return question;
      });
    });
    arrayQuestionsHome.forEach((question, index) =>
      questions.push({
        question: `PreguntaHog${index + 1}`,
        answer: question.question,
      })
    );
    arrayQuestionsInd.forEach((question, index) =>
      questions.push({
        question: `PreguntaInd${index + 1}`,
        answer: question.question,
      })
    );
  }

  // const headers: any[] = [
  //   {label: "Pregunta", key: "pregunta"},
  //   {label: "Encuesta", key: "encuesta"},
  //   {label: "ID ciudadano responsable", key: "idEncuestaCiudadano"},
  //   {label: "ID ciudadano encuestado", key: "idCiudadano"}
  // ];
  const homeData: any[] = [];
  arrayQuestionsHome.forEach((question, index) => {
    // headers.push({label: `PreguntaHog${index+1}`, key: "answer"})
    question.answers.forEach((answer: ISurveyAnswers) => {
      homeData.push({
        Codigo_encuesta: transmitted[0].idSurvey,
        Codigo_pregunta: `PreguntaHog${index + 1}`,
        ID_ciudadano_responsable: answer.idEncuestaCiudadano,
        ID_ciudadano_encuestado: answer.citizen,
        Respuesta: answer.respuesta.value,
      });
    });
  });

  const indData: any[] = [];
  arrayQuestionsInd.forEach((question, index) => {
    // headers.push({label: `PreguntaHog${index+1}`, key: "answer"})
    question.answers.forEach((answer: ISurveyAnswers) => {
      indData.push({
        Codigo_encuesta: transmitted[0].idSurvey,
        Codigo_pregunta: `PreguntaInd${index + 1}`,
        ID_ciudadano_responsable: answer.idEncuestaCiudadano,
        ID_ciudadano_encuestado: answer.citizen,
        Respuesta: answer.respuesta.value,
      });
    });
  });

  useEffect(() => {
    setShow(false);
  }, []);

  useEffect(() => {
    dispatch(setTransmittedSurveys([]));
    dispatch(setInfoTransmittedSurveys([]));
  }, [dispatch]);

  const validationSchema = yup.object({
    survey: yup.string(),
    startDate: yup
      .date()
      .required()
      .max(
        yup.ref("endDate"),
        `${intl.formatMessage({ id: "GreaterStartDate" })}`
      ),
    endDate: yup
      .date()
      .min(
        yup.ref("startDate"),
        `${intl.formatMessage({ id: "LowerEndDate" })}`
      )
      .max(new Date(), `${intl.formatMessage({ id: "GreaterCurrentDate" })}`)
      .required(),
    surveyor: yup.string(),
  });

  let initialValues: any = {
    survey: "",
    startDate: new Date().toLocaleDateString("en-CA"),
    endDate: new Date().toLocaleDateString("en-CA"),
    surveyor: "",
  };

  const handleSelectSurvey = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setTransmittedSurveys([]));
    dispatch(setInfoTransmittedSurveys([]));
    const value: string = event.target.value as string;
    setSurveySelected(value);
    setShow(false);
    setErrorSurvey(value === "");

    setValid({ ...valid, survey: true });
    const surveryFilter = surveys.filter((survey) => survey.code === value);
    setSurveyorsEmail(surveryFilter[0].surveyors);

    let names: any[] = [];
    listSurveyors.filter((surveyor) => {
      if (surveyor.id && surveryFilter[0].surveyors.includes(surveyor.id)) {
        surveyor.firstName &&
          surveyor.firstLastName &&
          names.push({
            name: `${surveyor.firstName} ${surveyor.firstLastName}`,
            email: surveyor.id,
          });
      }
      return names;
    });
    setSurveyorsName(names);
  };

  const handleSelectSurveyor = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value: string = event.target.value as string;
    dispatch(setTransmittedSurveys([]));
    dispatch(setInfoTransmittedSurveys([]));
    setErrorSurveyor(value === "");
    setSurveyorSelected(value);
    setShow(false);
    setValid({ ...valid, surveyor: true });
  };

  return (
    <>
      <Divider variant="fullWidth" />
      <Paper square className={classes.paper}>
        <Box m={2} mt={1} mb={3}>
          <Formik
            validateOnChange={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (data, { setSubmitting }) => {
              setErrorSurvey(surveySelected === "");
              setErrorSurveyor(surveyorSelected === "");
              if (valid.survey && valid.surveyor) {
                setShow(true);
                dispatch(startLoading());
                data.survey = surveySelected;
                data.surveyor = surveyorSelected;
                setSubmitting(true);
                await dispatch(startLoadingMicrodata(data));
                setSubmitting(false);
                dispatch(finishLoading());
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className={classes.input}>
                <Grid container spacing={2}>
                  <Grid item xs={12} style={{ marginTop: "10px" }}>
                    <label className="form-text">
                      <FormattedMessage id="SelectSurvey" />
                    </label>
                    <TextField
                      className={classes.myTextFieldRoot}
                      helperText={
                        errorSurvey &&
                        `*${intl.formatMessage({ id: "RequiredFile" })}`
                      }
                      InputLabelProps={{ shrink: false }}
                      name="survey"
                      onChange={handleSelectSurvey}
                      select
                      size="small"
                      value={surveySelected}
                      variant="outlined"
                      error={errorSurvey}
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                    >
                      {surveys.map((survey, index) => (
                        <MenuItem key={index} value={survey.code}>
                          {survey.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={3}>
                    <label className="form-text">
                      <FormattedMessage id="StartDate" />:
                    </label>
                    <MyTextField
                      name="startDate"
                      variant="outlined"
                      type="date"
                      className={classes.myTextFieldRoot}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <label className="form-text">
                      <FormattedMessage id="EndDate" />:
                    </label>
                    <MyTextField
                      name="endDate"
                      variant="outlined"
                      type="date"
                      className={classes.myTextFieldRoot}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <label className="form-text">
                      <FormattedMessage id="Surveyor" />:
                    </label>
                    <TextField
                      className={classes.myTextFieldRoot}
                      helperText={
                        errorSurveyor &&
                        `*${intl.formatMessage({ id: "RequiredFile" })}`
                      }
                      InputLabelProps={{ shrink: false }}
                      name="surveyor"
                      onChange={handleSelectSurveyor}
                      select
                      size="small"
                      value={surveyorSelected}
                      variant="outlined"
                      error={errorSurveyor}
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                    >
                      {valid.survey && <MenuItem value="Todos">Todos</MenuItem>}
                      {surveyorsName &&
                        surveyorsName.map((surveyor, index) => (
                          <MenuItem key={index} value={surveyor.email}>
                            {surveyor.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={2}>
                    {!isSubmitting ? (
                      <Button
                        className={clsx(classes.btnAction, classes.save)}
                        autoFocus
                        type="submit"
                        disabled={isSubmitting}
                        style={{ marginTop: "27px" }}
                      >
                        <FormattedMessage id="Search" />
                      </Button>
                    ) : (
                      <Button
                        className={clsx(classes.btnAction, classes.save)}
                        autoFocus
                        type="button"
                        disabled={true}
                        style={{ marginTop: "27px" }}
                      >
                        <CircularProgress className={classes.btnLoading} />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>

        <Box m={2}>
          {show &&
            (loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress className={classes.colorLoading} />
              </Box>
            ) : transmitted.length > 0 && !loading ? (
              <Box
                m={2}
                ml={6}
                mr={6}
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <CSVLink
                  data={homeData}
                  separator={";"}
                  filename={`Microdatos_hogar_${transmitted[0].idSurvey}.csv`}
                >
                  <Link component="button">
                    Encuesta{transmitted[0].idSurvey}_microdatos_hogar
                  </Link>
                </CSVLink>
                <CSVLink
                  data={indData}
                  separator={";"}
                  filename={`Microdatos_personas_${transmitted[0].idSurvey}.csv`}
                >
                  <Link component="button">
                    Encuesta{transmitted[0].idSurvey}_microdatos_personas
                  </Link>
                </CSVLink>

                <ReactToPrint
                  trigger={() => (
                    <Link className={classes.typography} component="button">
                      <FormattedMessage id="DictionaryQuestions" />
                    </Link>
                  )}
                  content={() => componentRef.current}
                  documentTitle={`Diccionario_encuesta_${transmitted[0].idSurvey}`}
                  pageStyle="@page { size: auto; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; padding: 50px !important; } }"
                />

                <div style={{ display: "none" }}>
                  <div ref={componentRef}>
                    <Box
                      mb={4}
                      display="flex"
                      justifyContent="center"
                      className={classes.titlePDF}
                    >
                      <FormattedMessage id="DictionaryQuestions" />
                    </Box>

                    <Box mb={4} display="flex">
                      <FormattedMessage id="MessagePDF" />
                      &nbsp;({transmitted[0].name})
                    </Box>
                    <ThemeProvider theme={theme}>
                      <TableContainer component={Paper}>
                        <Table
                          className={classes.table}
                          aria-label="simple table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell width="30%">
                                <FormattedMessage id="QuestionCode" />
                              </TableCell>
                              <TableCell width="70%">
                                <FormattedMessage id="Dictionary" />
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {questions.map((question, index) => (
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{question.question}</TableCell>
                                <TableCell>{question.answer}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </ThemeProvider>
                  </div>
                </div>
              </Box>
            ) : (
              <Box display="flex" justifyContent="center">
                <Alert severity="error" color="error">
                  <FormattedMessage id="NoExistsRecords" />
                </Alert>
              </Box>
            ))}
        </Box>
      </Paper>
    </>
  );
};
