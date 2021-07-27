import { CitizensAction, CitizenState, types } from '../types/types';

const initialState = {
    citizens: [],
    surveysAnswered: [],
    activeCitizen: null,
    mapData: {
        lat: 4.3628,
        lng: -73.8432,
        zoom: 4.06
    },
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
        
        case types.citizensLoadMapData:
            return {
                ...state,
                mapData: {
                    ...action.payload
                }
            }
        
        default:
            return state;
    }
}