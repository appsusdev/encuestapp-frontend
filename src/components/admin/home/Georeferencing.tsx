import clsx from "clsx";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { MyTextField } from "../../custom/MyTextField";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";
import { startLoading, finishLoading } from "../../../redux/actions/uiActions";

import { Chapter, Survey } from "../../../interfaces/Survey";
import { TypeQuestion } from "../../../enums/enums";
import { useMapbox } from "../../../hooks/useMapbox";
// import { getCopyArrayOrObject } from "../../../helpers/getCopyArrayOrObject";
import { getAnswers } from "../../../services/firebase/surveys";

const initialPoint = {
  lat: 2.495,
  lng: -73.781,
  zoom: 4.32,
};

export const Georeferencing = () => {
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();

  const { mapData } = useSelector<AppState, AppState["citizens"]>(
    (state) => state.citizens
  );
  const { surveys } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const { loading } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const { municipio } = useSelector<AppState, AppState["auth"]>(
    (state) => state.auth
  );
  const { coords, setRef, addMarker, removeMarkers } = useMapbox(
    mapData ? mapData : initialPoint,
    false
  );
  const [show, setShow] = useState(false);
  const [array, setArray] = useState<any[]>([]);
  // const surveysList: any[] = surveys;
  const town: string | undefined = municipio;

  const initialValues = {
    survey: "",
  };

  const validationSchema = yup.object({
    survey: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
  });

  const getData = async (idSurvey: string) => {
    let answersArray: any[] = [];

    // const list = getCopyArrayOrObject(surveysList);
    const newSurveys = surveys.filter(
      (survey: Partial<Survey>) =>
        survey.idSurvey && survey.idSurvey === idSurvey
    );

    if (newSurveys.length > 0) {
      const chapters: Chapter[] = newSurveys[0].chapters;
      if (chapters) {
        chapters.forEach((chapter) => {
          chapter.questions.forEach(async (question) => {
            if (town) {
              const resp = await getAnswers(
                town,
                idSurvey,
                chapter.id,
                question.directedTo,
                question.id
              );
              question.answers = resp;
            }
            if (question.type === TypeQuestion.GEOLOCATION) {
              question.answers.forEach((answer) => {
                answersArray.push({
                  lat: answer.respuesta.value.coords.latitude,
                  lng: answer.respuesta.value.coords.longitude,
                });
              });
            }
            answersArray.length > 0 ? setArray(answersArray) : setArray([]);
          });
        });
        return array;
      }
    }
  };

  useEffect(() => {
    if (array.length > 0) {
      removeMarkers();
      array.forEach((answer) => addMarker(answer));
    } else {
      removeMarkers();
    }
    // eslint-disable-next-line
  }, [array]);

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
              dispatch(startLoading());
              setShow(true);
              setSubmitting(true);
              await getData(data.survey);
              await dispatch(finishLoading());
              setSubmitting(false);
            }}
          >
            {() => (
              <Form className={classes.input}>
                <Grid container spacing={2}>
                  <Grid item xs={9} style={{ marginTop: "10px" }}>
                    <label className="form-text">
                      <FormattedMessage id="SelectSurvey" />
                    </label>
                    <MyTextField
                      className={classes.myTextFieldRoot}
                      InputLabelProps={{ shrink: false }}
                      name="survey"
                      select
                      variant="outlined"
                    >
                      {surveys.map((survey: any, index: number) => (
                        <MenuItem key={index} value={survey.idSurvey}>
                          {survey.name}
                        </MenuItem>
                      ))}
                    </MyTextField>
                  </Grid>

                  <Grid item xs={3}>
                    {!loading ? (
                      <Button
                        className={clsx(classes.btnAction, classes.save)}
                        autoFocus
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: "37px" }}
                      >
                        <FormattedMessage id="Search" />
                      </Button>
                    ) : (
                      <Button
                        className={clsx(classes.btnAction, classes.save)}
                        autoFocus
                        type="button"
                        disabled={true}
                        style={{ marginTop: "37px" }}
                      >
                        <CircularProgress className={classes.btnLoading} />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>

          <Box mt={2}>
            {show && array.length === 0 && !loading && (
              <Alert severity="info" color="info">
                <FormattedMessage id="NoGeolocationAnwers" />
              </Alert>
            )}
          </Box>
          <Box
            mt={1}
            style={{
              height: "40vh",
              width: "40vw",
              position: "relative",
              left: "50%",
              transform: "translate(-50%, 0)",
            }}
          >
            <Box zIndex="tooltip" className={classes.infoMap}>
              Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
            </Box>
            <div ref={setRef} className={classes.mapContainer}></div>
          </Box>
        </Box>
      </Paper>
    </>
  );
};
