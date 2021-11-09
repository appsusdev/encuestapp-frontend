import React, { useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import { Box, CircularProgress, Link } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ICitizen } from "../../../interfaces/Citizens";
import { Survey, Chapter } from "../../../interfaces/Survey";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";
import { Surveyor } from "../../../interfaces/Surveyor";
import { CustomizedDialogPDF } from "../../custom/CustomizedDialogPDF";
import {
  uiOpenModalAssign,
  uiCloseModalAssign,
} from "../../../redux/actions/uiActions";
import { PDFSurveys } from "./PDFSurveys";
import { downloadPDF } from "../../../helpers/downloadPDF";
interface Props {
  answered: Survey[];
}
export const ListSurveysAnswered = (props: Props) => {
  const { answered } = props;
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();
  const componentRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const { surveysAnswered, activeCitizen } = useSelector<
    AppState,
    AppState["citizens"]
  >((state) => state.citizens);
  const { surveyors, infoSurveysTransmitted } = useSelector<
    AppState,
    AppState["surveyor"]
  >((state) => state.surveyor);
  const { loading, modalAssignOpen } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const [newList, setNewList] = useState<Chapter[]>([]);
  const [dataSurvey, setDataSurvey] = useState({
    title: "",
    codeSurvey: "",
    dateSurvey: "",
    authorizationFormat: "",
    nameSurveyor: "",
    surveyeds: [],
  });
  const [startDownload, setStartDownload] = useState(false);
  const citizen: ICitizen = activeCitizen;
  const listSurveyors: Surveyor[] = surveyors;
  const infoTransmitted: any[] = infoSurveysTransmitted;

  const getData = (idSurvey: string | undefined) => {
    const listFilter = answered.filter(
      (survey) => survey.idSurvey === idSurvey
    );

    // Obtener info del encuestador
    const emailSurveyor = listFilter[0].surveyors[0];
    const infoSurveyor = listSurveyors.filter(
      (surveyor) => surveyor.email === emailSurveyor
    );
    const nameSurveyor = infoSurveyor[0].username;

    // Se obtiene la información correspondiente a la encuesta seleccionada para obtener los encuestados
    const infoFilter = infoTransmitted.filter(
      (info) => info.id === listFilter[0].code
    );
    const surveyeds = infoFilter[0].encuestados;

    setDataSurvey({
      ...dataSurvey,
      title: listFilter[0].name,
      codeSurvey: listFilter[0].code,
      dateSurvey: listFilter[0].creationDate,
      authorizationFormat: listFilter[0].authorizationFormats,
      nameSurveyor,
      surveyeds: surveyeds,
    });

    const filter = listFilter[0].chapters.map((chapter) => {
      chapter.questions.map((question) => {
        question.answers = question.answers?.filter(
          (answer) => answer.idEncuestaCiudadano === listFilter[0].code
        );
        return question;
      });
      return chapter;
    });
    setNewList(filter);
    dispatch(uiOpenModalAssign());
  };

  const onDeny = () => {
    dispatch(uiCloseModalAssign());
  };

  const onDownload = async () => {
    setStartDownload(true);
    await downloadPDF(
      componentRef,
      `${intl.formatMessage({ id: "Survey" })}${dataSurvey.codeSurvey}`
    );

    setStartDownload(false);
  };

  return (
    <Box m={2}>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress className={classes.colorLoading} />
        </Box>
      ) : surveysAnswered.length > 0 && citizen ? (
        <>
          <Box mb={1}>
            <FormattedMessage id="TheCitizen" /> {citizen.primerNombre}{" "}
            {citizen.primerApellido}{" "}
            <FormattedMessage id="SurveysConductedMessage" />
          </Box>

          {surveysAnswered.map((survey: Partial<Survey>, index: number) => (
            <React.Fragment>
              <Link
                key={index}
                className={classes.typography}
                component="button"
                onClick={() => getData(survey.idSurvey)}
              >
                {index + 1}. {survey.name}
              </Link>

              <CustomizedDialogPDF
                open={modalAssignOpen}
                onConfirm={onDownload}
                onDeny={onDeny}
                title={dataSurvey.title}
                titlePDF={`${intl.formatMessage({ id: "Survey" })}${
                  dataSurvey.codeSurvey
                }`}
                content={
                  <div ref={componentRef}>
                    <PDFSurveys
                      data={newList}
                      title={dataSurvey.title}
                      surveyCode={dataSurvey.codeSurvey}
                      dateSurvey={dataSurvey.dateSurvey}
                      authorizationFormat={dataSurvey.authorizationFormat}
                      nameSurveyor={dataSurvey.nameSurveyor}
                      idSurveyeds={dataSurvey.surveyeds}
                    />
                  </div>
                }
                loading={startDownload}
                textButton="Download"
              />
            </React.Fragment>
          ))}
        </>
      ) : (
        citizen &&
        !loading && (
          <Alert severity="info" color="info">
            <FormattedMessage id="TheCitizen" /> {citizen.primerNombre}{" "}
            {citizen.primerApellido}{" "}
            <FormattedMessage id="NotSurveysConductedMessage" />
          </Alert>
        )
      )}
    </Box>
  );
};
