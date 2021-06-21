import { CitizensAction, CitizenState, types } from '../types/types';

const initialState = {
    citizens: [],
    surveysAnswered: [],
    activeCitizen: null,
}

export const citizensReducer = ( state: CitizenState = initialState, action: CitizensAction) => {
    switch (action.type) {

        case types.citizensLoad:
            return {
                ...state,
                citizens: [...action.payload]
            }
        
        case types.citizensLoadSurveysAnswered:
            return {
                ...state,
                surveysAnswered: [...action.payload]
            }
        
        case types.citizenActive:
            return {
                ...state,
                activeCitizen: {
                    ...action.payload
                }
            }
        
        case types.citizenCleanActive:
            return {
                ...state,
                activeCitizen: null
            }
        
        default:
            return state;
    }
}