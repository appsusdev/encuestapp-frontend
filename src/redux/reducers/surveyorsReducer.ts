import { SurveyorsAction } from '../types/types';
const initialState = {
    surveyors: [],
    activeSurveyor: null
}

export const surveyorsReducer = ( state = initialState, action: SurveyorsAction ) => {
    switch (action.type) {
           
        default:
            return state;
    }
}