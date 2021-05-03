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
        default:
            return state;
    }
}