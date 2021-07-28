import { Surveyor } from '../../interfaces/Surveyor';
import { SurveyorsAction, types } from '../types/types';
const initialState = {
    surveyors: [],
    activeSurveyor: null,
    assignedSurveys: [],
    surveyorFromDB: null,
    surveysTransmitted: [],
    infoSurveysTransmitted: [],
    idResponsibleCitizens: []
}

export const surveyorsReducer = ( state = initialState, action: SurveyorsAction ) => {
    switch (action.type) {
        case types.surveyorAddNew:
            return {
                ...state,
                surveyors: [...state.surveyors, action.payload]
            }

        case types.surveyorUpdated:
            return {
                ...state,
                surveyors: state.surveyors.map(
                    (surveyor: Partial<Surveyor>) => surveyor.id === action.payload.id
                        ? action.payload
                        : surveyor
                )
            }
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
        
        case types.surveyorsLoadAssignedSurveys:
            return {
                ...state,
                assignedSurveys: [...action.payload]
            }

        case types.surveyorsTransmittedSurveys:
            return {
                ...state,
                surveysTransmitted: [...action.payload]
            }

        case types.surveyorsInfoTransmittedSurveys:
            return {
                ...state,
                infoSurveysTransmitted: [...action.payload]
            }

        case types.surveyorsIdResponsibleCitizens:
            return {
                ...state,
                idResponsibleCitizens: [...action.payload]
            }
    
        default:
            return state;
    }
}