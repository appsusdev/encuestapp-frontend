import clsx from "clsx";
import { Formik, Form } from "formik";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
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
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { MyTextField } from "../../custom/MyTextField";
import { Survey } from "../../../interfaces/Survey";
import { Surveyor } from "../../../interfaces/Surveyor";
import { useStyles } from "../../../shared/styles/useStyles";
import {
  startLoadingMicrodata,
  setTransmittedSurveys,
  setInfoTransmittedSurveys,
} from "../../../redux/actions/surveyorsActions";
import {
  startLoading,
  finishLoading,
  uiCloseModalAssign,
} from "../../../redux/actions/uiActions";
import { AppState } from "../../../redux/reducers/rootReducer";
import { DownloadData } from "./DownloadData";

interface Props {
  transmitted: Survey[];
}

export const Microdata = (props: Props) => {
  const { transmitted } = props;
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiCloseModalAssign());
    // eslint-disable-next-line
  }, []);

  const { surveys } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const { surveyors, idResponsibleCitizens } = useSelector<
    AppState,
    AppState["surveyor"]
  >((state) => state.surveyor);
  const { loading } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const surveysList: any[] = surveys;
  const idCitizens: string[] = idResponsibleCitizens;
  const listSurveyors: Partial<Surveyor>[] = surveyors;
  const [surveySelected, setSurveySelected] = useState("");
  const [surveyorSelected, setSurveyorSelected] = useState("");
  const [, setSurveyorsEmail] = useState<string[]>([]);
  const [surveyorsName, setSurveyorsName] = useState<any[]>([]);
  const [errorSurvey, setErrorSurvey] = useState(false);
  const [errorSurveyor, setErrorSurveyor] = useState(false);
  const [valid, setValid] = useState({ survey: false, surveyor: false });
  const [show, setShow] = useState(false);

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
    const surveryFilter = surveysList.filter((survey) => survey.code === value);
    setSurveyorsEmail(surveryFilter[0].surveyors);

    let names: any[] = [];
    listSurveyors.filter((surveyor) => {
      if (surveyor.id && surveryFilter[0].surveyors.includes(surveyor.id)) {
        surveyor.firstName &&
          surveyor.firstLastName &&
          names.push({
            name: `${surveyor.username}`,
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
                      {surveysList.map((survey, index) => (
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
              //Aqui va
              <DownloadData
                transmitted={transmitted}
                surveyor={surveyorSelected}
                idCitizens={idCitizens}
              />
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
