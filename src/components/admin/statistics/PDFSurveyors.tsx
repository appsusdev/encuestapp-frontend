import { FormattedMessage } from "react-intl";

import {
  Box,
  Card,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Radio,
  TextField,
  Typography,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";

import { TypeQuestion } from "../../../enums/enums";
import { getCopyArrayOrObject } from "../../../helpers/getCopyArrayOrObject";
import { Chapter, ISurveyAnswers } from "../../../interfaces/Survey"
import { useStyles } from "../../../shared/styles/useStyles";
import { convertDateDash } from "../../../helpers/convertDate";

interface Props {
  data: Chapter[];
  title: string | undefined;
  surveyCode: string;
}
export const PDFSurveyors = (props: Props) => {
  const { data, title, surveyCode } = props;
  const classes = useStyles();

  const list: Chapter[] = getCopyArrayOrObject(data);


  return (
    <Box mt={2} m={5}>
      <Box display="flex" justifyContent="center" className={classes.titlePDF}>
      {title}
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box mt={3} display="flex" justifyContent="flex-start">
          <div style={{ fontWeight: "bold" }}>
            <FormattedMessage id="SurveyCode" />:
          </div>
          &nbsp;
          <div className={classes.capitalize}>
            {surveyCode}
          </div>
        </Box>
      </Box>

      {list &&
        list.map((chapter) => (
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
                            <Grid container>
                              <Grid item xs={8}>
                                <Card className={classes.card}>
                                  <CardMedia
                                    className={classes.media}
                                    image={
                                      answer.respuesta && answer.respuesta.value
                                    }
                                    title="Paella dish"
                                  />
                                </Card>
                              </Grid>
                            </Grid>
                          </>
                        )}
                        {question.options &&
                          question.type !== TypeQuestion.SELECT &&
                          question.options.map((option, index) => (
                            <Grid container key={index}>
                              <Grid item xs={6}>
                                {question.type === TypeQuestion.RADIO && (
                                  <FormControlLabel
                                    value={option.label}
                                    control={<Radio />}
                                    label={option.label}
                                    checked={
                                      option.value === answer.respuesta[0].value
                                        ? true
                                        : false
                                    }
                                  />
                                )}
                                {question.type === TypeQuestion.CHECK &&
                                  option.value ===
                                    answer.respuesta[0].value && (
                                    <>
                                      <Checkbox
                                        color="default"
                                        checked={
                                          option.value ===
                                          answer.respuesta[0].value
                                            ? true
                                            : false
                                        }
                                      />
                                      <label className="form-text">
                                        {option.label}
                                      </label>
                                    </>
                                  )}
                              </Grid>
                            </Grid>
                          ))}
                        {question.options &&
                          question.type === TypeQuestion.SELECT &&
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
                        {question.type === TypeQuestion.GEOLOCATION && (
                          <Box m={1}>
                            <Card className={classes.cardPDF}>
                              <CardMedia
                                className={classes.media}
                                image={`https://maps.googleapis.com/maps/api/staticmap?center=${answer.respuesta.value.coords.latitude},${answer.respuesta.value.coords.longitude}&zoom=13&size=400x400&&markers=color:red%7C${answer.respuesta.value.coords.latitude},${answer.respuesta.value.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_APIKEY}`}
                                title="Map"
                              />
                            </Card>
                          </Box>
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
    </Box>
  );
};
