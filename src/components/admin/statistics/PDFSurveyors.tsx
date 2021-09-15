import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import {
  Box,
  Card,
  CardMedia,
  createMuiTheme,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";

import logo from "../../../assets/images/logo-encuestapp.png";
import { TypeQuestion, TypeDocEnum } from "../../../enums/enums";
import { getCopyArrayOrObject } from "../../../helpers/getCopyArrayOrObject";
import { convertDateDash } from "../../../helpers/convertDate";
import { Chapter, ISurveyAnswers } from "../../../interfaces/Survey";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";

interface Props {
  data: Chapter[];
  title: string | undefined;
  surveyCode: string;
  idSurveyeds: string[];
  dateSurvey: string;
  nameSurveyor: string;
  responsibleCitizen: string;
  authorizationFormat: string;
}

const theme = createMuiTheme({
  typography: {
    fontFamily: "Poppins",
    fontSize: 14,
  },
});

export const PDFSurveyors = (props: Props) => {
  const {
    data,
    title,
    surveyCode,
    idSurveyeds,
    dateSurvey,
    nameSurveyor,
    responsibleCitizen,
    authorizationFormat,
  } = props;

  const classes = useStyles();

  const list: Chapter[] = getCopyArrayOrObject(data);

  const { citizens } = useSelector<AppState, AppState["citizens"]>(
    (state) => state.citizens
  );
  const { razonSocial: entityTitle } = useSelector<AppState, AppState["auth"]>(
    (state) => state.auth
  );

  const citizensSurveyeds: any[] = citizens.filter((citezen) =>
    idSurveyeds.includes(citezen.identificacion)
  );

  return (
    <Box mt={2} m={5}>
      {/* ----------------- INFORMACIÓN DE LA ENCUESTA ------------------- */}

      <Box display="flex" justifyContent="center" className={classes.titlePDF}>
        {entityTitle}
      </Box>
      <Box display="flex" justifyContent="center" className={classes.titlePDF}>
        {title}
      </Box>
      <Box display="flex" justifyContent="center" className={classes.titlePDF}>
        <FormattedMessage id="Survey" /> {surveyCode}
      </Box>
      <Box mt={3} display="flex" justifyContent="flex-start">
        <div style={{ fontWeight: "bold" }}>
          <FormattedMessage id="ResponsibleForSurvey" />:
        </div>
        &nbsp;
        <div className={classes.capitalize}>{responsibleCitizen}</div>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box mt={3} display="flex" justifyContent="flex-start">
          <div style={{ fontWeight: "bold" }}>
            <FormattedMessage id="Surveyor" />:
          </div>
          &nbsp;
          <div className={classes.capitalize}>{nameSurveyor}</div>
        </Box>
        <Box mt={3} mb={3} display="flex" justifyContent="flex-end">
          <div style={{ fontWeight: "bold" }}>
            <FormattedMessage id="Date" />:
          </div>
          &nbsp;
          <Box>{dateSurvey}</Box>
        </Box>
      </Box>

      <Box className={classes.titlePDF}>
        <FormattedMessage id="Surveyeds" />:
      </Box>

      {/* ----------------- TABLA CIUDADANOS ENCUESTADOS ------------------- */}

      <ThemeProvider theme={theme}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="Name" />{" "}
              </TableCell>
              <TableCell>TD</TableCell>
              <TableCell>
                <FormattedMessage id="Document" />{" "}
              </TableCell>
              <TableCell>
                <FormattedMessage id="Phone" />{" "}
              </TableCell>
              <TableCell>
                <FormattedMessage id="Email" />{" "}
              </TableCell>
              <TableCell>
                <FormattedMessage id="DateOfBirth" />{" "}
              </TableCell>
              <TableCell>
                <FormattedMessage id="Sex" />{" "}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citizensSurveyeds.map((citizen, index) => (
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                  className={classes.capitalize}
                >
                  {`${citizen.primerNombre.toLowerCase()} 
                              ${citizen.segundoNombre.toLowerCase()}
                              ${citizen.primerApellido.toLowerCase()}
                              ${citizen.segundoApellido.toLowerCase()}`}
                </TableCell>
                <TableCell>
                  {citizen.tipoIdentificacion === TypeDocEnum.CC && "CC"}
                  {citizen.tipoIdentificacion === TypeDocEnum.TI && "TI"}
                  {citizen.tipoIdentificacion === TypeDocEnum.CE && "CE"}
                  {citizen.tipoIdentificacion === TypeDocEnum.RC && "RC"}
                  {citizen.tipoIdentificacion === TypeDocEnum.NIT && "NIT"}
                  {citizen.tipoIdentificacion === TypeDocEnum.Otro && "Otro"}
                </TableCell>
                <TableCell>{citizen.identificacion}</TableCell>
                <TableCell>{citizen.telefono}</TableCell>
                <TableCell>{citizen.correo}</TableCell>
                <TableCell>{citizen.fechaNacimiento}</TableCell>
                <TableCell>
                  {(citizen.genero === 0 || citizen.genero === "0") && "F"}
                  {(citizen.genero === 1 || citizen.genero === "1") && "M"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ThemeProvider>

      {/* ----------------- RESPUESTAS DE CIUDADANOS ENCUESTADOS ------------------- */}

      {list &&
        list.map((chapter) => (
          <Box key={chapter.id} mt={2}>
            <Typography
              className={clsx(classes.titlePDF, classes.capitalize)}
              variant="h6"
            >
              {chapter.number}. {chapter.name}
            </Typography>

            {chapter.questions.map((question, index) => (
              <Box m={1} mb={1} key={question.id}>
                 {chapter.questions[index].type === TypeQuestion.GEOLOCATION &&(
                  <div style={{ pageBreakAfter: "always" }} />
                )}
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
                    (answer: ISurveyAnswers, indexAnswer: number) => (
                      <Grid
                        key={indexAnswer}
                        item
                        xs={
                          question.type === TypeQuestion.TEXT_AREA ||
                          question.type === TypeQuestion.PICTURE ||
                          question.type === TypeQuestion.FILE
                            ? 12
                            : 8
                        }
                      >
                        {/*  <h5>BREAK ANSWER {indexAnswer}</h5> */}
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
                                <Card
                                  className={classes.cardPDF}
                                  style={{
                                    marginBottom: "15px",
                                  }}
                                >
                                  <CardMedia
                                    className={classes.media}
                                    image={
                                      answer.respuesta && answer.respuesta.value
                                    }
                                    title="Answer"
                                  />
                                </Card>
                                {indexAnswer % 2 === 0 && (
                                  <>
                                    <div style={{ pageBreakAfter: "auto" }} />
                                  </>
                                )}
                              </Grid>
                            </Grid>
                          </>
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
                        {question.type === TypeQuestion.GEOLOCATION && (
                          <>
                            <Grid container style={{marginBottom:'5vh'}}>
                              <Grid item xs={12}>
                                <Card className={classes.mapPDF}>
                                  <CardMedia
                                    className={classes.media}
                                    image={`https://maps.googleapis.com/maps/api/staticmap?center=${answer.respuesta.value.coords.latitude},${answer.respuesta.value.coords.longitude}&zoom=13&size=400x400&&markers=color:red%7C${answer.respuesta.value.coords.latitude},${answer.respuesta.value.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_APIKEY}`}
                                    title="Map"
                                  />
                                </Card>
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

      <div style={{ pageBreakAfter: "always" }} />

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
            <img
              style={{ width: "600px", height: "20vh" }}
              src={logo}
              alt="Logo Encuestapp"
            />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
