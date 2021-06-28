import { useRef } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";

import { Box, CircularProgress, Link } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ICitizen } from "../../../interfaces/Citizens";
import { Survey } from "../../../interfaces/Survey";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";
import { PDFSurveys } from "./PDFSurveys";

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
  const citizen: ICitizen = activeCitizen;

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
                trigger={() => (
                  <Link className={classes.typography} component="button">
                    {index + 1}. {survey.name}
                  </Link>
                )}
                content={() => componentRef.current}
                documentTitle={`${survey.name}_${activeCitizen.identificacion}`}
                pageStyle="@page { size: auto; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; padding: 30px !important; } }"
              />

              <div style={{ display: "none" }}>
              <div ref={componentRef}>
                <PDFSurveys data={survey} />
              </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        citizen && (
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
