import { types, SurveysAction } from '../types/types';
const initialState = {
    surveys: [],
    activeSurvey: null,
}

export const surveysReducer = ( state = initialState, action: SurveysAction ) => {
    switch (action.type) {

        case types.surveysLoad:
            return {
                ...state,
                surveys: [...action.payload]
            }

        case types.surveyActive:
            return {
                ...state,
                activeSurvey: {
                    ...action.payload
                }
            }
    
        default:
            return state;
    }
}