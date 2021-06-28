import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";

import {
  Box,
  Checkbox,
  Card,
  CardMedia,
  Typography,
  Grid,
  Button,
  TextField,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PersonIcon from "@material-ui/icons/Person";

import { TypeQuestion } from "../../../enums/enums";
import { getCopyArrayOrObject } from "../../../helpers/getCopyArrayOrObject";
import { Survey, Chapter, ISurveyAnswers } from "../../../interfaces/Survey";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";
import { convertDateDash } from "../../../helpers/convertDate";
import { Link } from "@material-ui/core";

interface Props {
  data: Partial<Survey>;
}
export const PDFSurveys = (props: Props) => {
  const { data } = props;
  const classes = useStyles();
  const intl = useIntl();

  const { activeCitizen } = useSelector<AppState, AppState["citizens"]>(
    (state) => state.citizens
  );

  const list: Chapter[] | undefined = getCopyArrayOrObject(data.chapters);

  const newList = list?.map((chapter) => {
    chapter.questions.map((question) => {
      question.answers = question.answers?.filter(
        (answer) => answer.citizen === activeCitizen.identificacion
      );
      return question;
    });
    return chapter;
  });

  return (
    <Box m={5}>
      <Box display="flex" justifyContent="center" className={classes.titlePDF}>
        {data.name}
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

      {newList &&
        newList.map((chapter) => (
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
                          <Button
                            style={{
                              marginTop: "10px",
                              textTransform: "uppercase",
                            }}
                            className={clsx(classes.btnAction, classes.save)}
                            size="medium"
                            component="span"
                          >
                            <LocationOnIcon />
                            {/* TODO: Poner en el mapa*/}
                            Latitud: {answer.respuesta.value.coords.latitude}
                            <br />
                            Longitud: {answer.respuesta.value.coords.longitude}
                          </Button>
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
