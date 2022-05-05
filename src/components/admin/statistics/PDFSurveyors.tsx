import clsx from "clsx";
import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import {
  Box,
  createMuiTheme,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  onFinishLoad?(): void;
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

  const getUsername = (idUser: string) => {
    const findUser = citizensSurveyeds.find(
      (el) => el.identificacion === idUser
    );
    if (!findUser) {
      return "";
    }
    return `${findUser.primerNombre.toLowerCase()} 
    ${findUser.segundoNombre.toLowerCase()}
    ${findUser.primerApellido.toLowerCase()}
    ${findUser.segundoApellido.toLowerCase()}`;
  };

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
                <Grid container>
                  <Grid item xs={12}>
                    <Box display={"flex"}>
                      {question.directedTo === "PreguntasIndividual" ? (
                        <PersonIcon
                          fontSize="small"
                          style={{ marginTop: "2px" }}
                        />
                      ) : (
                        <HomeIcon
                          fontSize="small"
                          style={{ marginTop: "2px" }}
                        />
                      )}
                      <Box
                        ml={1}
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {chapter.number}.{index + 1} {question.question}
                      </Box>
                    </Box>
                  </Grid>

                  {question.answers.map(
                    (answer: ISurveyAnswers, indexAnswer: number) => (
                      <Fragment key={indexAnswer}>
                        {question.directedTo === "PreguntasIndividual" &&
                          getUsername(answer.citizen) !== "" && (
                            <Grid item xs={12}>
                              <p
                                style={{
                                  marginTop: "10px",
                                }}
                                className={classes.capitalize}
                              >
                                {getUsername(answer.citizen)}:
                              </p>
                            </Grid>
                          )}
                        <Grid
                          item
                          xs={
                            question.type === TypeQuestion.PICTURE ||
                            question.type === TypeQuestion.FILE ||
                            question.type === TypeQuestion.GEOLOCATION ||
                            question.type === TypeQuestion.SELECT ||
                            question.type === TypeQuestion.CHECK ||
                            question.type === TypeQuestion.RADIO
                              ? 12
                              : 6
                          }
                        >
                          {(question.type === TypeQuestion.TEXT_INPUT ||
                            question.type === TypeQuestion.NUMBER ||
                            question.type === TypeQuestion.DEPARTMENT ||
                            question.type === TypeQuestion.TOWN ||
                            question.type === TypeQuestion.TEXT_AREA) && (
                            <Box m={1}>
                              {answer.respuesta && answer.respuesta.value}
                            </Box>
                          )}

                          {question.type === TypeQuestion.DATE && (
                            <Box m={1}>
                              {answer.respuesta &&
                                convertDateDash(answer.respuesta.value)}
                            </Box>
                          )}
                          {question.type === TypeQuestion.PICTURE && (
                            <>
                              {answer && (
                                <Box
                                  display="flex"
                                  justifyContent="center"
                                  width={1}
                                >
                                  <img
                                    style={{
                                      height: "70vh",
                                      width: "65%",
                                      objectFit: "cover",
                                    }}
                                    src={answer.respuesta.value}
                                    alt="ImageAnswer"
                                    className={classes.media}
                                  />
                                </Box>
                              )}
                            </>
                          )}
                          {question.options &&
                            question.type === TypeQuestion.CHECK &&
                            question.options.map((option) =>
                              answer.respuesta.map(
                                (resp: any, indexResp: number) =>
                                  option.value === resp.value && (
                                    <Box
                                      key={indexResp}
                                      display={"flex"}
                                      justifyContent={"space-between"}
                                      width={"100%"}
                                    >
                                      <Box width={"51%"} m={1}>
                                        {option.value === resp.value
                                          ? option.label
                                          : ""}
                                      </Box>

                                      <Box width={"49%"} ml={2}>
                                        {option.description && (
                                          <Box
                                            display={"flex"}
                                            justifyContent={"space-between"}
                                          >
                                            <Box width={1 / 2} mt={2}>
                                              <p>{option.textDescription}:</p>
                                            </Box>

                                            <Box m={1} mt={1}>
                                              {resp.description
                                                ? resp.description
                                                : ""}
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  )
                              )
                            )}
                          {(question.type === TypeQuestion.RADIO ||
                            question.type === TypeQuestion.SELECT) &&
                            question.options &&
                            question.options.map(
                              (option, index) =>
                                option.value === answer.respuesta.value && (
                                  <Box
                                    key={index}
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                    width={"100%"}
                                  >
                                    <Box width={"51%"} m={1}>
                                      {option.value === answer.respuesta.value
                                        ? option.label
                                        : ""}
                                    </Box>
                                    <Box width={"49%"} ml={2}>
                                      {option.description && (
                                        <Box
                                          display={"flex"}
                                          justifyContent={"space-between"}
                                        >
                                          <Box width={1 / 2} mt={2}>
                                            <p>{option.textDescription}:</p>
                                          </Box>

                                          <Box m={1} mt={1}>
                                            {answer.respuesta.description
                                              ? answer.respuesta.description
                                              : ""}
                                          </Box>
                                        </Box>
                                      )}
                                    </Box>
                                  </Box>
                                )
                            )}
                          {question.type === TypeQuestion.GEOLOCATION && (
                            <Box
                              display="flex"
                              justifyContent="center"
                              width={1}
                            >
                              <img
                                style={{
                                  height: "70vh",
                                  width: "65%",
                                  objectFit: "cover",
                                }}
                                src={`https://maps.googleapis.com/maps/api/staticmap?center=${answer.respuesta.value.coords.latitude},${answer.respuesta.value.coords.longitude}&zoom=13&size=400x400&&markers=color:red%7C${answer.respuesta.value.coords.latitude},${answer.respuesta.value.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_APIKEY}`}
                                alt="ImageAnswer"
                                className={classes.media}
                              />
                            </Box>
                          )}
                          {question.type === TypeQuestion.FILE && (
                            <Box mt={1}>
                              <Link
                                href={answer.respuesta.value}
                                target="_blank"
                              >
                                {answer.respuesta.value}
                              </Link>
                            </Box>
                          )}
                        </Grid>
                      </Fragment>
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
          <Box display="flex" justifyContent="center" width={1}>
            <img
              style={{ height: "70vh", width: "65%", objectFit: "cover" }}
              src={authorizationFormat}
              alt="ImageAnswer"
              className={classes.media}
            />
          </Box>
        </Grid>
      </Box>

      <Box mt={1}>
        <Box display="flex" justifyContent="center" alignContent="flex-end">
          <Grid>
            <img
              style={{ height: "300px", objectFit: "cover" }}
              src={logo}
              alt="Logo Encuestapp"
            />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
