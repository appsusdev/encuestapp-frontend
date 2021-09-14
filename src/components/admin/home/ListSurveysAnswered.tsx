import React, { useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";

import { Box, CircularProgress, Link } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ICitizen } from "../../../interfaces/Citizens";
import { Survey, Chapter } from "../../../interfaces/Survey";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";
import { PDFSurveys } from "./PDFSurveys";
import { getCopyArrayOrObject } from "../../../helpers/getCopyArrayOrObject";
import { Surveyor } from "../../../interfaces/Surveyor";

const pageStyle = `
@media all {
  .page-break {
     display: none;
  }
}

@media print {
  .page-break {
      display: block;
      page-break-before: auto;
    }
}
@media print {
  html, body {
    height: initial !important;
    overflow: initial !important;
    -webkit-print-color-adjust: exact;
  };
}

@page {
  size: auto;
  margin: 5vw;
  padding:30vw
}
`;

export const ListSurveysAnswered = () => {
  const classes = useStyles();
  const componentRef = useRef<HTMLDivElement>(null);

  const { surveysAnswered, activeCitizen } = useSelector<
    AppState,
    AppState["citizens"]
  >((state) => state.citizens);
  const { surveyors } = useSelector<AppState, AppState["surveyor"]>(
    (state) => state.surveyor
  );
  const { loading } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const [newList, setNewList] = useState<Chapter[]>([]);
  const [dataSurvey, setDataSurvey] = useState({
    title: "",
    codeSurvey: "",
    dateSurvey: "",
    authorizationFormat: "",
    nameSurveyor: "",
  });
  const citizen: ICitizen = activeCitizen;
  const answered: Survey[] = getCopyArrayOrObject(surveysAnswered);
  const listSurveyors: Surveyor[] = surveyors;

  const getData = (idSurvey: string | undefined) => {
    const listFilter = answered.filter(
      (survey) => survey.idSurvey === idSurvey
    );

    const emailSurveyor = listFilter[0].surveyors[0];
    const infoSurveyor = listSurveyors.filter(
      (surveyor) => surveyor.email === emailSurveyor
    );
    const nameSurveyor = infoSurveyor[0].username;

    setDataSurvey({
      ...dataSurvey,
      title: listFilter[0].name,
      codeSurvey: listFilter[0].code,
      dateSurvey: listFilter[0].creationDate,
      authorizationFormat: listFilter[0].authorizationFormats,
      nameSurveyor,
    });

    const filter = listFilter[0].chapters.map((chapter) => {
      chapter.questions.map((question) => {
        question.answers = question.answers?.filter(
          (answer) => answer.citizen === activeCitizen.identificacion
        );
        return question;
      });
      return chapter;
    });
    setNewList(filter);
  };

  return (
    <Box m={2} >
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
            <div key={index}>
              <ReactToPrint
                // bodyClass={ }

                onBeforeGetContent={async () => await getData(survey.idSurvey)}
                trigger={() => (
                  <Link className={classes.typography} component="button">
                    {index + 1}. {survey.name}
                  </Link>
                )}
                //pageStyle={{margin: 120px 50px 80px 50px;}}
                content={() => componentRef.current}
                documentTitle={`${survey.name}_${activeCitizen.identificacion}`}
                pageStyle={pageStyle}
              />

              <div style={{ display: "none" }}>
                <div ref={componentRef}>
                  <PDFSurveys
                    data={newList}
                    title={dataSurvey.title}
                    surveyCode={dataSurvey.codeSurvey}
                    dateSurvey={dataSurvey.dateSurvey}
                    authorizationFormat={dataSurvey.authorizationFormat}
                    nameSurveyor={dataSurvey.nameSurveyor}
                  />
                </div>
              </div>
            </div>
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
