import {
  listenerGetCitizens,
  getTransmittedSurveysByCitizen,
  getMapData,
} from "../../services/firebase/citizens";
import { CitizensType } from "../../interfaces/Citizens";
import { types } from "../types/types";
import { Survey, SurveyQuestion } from "../../interfaces/Survey";
import { setInfoTransmittedSurveys } from "./surveyorsActions";
import { getAnswers } from "../../services/firebase/surveys";
import { getCopyArrayOrObject } from "../../helpers/getCopyArrayOrObject";

export const startLoadingCitizens = () => {
  return async (dispatch: Function, getState: Function) => {
    const { nit } = getState().auth;

    await listenerGetCitizens(nit, dispatch);
  };
};

export const setCitizens = (citizens: CitizensType) => ({
  type: types.citizensLoad,
  payload: citizens,
});

export const startLoadingSurveysAnswered = (idCitizen: string) => {
  return async (dispatch: Function, getState: Function) => {
    const { auth, survey } = getState();
    const { surveys } = survey;
    const town = auth.municipio;
    const nit = auth.nit;
    const idSurveys: string[] = [];
    const idSurveysCitizen: string[] = [];

    const resp = await getTransmittedSurveysByCitizen(town, idCitizen, nit);

    resp.forEach((survey) => {
      idSurveys.push(survey.idEncuesta);
      idSurveysCitizen.push(survey.id);
    });

    const newSurveys = surveys.filter(
      (survey: Partial<Survey>) =>
        survey.idSurvey && idSurveys.includes(survey.idSurvey)
    );

    for (let i = 0; i < resp.length; i++) {
      const surveysTransmitted = resp[i].formatoAutorizacion;
      const idSurvey = resp[i].id;
      newSurveys[i].authorizationFormats = surveysTransmitted;
      newSurveys[i].code = idSurvey;
      newSurveys[i].citizenResponsable = resp[i].idCiudadanoResponsable;
    }
    // Obtener respuestas de ciudadano con su núcleo familiar
    const array = getCopyArrayOrObject(newSurveys);
    const surveysWithAnswers = array.map((survey: Survey) => {
      survey.chapters.map((chapter) => {
        chapter.questions.map(async (question: SurveyQuestion) => {
          if (idSurveysCitizen.includes(survey.code)) {
            let resp: any[] = [];

            resp = await getAnswers(
              town,
              survey.idSurvey,
              chapter.id,
              question.directedTo,
              question.id,
              survey.code
            );

            question.answers = resp;
            return question.answers;
          }
          return question;
        });
        return chapter;
      });
      return survey;
    });
    dispatch(setInfoTransmittedSurveys(resp));
    dispatch(setSurveysAnswered(surveysWithAnswers));
  };
};

export const setSurveysAnswered = (surveys: any) => ({
  type: types.citizensLoadSurveysAnswered,
  payload: surveys,
});

// Ciudadano activo
export const activeCitizen = (citizen: {} | null) => ({
  type: types.citizenActive,
  payload: citizen,
});

export const citizenCleanActive = () => ({ type: types.citizenCleanActive });

// Informacion del mata
export const startLoadingMapData = (nit: string) => {
  return async (dispatch: Function) => {
    const resp = await getMapData(nit);

    resp &&
      dispatch(setMapInfo({ lat: resp.lat, lng: resp.lng, zoom: resp.zoom }));
  };
};

export const setMapInfo = (data: any) => ({
  type: types.citizensLoadMapData,
  payload: data,
});
