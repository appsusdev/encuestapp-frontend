import {
  getCitizens,
  getTransmittedSurveysByCitizen,
  getMapData,
} from "../../services/firebase/citizens";
import { CitizensType } from "../../interfaces/Citizens";
import { types } from "../types/types";
import { Survey } from "../../interfaces/Survey";
import { finishLoading } from "./uiActions";

export const startLoadingCitizens = () => {
  return async (dispatch: Function, getState: Function) => {
    const { nit } = getState().auth;

    const jsonResponse: any = await getCitizens(nit);

    if (jsonResponse.ciudadanos) {
      const parseJson = JSON.parse(jsonResponse.ciudadanos);
      dispatch(setCitizens(parseJson));
    }
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

    const resp = await getTransmittedSurveysByCitizen(town, idCitizen, nit);
    resp.forEach((survey) => idSurveys.push(survey.idEncuesta));
    const newSurveys = surveys.filter(
      (survey: Partial<Survey>) =>
      survey.idSurvey && idSurveys.includes(survey.idSurvey)
      );
      for( let i = 0; i < resp.length ; i++ ){
        const  surveysTransmitted = resp[i].formatoAutorizacion;
        newSurveys[i].authorizationFormats = surveysTransmitted;
      }
    dispatch(finishLoading());
    dispatch(setSurveysAnswered(newSurveys));
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

export const startLoadingGeoreferencingData = (idSurvey: string) => {
  return async (dispatch: Function, getState: Function) => {
    const { surveys } = getState().survey;
    const newSurveys = surveys.filter(
      (survey: Partial<Survey>) =>
        survey.idSurvey && survey.idSurvey === idSurvey
    );

    dispatch(setSurveysAnswered(newSurveys));
  };
};

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
