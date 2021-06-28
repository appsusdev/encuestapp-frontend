import { getCitizens, getTransmitedSurveys } from '../../services/firebase/citizens';
import { CitizensType } from '../../interfaces/Citizens';
import { types } from '../types/types';
import { Survey } from '../../interfaces/Survey';
import { finishLoading } from './uiActions';

export const startLoadingCitizens = () => {
  return async (dispatch: Function, getState: Function) => {
    const { municipios } = getState().auth;
    const town: string = municipios[0];
    
    const jsonResponse: any = await getCitizens(town);
    const parseJson = await JSON.parse(jsonResponse.data);

    dispatch( setCitizens( JSON.parse(parseJson)) );
  };
};

export const setCitizens = (citizens: CitizensType)=> ({
  type: types.citizensLoad,
  payload: citizens,
});


export const startLoadingSurveysAnswered = (idCitizen: string) => {
  return async (dispatch: Function, getState: Function) => {
    const { auth, survey } = getState();
    const { surveys } = survey;
    const town = auth.municipios[0];
    const idSurveys: string[] = [];

    const resp = await getTransmitedSurveys(town, idCitizen)
    resp.forEach((survey) => idSurveys.push(survey.idEncuesta));
    const newSurveys = surveys.filter( (survey: Partial<Survey>) => (survey.idSurvey) && idSurveys.includes(survey.idSurvey));
    
    dispatch( finishLoading() );
    dispatch( setSurveysAnswered(newSurveys) );
  };
};

export const setSurveysAnswered = (surveys: any)=> ({
  type: types.citizensLoadSurveysAnswered,
  payload: surveys,
});

// Ciudadano activo
export const activeCitizen = (citizen: {} | null) => ({
  type: types.citizenActive,
  payload: citizen
});

export const citizenCleanActive = () => ({type: types.citizenCleanActive});

