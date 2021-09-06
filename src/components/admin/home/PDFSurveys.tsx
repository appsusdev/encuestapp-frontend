import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import {
  Box,
  Card,
  CardMedia,
  Typography,
  Grid,
  TextField,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";

import { TypeQuestion } from "../../../enums/enums";
import { Chapter, ISurveyAnswers } from "../../../interfaces/Survey";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";
import { convertDateDash } from "../../../helpers/convertDate";
import { Link } from "@material-ui/core";

interface Props {
  data: Chapter[];
  title: string | undefined;
}
export const PDFSurveys = (props: Props) => {
  const { data, title } = props;
  const classes = useStyles();

  const { activeCitizen } = useSelector<AppState, AppState["citizens"]>(
    (state) => state.citizens
  );

  const { surveysAnswered } = useSelector<AppState, AppState["citizens"]>(
    (state) => state.citizens
  );

  return (
    <Box m={5}>
      <Box display="flex" justifyContent="center" className={classes.titlePDF}>
        {title}
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

      {data &&
        data.map((chapter) => (
          <Box key={chapter.id} mt={2}>
            <Typography className={classes.title} variant="h6">
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
                            <Grid container >
                              <Grid item xs={12} >
                                <Card className={classes.cardPDF}>
                                  <CardMedia
                                    image={
                                      answer.respuesta && answer.respuesta.value
                                    }
                                    title="Paella dish"
                                  />
                                </Card>
                                <p className={classes.page} ></p>
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
                                <p className={classes.page} ></p>
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
            {
                <>
                <h1>Formato de autorización</h1>
                  <Grid container>
                    <Grid item xs={12}>
                      <Card className={classes.cardPDF}>
                        <CardMedia
                          className={classes.media}
                          image={`${surveysAnswered[0].authorizationFormats}`}
                          title="autorizationFormat"
                        />
                      </Card>
                    </Grid>
                  </Grid>
                </>
              }
          </Box>
        ))}
    </Box>
  );
};
