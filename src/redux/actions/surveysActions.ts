import { Chapter, Survey, SurveyQuestion } from "../../interfaces/Survey";
import {
  existsSurvey,
  addNewSurvey,
  editSurvey,
  existsChapter,
  addNewChapter,
  deleteChapter,
  editChapter,
  addQuestion,
  editQuestion,
  deleteQuestion,
  getSurveysAndChapters,
} from "../../services/firebase/surveys";
import { encuestaDTO, capituloDTO, preguntaDTO } from "../../helpers/surveyDTO";
import {
  uiOpenErrorAlert,
  uiOpenSuccessAlert,
  uiOpenModalAlert,
  uiCloseQuestion,
  startLoading,
  finishLoading,
  uiCloseModalAlert,
  uiOpenDeleteSuccess,
} from "./uiActions";
import { types } from "../types/types";
import {
  deleteSurveysTransmitted,
  deleteSurveyFirebase,
} from "../../services/firebase/surveys";
import { updateAssignedSurveys } from "./surveyorsActions";
import { changeAssignedSurveys } from "../../services/firebase/surveyors";

export const startNewSurvey = (survey: Partial<Survey>) => {
  return async (dispatch: any, getState: any) => {
    const { municipio, nit } = getState().auth;
    const town = municipio;
    const { code } = survey;
    survey.idTown = town;

    const existsSurveyDB = await existsSurvey(town, code);

    if (existsSurveyDB) {
      dispatch(uiOpenErrorAlert());
    } else {
      const surveyToDB = encuestaDTO(survey, town, nit);
      survey.idEntity = nit;

      try {
        // Crear encuesta
        await addNewSurvey(town, code, surveyToDB);
        dispatch(addNewSurveyRedux(survey));
        dispatch(uiOpenSuccessAlert());
      } catch (error: any) {
        throw new Error(error);
      }
    }
  };
};

// Agregar nueva encuesta al reducer
const addNewSurveyRedux = (survey: any) => ({
  type: types.surveyAddNew,
  payload: survey,
});

// Cargar encuestas por municipio
export const startLoadingCompleteSurveys = (town: string, nit: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(startLoading());
      const surveys = await getSurveysAndChapters(town, nit);
      await dispatch(setSurveys(surveys));
      dispatch(finishLoading());
    } catch (error: any) {
      throw new Error(error);
    }
  };
};

export const setSurveys = (surveys: Survey[]) => ({
  type: types.surveysCompleteLoad,
  payload: surveys,
});

// Encuesta activa
export const activeSurvey = (survey: {} | null) => ({
  type: types.surveyActive,
  payload: survey,
});

export const surveyCleanActive = () => ({ type: types.surveyCleanActive });

// Editar encuesta
export const startEditSurvey = (survey: Partial<Survey>) => {
  return async (dispatch: any, getState: any) => {
    const { auth } = getState();
    const town = auth.municipio;

    try {
      await editSurvey(survey, town);
      dispatch(updateSurvey(survey));
      dispatch(uiOpenSuccessAlert());
    } catch (error: any) {
      throw new Error(error);
    }
  };
};

// Agregar nuevo capítulo o editar capitulo
export const startNewChapter = (
  chapter: Partial<Chapter>,
  idSurvey: string,
  action: boolean,
  idChapter?: string
) => {
  return async (dispatch: any, getState: any) => {
    const { auth } = getState();
    const { activeChapter, activeSurvey: survey } = getState().survey;
    const town = auth.municipio;
    const { name, number } = chapter;

    const existsChapterDB = await existsChapter(town, idSurvey, name);
    const chapterToDB = capituloDTO(chapter);
    chapter.id = `capitulo${number}-${Date.now()}`;

    if (existsChapterDB) {
      if (action) {
        dispatch(uiOpenErrorAlert());
      } else {
        if (name === activeChapter.name) {
          // Editar capitulo
          idChapter &&
            (await editChapter(town, idSurvey, idChapter, chapterToDB));
          dispatch(
            chapterActive({ ...activeChapter, name: name, number: number })
          );
          dispatch(uiOpenSuccessAlert());

          // Cambio del estado en el reducer
          const updatedChapters = survey.chapters.map(
            (data: Partial<Chapter>) => (data.id === idChapter ? chapter : data)
          );
          dispatch(activeSurvey({ ...survey, chapters: updatedChapters }));
          dispatch(updateSurvey({ ...survey, chapters: updatedChapters }));
        } else {
          dispatch(uiOpenErrorAlert());
        }
      }
    } else {
      try {
        if (action) {
          // Crear capitulo
          await addNewChapter(town, idSurvey, chapterToDB, chapter.id);
          // Cambio del estado en el reducer
          dispatch(
            activeSurvey({ ...survey, chapters: [...survey.chapters, chapter] })
          );
          dispatch(
            updateSurvey({ ...survey, chapters: [...survey.chapters, chapter] })
          );
        } else {
          // Editar capitulo
          idChapter &&
            (await editChapter(town, idSurvey, idChapter, chapterToDB));
          // Cambio del estado en el reducer
          dispatch(
            chapterActive({ ...activeChapter, name: name, number: number })
          );

          // Cambio del estado en el reducer
          const updatedChapters = survey.chapters.map(
            (data: Partial<Chapter>) => (data.id === idChapter ? chapter : data)
          );
          dispatch(activeSurvey({ ...survey, chapters: updatedChapters }));
          dispatch(updateSurvey({ ...survey, chapters: updatedChapters }));
        }
        dispatch(uiOpenSuccessAlert());
      } catch (error: any) {
        throw new Error(error);
      }
    }
  };
};

