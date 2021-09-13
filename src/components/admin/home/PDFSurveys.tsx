import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import {
  Box,
  Card,
  CardMedia,
  Link,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";

import { TypeQuestion } from "../../../enums/enums";
import { Chapter, ISurveyAnswers } from "../../../interfaces/Survey";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";
import { convertDateDash } from "../../../helpers/convertDate";
import logo from "../../../assets/images/logo-encuestapp.png";

interface Props {
  data: Chapter[];
  title: string;
  surveyCode: string;
  dateSurvey: string;
  authorizationFormat: string;
  nameSurveyor: string;
}
export const PDFSurveys = (props: Props) => {
  const {
    data,
    title,
    authorizationFormat,
    surveyCode,
    dateSurvey,
    nameSurveyor,
  } = props;
  const classes = useStyles();

  const { activeCitizen } = useSelector<AppState, AppState["citizens"]>(
    (state) => state.citizens
  );

  const { razonSocial: entityTitle } = useSelector<AppState, AppState["auth"]>(
    (state) => state.auth
  );

  return (
    <Box m={5}>
      <Box display="flex" justifyContent="center" className={classes.titlePDF}>
        {entityTitle}
      </Box>
      <Box display="flex" justifyContent="center" className={classes.titlePDF}>
        {title}
      </Box>
      <Box display="flex" justifyContent="center" className={classes.titlePDF}>
        {surveyCode}
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box mt={3} display="flex" justifyContent="flex-start">
          <div style={{ fontWeight: "bold" }}>
            <FormattedMessage id="CitizenName" />:
          </div>
          &nbsp;
          <div className={classes.capitalize}>
            {activeCitizen.primerNombre.toLowerCase()}{" "}
            {activeCitizen.primerApellido.toLowerCase()}
          </div>
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-start">
          <div style={{ fontWeight: "bold" }}>
            <FormattedMessage id="Identification" />
          </div>
          &nbsp;{activeCitizen.identificacion}
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Box mt={3} display="flex" justifyContent="flex-start">
          <div style={{ fontWeight: "bold" }}>
            <FormattedMessage id="SurveyorName" />:
          </div>
          &nbsp;
          <div className={classes.capitalize}>{nameSurveyor}</div>
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-start">
          <div style={{ fontWeight: "bold" }}>
            <FormattedMessage id="Date" />
          </div>
          &nbsp;
          {dateSurvey}
        </Box>
      </Box>

      {data &&
        data.map((chapter) => (
          <Box key={chapter.id} mt={2}>
            <Typography
              className={clsx(classes.titlePDF, classes.capitalize)}
              variant="h6"
            >
              {chapter.number}. {chapter.name}
            </Typography>

            {chapter.questions.map((question, index) => (
              <Box m={1} mb={1} key={question.id}>
                <Grid container>
                  <Grid item xs={1}>
                    {question.directedTo === "PreguntasIndividual" ? (
                      <PersonIcon
                        fontSize="small"
                        style={{ marginTop: "2px" }}
                      />
                    ) : (
                      <HomeIcon fontSize="small" style={{ marginTop: "2px" }} />
                    )}
                  </Grid>
                  <Grid item xs={11} style={{ marginLeft: "-10px" }}>
                    {chapter.number}.{index + 1} {question.question}
                  </Grid>
                  {question.answers.map(
                    (answer: ISurveyAnswers, index: number) => (
                      <Grid
                        key={index}
                        item
                        xs={
                          question.type === TypeQuestion.TEXT_AREA ||
                          question.type === TypeQuestion.PICTURE ||
                          question.type === TypeQuestion.FILE
                            ? 12
                            : 8
                        }
                      >
                        {(question.type === TypeQuestion.TEXT_INPUT ||
                          question.type === TypeQuestion.NUMBER ||
                          question.type === TypeQuestion.DEPARTMENT ||
                          question.type === TypeQuestion.TOWN) && (
                          <TextField
                            name="input"
                            variant="outlined"
                            className={classes.myTextFieldRoot}
                            size="small"
                            value={answer.respuesta && answer.respuesta.value}
                          />
                        )}
                        {question.type === TypeQuestion.TEXT_AREA && (
                          <TextField
                            name="input"
                            variant="outlined"
                            className={classes.myTextFieldRoot}
                            multiline
                            rows={3}
                            value={answer.respuesta && answer.respuesta.value}
                          />
                        )}
                        {question.type === TypeQuestion.DATE && (
                          <TextField
                            name="date"
                            variant="outlined"
                            className={classes.myTextFieldRoot}
                            type="date"
                            size="small"
                            value={
                              answer.respuesta &&
                              convertDateDash(answer.respuesta.value)
                            }
                          />
                        )}

                        {question.type === TypeQuestion.PICTURE && (
                          <>
                            <Grid container>
                              <Grid item xs={12}>
                                <Card className={classes.cardPDF}>
                                  <CardMedia
                                    className={classes.media}
                                    image={
                                      answer.respuesta && answer.respuesta.value
                                    }
                                    title="Answer"
                                  />
                                </Card>
                                <p className={classes.page}></p>
                              </Grid>
                            </Grid>
                          </>
                        )}
                        {(question.type === TypeQuestion.RADIO ||
                          question.type === TypeQuestion.SELECT) &&
                          question.options &&
                          question.options.map(
                            (option, index) =>
                              option.value === answer.respuesta.value && (
                                <TextField
                                  key={index}
                                  name="input"
                                  variant="outlined"
                                  className={classes.myTextFieldRoot}
                                  size="small"
                                  value={
                                    option.value === answer.respuesta.value
                                      ? option.label
                                      : ""
                                  }
                                />
                              )
                          )}

                        {question.options &&
                          question.type === TypeQuestion.CHECK &&
                          question.options.map(
                            (option, index) =>
                              option.value === answer.respuesta[0].value && (
                                <TextField
                                  key={index}
                                  name="input"
                                  variant="outlined"
                                  className={classes.myTextFieldRoot}
                                  size="small"
                                  value={
                                    option.value === answer.respuesta[0].value
                                      ? option.label
                                      : ""
                                  }
                                />
                              )
                          )}
                        {question.type === TypeQuestion.GEOLOCATION && (
                          <>
                            <Grid container>
                              <Grid item xs={12}>
                                <Card className={classes.cardPDF}>
                                  <CardMedia
                                    className={classes.media}
                                    image={`https://maps.googleapis.com/maps/api/staticmap?center=${answer.respuesta.value.coords.latitude},${answer.respuesta.value.coords.longitude}&zoom=13&size=400x400&&markers=color:red%7C${answer.respuesta.value.coords.latitude},${answer.respuesta.value.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_APIKEY}`}
                                    title="Map"
                                  />
                                </Card>
                                <p className={classes.page}></p>
                              </Grid>
                            </Grid>
                          </>
                        )}
                        {question.type === TypeQuestion.FILE && (
                          <Box mt={1}>
                            <Link href={answer.respuesta.value} target="_blank">
                              {answer.respuesta.value}
                            </Link>
                          </Box>
                        )}
                      </Grid>
                    )
                  )}
                </Grid>
              </Box>
            ))}
          </Box>
        ))}
      {/* ----------------- FORMATO DE AUTORIZACIÓN ------------------- */}
      <Box mt={1}>
        <Grid container>
          <h1>
            <FormattedMessage id="AuthorizationFormat" />
          </h1>
          <Grid item xs={12} className={classes.cardPDF}>
            <img
              style={{ position: "absolute" }}
              className={classes.media}
              src={authorizationFormat}
              alt="Authorization Format"
            />
          </Grid>
        </Grid>
      </Box>
      <Box mt={1}>
        <Box display="flex" justifyContent="center" alignContent="flex-end">
          <Grid>
            <img style={{ width: "600px" }} src={logo} alt="Logo Encuestapp" />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
