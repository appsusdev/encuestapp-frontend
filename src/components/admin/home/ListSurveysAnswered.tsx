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

const pageStyle = `
@media all {
  .page-break {
    display: none;
  }
}
@media print {
  html, body {
    -webkit-print-color-adjust: exact;
  }
}
@page {
  size: auto;
}
`;

export const ListSurveysAnswered = () => {
  const classes = useStyles();
  const componentRef = useRef<HTMLDivElement>(null);

  const { surveysAnswered, activeCitizen } = useSelector<
    AppState,
    AppState["citizens"]
  >((state) => state.citizens);
  const { loading } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const [newList, setNewList] = useState<Chapter[]>([]);
  const citizen: ICitizen = activeCitizen;
  const answered: Survey[] = getCopyArrayOrObject(surveysAnswered);

  const getData = (idSurvey: string | undefined) => {
    const listFilter = answered.filter(
      (survey) => survey.idSurvey === idSurvey
    );

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
            <div key={index}>
              <ReactToPrint
                // bodyClass={ }
                onBeforeGetContent={async () => await getData(survey.idSurvey)}
                trigger={() => (
                  <Link className={classes.typography} component="button">
                    {index + 1}. {survey.name}
                  </Link>
                )}
                content={() => componentRef.current}
                documentTitle={`${survey.name}_${activeCitizen.identificacion}`}
                pageStyle={pageStyle}
              />

              <div style={{ display: "none" }}>
                <div ref={componentRef}>
                  <PDFSurveys data={newList} title={survey.name} format={survey.authorizationFormats} />
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