// Cargar capitulos por encuesta
export const startLoadingChapters = (town: string, idSurvey: string) => {
  return async (dispatch: any, getState: any) => {
    const { activeSurvey } = getState().survey;

    dispatch(setChapters(activeSurvey.chapters));
  };
};

export const setChapters = (chapters: Chapter[]) => ({
  type: types.chaptersLoad,
  payload: chapters,
});

// Eliminar capitulo en una encuesta
export const startDeleteChapter = (idSurvey: string, idChapter: string) => {
  return async (dispatch: any, getState: any) => {
    const { auth } = getState();
    const { activeSurvey: survey } = getState().survey;
    const town = auth.municipio;

    try {
      const filterChapters = survey.chapters.filter(
        (data: Partial<Chapter>) => data.id !== idChapter
      );
      await deleteChapter(town, idSurvey, idChapter);
      dispatch(uiOpenModalAlert());
      dispatch(activeSurvey({ ...survey, chapters: filterChapters }));
      dispatch(updateSurvey({ ...survey, chapters: filterChapters }));
      dispatch(chapterCleanActive());
    } catch (error: any) {
      throw new Error(error);
    }
  };
};

// Capitulo activa
export const chapterActive = (chapter: {} | null) => ({
  type: types.chapterActive,
  payload: chapter,
});

export const chapterCleanActive = () => ({ type: types.chapterCleanActive });

// Agregar pregunta
export const startNewQuestion = (question: any, idSurvey: string) => {
  return async (dispatch: any, getState: any) => {
    const { auth } = getState();
    const { activeSurvey: survey } = getState().survey;
    const town = auth.municipio;
    const idChapter = question.chapter;

    const getChapter = survey.chapters.filter(
      (chapter: Partial<Chapter>) => chapter.id === question.chapter
    );
    const idQuestion = `pregunta${
      getChapter[0].questions.length + 1
    }_${Date.now()}`;
    let typeQuestion: string = "";
    question.directedTo === 0
      ? (typeQuestion = "PreguntasIndividual")
      : (typeQuestion = "PreguntasHogar");
    question.questionNumber = getChapter[0].questions.length + 1;

    const questionToDB = preguntaDTO(question, typeQuestion);
    const questionToRedux = {
      id: idQuestion,
      question: question.question,
      directedTo: typeQuestion,
      type: question.type,
      chart: question.chart,
      options: question.options,
      answers: question.answers,
      questionNumber: question.questionNumber,
    };

    try {
      await addQuestion(
        town,
        idSurvey,
        idChapter,
        typeQuestion,
        questionToDB,
        idQuestion
      );
      dispatch(uiOpenSuccessAlert());

      // Cambio del estado en el reducer
      const updatedChapters = survey.chapters.map(
        (chapter: Partial<Chapter>) => {
          if (chapter.id === question.chapter) {
            chapter.questions = [...getChapter[0].questions, questionToRedux];
          }
          return chapter;
        }
      );
      dispatch(activeSurvey({ ...survey, chapters: updatedChapters }));
      dispatch(updateSurvey({ ...survey, chapters: updatedChapters }));
    } catch (error: any) {
      throw new Error(error);
    }
  };
};

// Pregunta activa
export const questionActive = (question: {} | null) => ({
  type: types.questionActive,
  payload: question,
});

export const questionCleanActive = () => ({ type: types.questionCleanActive });

// Capitulo de la pregunta activa
export const chapterQuestionActive = (chapter: {} | null) => ({
  type: types.chapterQuestionActive,
  payload: chapter,
});

