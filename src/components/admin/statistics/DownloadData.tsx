import React, { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import { Box, Link } from "@material-ui/core";

import { useStyles } from "../../../shared/styles/useStyles";
import { ISurveyAnswers, Survey, Chapter } from "../../../interfaces/Survey";
import { DictionaryQuestions } from "./DictionaryQuestions";
import { TypeQuestion } from "../../../enums/enums";
import { MyAlert } from "../../custom/MyAlert";
import { CustomizedDialogPDF } from "../../custom/CustomizedDialogPDF";
import { AppState } from "../../../redux/reducers/rootReducer";
import {
  uiCloseModalAssign,
  uiOpenModalAssign,
} from "../../../redux/actions/uiActions";
interface Props {
  transmitted: Survey[];
  surveyor: string;
  idCitizens: string[];
}

interface IData {
  home: any[];
  ind: any[];
  questions: any[];
}

export const DownloadData = (props: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { modalAssignOpen } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const { transmitted, surveyor, idCitizens } = props;
  const csvLinkHome = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);
  const csvLinkInd = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);
  const [load, setLoad] = useState({ home: false, ind: false });
  const [data, setData] = useState<IData>({
    home: [],
    ind: [],
    questions: [],
  });

  let arrayQuestionsHome: any[] = [];
  let arrayQuestionsInd: any[] = [];
  let questionsData: any[] = [];

  const getQuestions = () => {
    transmitted[0].chapters.forEach((chapter: Chapter) => {
      chapter.questions?.forEach((question) => {
        surveyor !== "Todos" &&
          (question.answers = question.answers.filter(
            (answer: Partial<ISurveyAnswers>) =>
              answer.idEncuestador === surveyor &&
              answer.idEncuestaCiudadano &&
              idCitizens.includes(answer.idEncuestaCiudadano)
          ));

        if (question.directedTo === "PreguntasHogar") {
          arrayQuestionsHome.push(question);
        } else {
          arrayQuestionsInd.push(question);
        }
        return question;
      });
    });

    arrayQuestionsHome.forEach((question, index) =>
      questionsData.push({
        question: `PreguntaHog${index + 1}`,
        answer: question.question,
      })
    );

    arrayQuestionsInd.forEach((question, index) =>
      questionsData.push({
        question: `PreguntaInd${index + 1}`,
        answer: question.question,
      })
    );

    setData({ ...data, questions: questionsData });
    dispatch(uiOpenModalAssign());
  };

  const getData = async (flag: boolean) => {
    setLoad({ home: false, ind: false });
    transmitted[0].chapters.forEach((chapter: Chapter) => {
      chapter.questions?.forEach((question) => {
        surveyor !== "Todos" &&
          (question.answers = question.answers.filter(
            (answer: Partial<ISurveyAnswers>) =>
              answer.idEncuestador === surveyor &&
              answer.idEncuestaCiudadano &&
              idCitizens.includes(answer.idEncuestaCiudadano)
          ));

        if (question.directedTo === "PreguntasHogar") {
          arrayQuestionsHome.push(question);
        } else {
          arrayQuestionsInd.push(question);
        }
        return question;
      });
    });

    await arrayQuestionsHome.forEach((question, index) =>
      questionsData.push({
        question: `PreguntaHog${index + 1}`,
        answer: question.question,
      })
    );

    await arrayQuestionsInd.forEach((question, index) =>
      questionsData.push({
        question: `PreguntaInd${index + 1}`,
        answer: question.question,
      })
    );

    await setData({ ...data, questions: questionsData });

    // Filtro de la data para los excel
    if (flag) {
      // Respuestas tipo hogar
      const homeData: any[] = [];
      arrayQuestionsHome.forEach((question, index) => {
        question.answers.forEach((answer: ISurveyAnswers) => {
          homeData.push({
            Codigo_encuesta: transmitted[0].idSurvey,
            Codigo_pregunta: `PreguntaHog${index + 1}`,
            ID_ciudadano_responsable: answer.idEncuestaCiudadano,
            ID_ciudadano_encuestado: answer.citizen,
            Respuesta:
              question.type === TypeQuestion.RADIO ||
              question.type === TypeQuestion.SELECT
                ? question.options.map((option: any) =>
                    option.value === answer.respuesta.value ? option.label : ""
                  )
                : question.type === TypeQuestion.CHECK
                ? question.options.map((option: any) =>
                    option.value === answer.respuesta[0].value
                      ? option.label
                      : ""
                  )
                : question.type === TypeQuestion.GEOLOCATION
                ? `Latitud: ${answer.respuesta.value.coords.latitude}, Longitud: ${answer.respuesta.value.coords.longitude}`
                : answer.respuesta.value,
          });
        });
      });

      setLoad({ ...load, home: true });
      await setData({ ...data, home: homeData });
      csvLinkHome.current?.link.click();
    } else {
      // Respuestas tipo individual
      const indData: any[] = [];
      arrayQuestionsInd.forEach((question, index) => {
        question.answers.forEach((answer: ISurveyAnswers) => {
          indData.push({
            Codigo_encuesta: transmitted[0].idSurvey,
            Codigo_pregunta: `PreguntaInd${index + 1}`,
            ID_ciudadano_responsable: answer.idEncuestaCiudadano,
            ID_ciudadano_encuestado: answer.citizen,
            Respuesta:
              question.type === TypeQuestion.RADIO ||
              question.type === TypeQuestion.SELECT
                ? question.options.map((option: any) =>
                    option.value === answer.respuesta.value ? option.label : ""
                  )
                : question.type === TypeQuestion.CHECK
                ? question.options.map((option: any) =>
                    option.value === answer.respuesta[0].value
                      ? option.label
                      : ""
                  )
                : question.type === TypeQuestion.GEOLOCATION
                ? `Latitud: ${answer.respuesta.value.coords.latitude}, Longitud: ${answer.respuesta.value.coords.longitude}`
                : answer.respuesta.value,
          });
        });
      });
      setLoad({ ...load, ind: true });
      await setData({ ...data, ind: indData });
      csvLinkInd.current?.link.click();
    }
  };

  const onDeny = () => {
    dispatch(uiCloseModalAssign());
  };

  return (
    <Box
      m={2}
      ml={6}
      mr={6}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Link component="button" onClick={async () => await getData(true)}>
        Encuesta{transmitted[0].idSurvey}_microdatos_hogar
      </Link>
      {data.home.length > 0 && (
        <CSVLink
          data={data.home}
          separator={";"}
          filename={`Microdatos_hogar_${transmitted[0].idSurvey}.csv`}
          ref={csvLinkHome}
        />
      )}

      <Link component="button" onClick={async () => await getData(false)}>
        Encuesta{transmitted[0].idSurvey}_microdatos_personas
      </Link>
      {data.ind.length > 0 && (
        <CSVLink
          data={data.ind}
          separator={";"}
          filename={`Microdatos_personas_${transmitted[0].idSurvey}.csv`}
          ref={csvLinkInd}
        />
      )}

      <React.Fragment>
        <Link
          className={classes.typography}
          component="button"
          onClick={() => getQuestions()}
        >
          <FormattedMessage id="DictionaryQuestions" />
        </Link>

        <CustomizedDialogPDF
          open={modalAssignOpen}
          onConfirm={onDeny}
          onDeny={onDeny}
          title={transmitted[0].name}
          content={
            <DictionaryQuestions
              title={transmitted[0].name}
              questions={data.questions}
            />
          }
          textButton="Download"
        />
      </React.Fragment>

      {/* <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <DictionaryQuestions
            title={transmitted[0].name}
            questions={data.questions}
          />
        </div>
      </div> */}

      <MyAlert
        open={data.home.length === 0 && load.home}
        typeAlert="error"
        message="NoInformationHome"
        time={2000}
        handleClose={() => setLoad({ ...load, home: false })}
      />

      <MyAlert
        open={data.ind.length === 0 && load.ind}
        typeAlert="error"
        message="NoInformationIndividual"
        time={2000}
        handleClose={() => setLoad({ ...load, ind: false })}
      />
    </Box>
  );
};
