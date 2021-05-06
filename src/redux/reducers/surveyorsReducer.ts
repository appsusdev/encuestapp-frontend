import { SurveyorsAction, types } from '../types/types';
const initialState = {
    surveyors: [],
    activeSurveyor: null,
    surveyorFromDB: null
}

export const surveyorsReducer = ( state = initialState, action: SurveyorsAction ) => {
    switch (action.type) {
        case types.surveyorFromDB:
            return {
                ...state,
                surveyorFromDB: {...action.payload}
            }

        case types.surveyorsLoad:
            return {
                ...state,
                surveyors: [...action.payload]
            }

        case types.surveyorActive:
            return {
                ...state,
                activeSurveyor: {
                    ...action.payload
                }
            }
    
        default:
            return state;
    }
}