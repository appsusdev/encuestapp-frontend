import { getCitizens, getTransmittedSurveysByCitizen } from '../../services/firebase/citizens';
import { CitizensType } from '../../interfaces/Citizens';
import { types } from '../types/types';
import { Survey } from '../../interfaces/Survey';
import { finishLoading } from './uiActions';

export const startLoadingCitizens = () => {
  return async (dispatch: Function, getState: Function) => {
    const { municipio } = getState().auth;
    const town: string = municipio;
    
    const jsonResponse: any = await getCitizens(town);

    if(jsonResponse){

      const parseJson = await JSON.parse(jsonResponse.data);
      dispatch( setCitizens( JSON.parse(parseJson)) );
    }

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
    const town = auth.municipio;
    const idSurveys: string[] = [];

    const resp = await getTransmittedSurveysByCitizen(town, idCitizen)
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

