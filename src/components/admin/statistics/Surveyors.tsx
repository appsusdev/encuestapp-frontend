import clsx from "clsx";
import { Formik, Form } from "formik";
import React, { useEffect, useState, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import {
  Divider,
  Grid,
  Paper,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Link,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { MyTextField } from "../../custom/MyTextField";
import { convertDate } from "../../../helpers/convertDate";
import { getCopyArrayOrObject } from "../../../helpers/getCopyArrayOrObject";
import { Surveyor } from "../../../interfaces/Surveyor";
import { Survey, Chapter } from "../../../interfaces/Survey";
import { startLoadingMicrodata } from "../../../redux/actions/surveyorsActions";
import {
  startLoading,
  finishLoading,
  uiCloseModalAssign,
  uiOpenModalAssign,
} from "../../../redux/actions/uiActions";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";
import { PDFSurveyors } from "./PDFSurveyors";
import { CustomizedDialogPDF } from "../../custom/CustomizedDialogPDF";
interface Props {
  transmitted: Survey[];
}

export const Surveyors = (props: Props) => {
  const { transmitted } = props;
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();
  const componentRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    dispatch(uiCloseModalAssign());
    // eslint-disable-next-line
  }, []);
  const { surveys } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const { surveyors, infoSurveysTransmitted } = useSelector<
    AppState,
    AppState["surveyor"]
  >((state) => state.surveyor);
  const { loading, modalAssignOpen } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const { citizens } = useSelector<AppState, AppState["citizens"]>(
    (state) => state.citizens
  );
  const [surveyorSelected, setSurveyorSelected] = useState("");
  const [surveySelected, setSurveySelected] = useState("");
  const [surveysAssign, setSurveysAssign] = useState<Survey[]>([]);
  const [errorSurveyor, setErrorSurveyor] = useState(false);
  const [errorSurvey, setErrorSurvey] = useState(false);
  const [valid, setValid] = useState({ survey: false, surveyor: false });
  const [dataSurvey, setDataSurvey] = useState({
    surveyeds: [],
    codeSurvey: "",
    dateSurvey: "",
    surveyor: "",
    responsibleCitizen: "",
    authorizationFormat: "",
  });
  const [show, setShow] = useState(false);
  const [newList, setNewList] = useState<Chapter[]>([]);
  const infoTransmitted: any[] = infoSurveysTransmitted;
  const surveyorsList: Surveyor[] = surveyors;

  let list: Survey[] = surveys;

  
  useEffect(() => {
    setSurveysAssign(
      list.filter((survey: Survey) =>
        survey.surveyors.includes(surveyorSelected)
      )
    );
  }, [surveyorSelected, list]);

  useEffect(() => {
    setShow(false);
  }, []);

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

  const handleSelect = (value: string, flag: boolean) => {
    setShow(false);

    if (flag) {
      setErrorSurvey(value === "");
      setSurveySelected(value);
      setValid({ ...valid, survey: true });
    } else {
      setErrorSurveyor(value === "");
      setSurveyorSelected(value);
      setValid({ ...valid, surveyor: true });
    }
  };

  let newData: any[] = [];

  if (infoTransmitted.length > 0 && transmitted.length > 0) {
    infoTransmitted.forEach((infoSurvey) => {
      const date = convertDate(
        new Date(infoSurvey.fechaDeCarga.seconds * 1000).toLocaleDateString(
          "en-CA"
        )
      );
      const getSurvey = transmitted.filter(
        (survey) => survey.idSurvey === infoSurvey.idEncuesta
      );
      const name = getSurvey[0].name ? getSurvey[0].name : "";
      newData.push({
        date: date,
        surveyCode: infoSurvey.id,
        name: name,
      });
    });
  }

  //  **************************************************************************************** //
  // ------------- FUNCIÓON PARA OBTENER INFRORMACIÓN DE CADA ENCUESTA TRANSMITIDA ----------- //
  //  **************************************************************************************** //

  const getData = async (surveyCode: string) => {
    // Se obtiene la información correspondiente a la encuesta seleccionada
    const infoFilter = infoTransmitted.filter((info) => info.id === surveyCode);

    // Obtener la fecha en que se transmitió la encuesta
    const date = convertDate(
      new Date(infoFilter[0].fechaDeCarga.seconds * 1000).toLocaleDateString(
        "en-CA"
      )
    );

    // Obtener el nombre del encuestador
    const surveyorInfo = surveyorsList.filter(
      (surveyor) => surveyor.email === surveyorSelected
    );
    const usernameSurveyor = surveyorInfo[0].username;

    // Obtener el nombre del ciudadano responsable de la encuesta
    const idResponsibleCitizen = citizens.filter(
      (citizen) =>
        citizen.identificacion === infoFilter[0].idCiudadanoResponsable
    );
    let nameResponsableCitizen = "";
    idResponsibleCitizen[0] &&
      (nameResponsableCitizen = `${idResponsibleCitizen[0].primerNombre.toLowerCase()} ${idResponsibleCitizen[0].segundoNombre.toLowerCase()} ${idResponsibleCitizen[0].primerApellido.toLowerCase()} ${idResponsibleCitizen[0].segundoApellido.toLowerCase()}`);

    // Se setean los datos (info de cada encuesta)
    setDataSurvey({
      ...dataSurvey,
      surveyeds: infoFilter[0].encuestados,
      codeSurvey: infoFilter[0].id,
      dateSurvey: date,
      surveyor: usernameSurveyor,
      responsibleCitizen: nameResponsableCitizen,
      authorizationFormat: infoFilter[0].formatoAutorizacion,
    });

    // Filtro para obtener las respuestas correspondientes a la encuesta seleccionada
    const list: Chapter[] = getCopyArrayOrObject(transmitted[0].chapters);

    const filter = list?.map((chapter) => {
      chapter.questions.map((question) => {
        question.answers = question.answers?.filter(
          (answer) =>
            answer.idEncuestaCiudadano === surveyCode &&
            answer.idEncuestador === surveyorSelected
        );
        return question;
      });
      return chapter;
    });
    setNewList(filter);
    dispatch(uiOpenModalAssign());
    console.log(typeof componentRef.current);
  };
  const onDeny = () => {
    dispatch(uiCloseModalAssign());
  };

  const onDownloadDocument = async () => {
   
    await html2canvas(componentRef.current,{allowTaint:false,useCORS:true,proxy:"/"}).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      const doc = new jsPDF("p", "mm");
      let position = 0;

      doc.addImage(imgData, "jpeg", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "jpeg", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
     
      doc.save("file.pdf");
    });
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
              setErrorSurveyor(surveyorSelected === "");
              setErrorSurvey(surveySelected === "");
              if (valid.survey && valid.surveyor) {
                setShow(true);
                dispatch(startLoading());
                data.surveyor = surveyorSelected;
                data.survey = surveySelected;
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
                      <FormattedMessage id="SelectSurveyor" />:
                    </label>
                    <TextField
                      className={classes.myTextFieldRoot}
                      helperText={
                        errorSurveyor &&
                        `*${intl.formatMessage({ id: "RequiredFile" })}`
                      }
                      InputLabelProps={{ shrink: false }}
                      name="surveyor"
                      onChange={(event) =>
                        handleSelect(event.target.value, false)
                      }
                      select
                      value={surveyorSelected}
                      variant="outlined"
                      size="small"
                      error={errorSurveyor}
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                    >
                      {surveyorsList.map((surveyor, index) => (
                        <MenuItem key={index} value={surveyor.id}>
                          {surveyor.username}
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
                      <FormattedMessage id="Survey" />:
                    </label>
                    <TextField
                      className={classes.myTextFieldRoot}
                      helperText={
                        errorSurvey &&
                        `*${intl.formatMessage({ id: "RequiredFile" })}`
                      }
                      InputLabelProps={{ shrink: false }}
                      name="survey"
                      select
                      size="small"
                      value={surveySelected}
                      variant="outlined"
                      onChange={(event) =>
                        handleSelect(event.target.value, true)
                      }
                      error={errorSurvey}
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                    >
                      {surveysAssign.map((survey, index) => (
                        <MenuItem key={index} value={survey.idSurvey}>
                          {survey.name}
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

        <Box m={2} ml={4}>
          {show &&
            (loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress className={classes.colorLoading} />
              </Box>
            ) : transmitted.length > 0 && !loading ? (
              <Grid container spacing={1}>
                {newData.map((survey, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={4}>
                      <Link
                        component="button"
                        onClick={() => getData(survey.surveyCode)}
                      >
                        {survey.name} ({survey.surveyCode})
                      </Link>
                    </Grid>

                    <Grid item xs={8}>
                      {survey.date}
                    </Grid>

                    <CustomizedDialogPDF
                      open={modalAssignOpen}
                      onConfirm={onDownloadDocument}
                      onDeny={onDeny}
                      title={transmitted[0].name}
                      content={
                        <div ref={componentRef}>
                          <PDFSurveyors
                            data={newList}
                            title={transmitted[0].name}
                            surveyCode={dataSurvey.codeSurvey}
                            idSurveyeds={dataSurvey.surveyeds}
                            dateSurvey={dataSurvey.dateSurvey}
                            nameSurveyor={dataSurvey.surveyor}
                            responsibleCitizen={dataSurvey.responsibleCitizen}
                            authorizationFormat={dataSurvey.authorizationFormat}
                          />
                        </div>
                      }
                      textButton="Download"
                    />
                  </React.Fragment>
                ))}
              </Grid>
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