export const chapterQuestionCleanActive = () => ({
  type: types.chapterQuestionCleanActive,
});

// Editar
export const startEditQuestion = (
  question: any,
  idSurvey: string,
  idQuestion: string
) => {
  return async (dispatch: any, getState: any) => {
    const { auth } = getState();
    const { activeSurvey: active } = getState().survey;
    const survey: Survey = active;
    const town = auth.municipio;
    const idChapter = question.chapter;
    const getChapter = survey.chapters.filter(
      (chapter: Partial<Chapter>) => chapter.id === question.chapter
    );

    let typeQuestion: string = "";
    question.directedTo === 0
      ? (typeQuestion = "PreguntasIndividual")
      : (typeQuestion = "PreguntasHogar");

    const questionToDB = preguntaDTO(question, typeQuestion);
    const questionToRedux = {
      id: idQuestion,
      question: question.question,
      directedTo: typeQuestion,
      type: question.type,
      chart: question.chart,
      options: question.options,
      answers: question.answers,
      questionNumber: question.questionNumber,
    };

    try {
      await editQuestion(
        town,
        idSurvey,
        idChapter,
        typeQuestion,
        idQuestion,
        questionToDB
      );
      dispatch(uiOpenSuccessAlert());

      // Cambio de estado en el reducer
      const updatedChapters = survey.chapters.map((chapter: Chapter) => {
        if (chapter.id === question.chapter) {
          chapter.questions = getChapter[0].questions.map((question) =>
            question.id === idQuestion ? questionToRedux : question
          );
        }
        return chapter;
      });

      dispatch(questionActive(questionToRedux));
      dispatch(activeSurvey({ ...survey, chapters: updatedChapters }));
      dispatch(updateSurvey({ ...survey, chapters: updatedChapters }));
    } catch (error: any) {
      throw new Error(error);
    }
    dispatch(uiCloseQuestion());
    dispatch(questionCleanActive());
    dispatch(chapterQuestionCleanActive());
  };
};

// Eliminar pregunta
export const startDeleteQuestion = (question: any, idChapter: string) => {
  return async (dispatch: any, getState: any) => {
    const { auth } = getState();
    const { activeSurvey: survey } = getState().survey;
    const town = auth.municipio;
    const idQuestion = question.id;
    const getChapter = survey.chapters.filter(
      (chapter: Partial<Chapter>) => chapter.id === idChapter
    );

    try {
      await deleteQuestion(
        town,
        survey.idSurvey,
        idChapter,
        question.directedTo,
        question.id
      );
      dispatch(uiOpenSuccessAlert());

      // Cambio en el estado del reducer
      const updatedChapters = survey.chapters.map((chapter: Chapter) => {
        if (chapter.id === idChapter) {
          chapter.questions = getChapter[0].questions.filter(
            (question: SurveyQuestion) => question.id !== idQuestion
          );
        }
        return chapter;
      });
      dispatch(activeSurvey({ ...survey, chapters: updatedChapters }));
      dispatch(updateSurvey({ ...survey, chapters: updatedChapters }));
    } catch (error: any) {
      throw new Error(error);
    }
  };
};

// Actualizar encuesta
export const updateSurvey = (survey: any) => ({
  type: types.surveyUpdated,
  payload: survey,
});

// Eliminar encuesta
export const startDeleteSurvey = (idSurvey: string) => {
  return async (dispatch: any, getState: any) => {
    const { municipio, nit } = getState().auth;
    const { assignedSurveys } = getState().surveyor;
    const town: string = municipio;

    try {
      await deleteSurveyFirebase(town, idSurvey);
      await deleteSurveysTransmitted(nit, idSurvey);
      dispatch(deleteSurvey(idSurvey));

      assignedSurveys.forEach(async (data: any) => {
        const { email, assignedSurveys } = data;

        if (assignedSurveys.includes(idSurvey)) {
          const arraySurveys: string[] = assignedSurveys.filter(
            (id: any) => id !== idSurvey
          );

          dispatch(
            updateAssignedSurveys({
              id: email,
              email,
              assignedSurveys: arraySurveys,
            })
          );

          await changeAssignedSurveys(email, nit, idSurvey, arraySurveys);
        }
      });
      dispatch(surveyCleanActive());
      dispatch(uiOpenDeleteSuccess());
      dispatch(uiCloseModalAlert());
    } catch (error: any) {
      throw new Error(error);
    }
  };
};

// Eliminar encuesta del reducer
export const deleteSurvey = (idSurvey: string) => ({
  type: types.surveyDelete,
  payload: idSurvey,
});
