import { Survey } from '../../interfaces/Survey';
import { existsSurvey, getSurveys, addNewSurvey } from '../../services/firebase/surveys';
import { encuestaDTO, surveyDTO } from '../../helpers/surveyDTO';
import { uiOpenErrorAlert, uiOpenSuccessAlert } from './uiActions';
import { types } from '../types/types';

export const startNewSurvey = (survey: Partial<Survey>) => {
    return async(dispatch: any, getState: any) => {

        const { auth } = getState();
        const town = auth.municipios[0];
        const { code } = survey;

        const existsSurveyDB = await existsSurvey(town, code);
        
        if(existsSurveyDB){
            dispatch( uiOpenErrorAlert() );
        } else {
            const surveyToDB = encuestaDTO(survey, town);

            try {
                // Crear encuesta
                await addNewSurvey(town, code, surveyToDB);

                dispatch( uiOpenSuccessAlert() );
                dispatch( startLoadingSurveys(town));
            } catch (error) {
                throw new Error(error);
            }
        }
    } 
}

// Cargar encuestas por municipio
export const startLoadingSurveys = ( town: string ) => {
    return async(dispatch: any) => {
        const resp = await getSurveys(town);
        const surveys:any[] = [];

        resp.forEach( resp => {
            surveys.push(surveyDTO(resp));
        });
        dispatch( setSurveys(surveys) );
    }
};

export const setSurveys = (surveys: Survey[]) => ({
    type: types.surveysLoad,
    payload: surveys
});

