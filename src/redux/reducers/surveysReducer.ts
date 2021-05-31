import { types, SurveysAction } from '../types/types';

const initialState = {
    surveys: [],
    activeSurvey: null,
    chapters: [],
    activeChapter: null
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
        
        case types.surveyCleanActive:
            return {
                ...state,
                activeSurvey: null
            }
        
        case types.chaptersLoad:
            return {
                ...state,
                chapters: [...action.payload]
            }

        case types.chapterActive:
            console.log(action.payload)
            return {
                ...state,
                activeChapter: {
                    ...action.payload
                }
            }

        case types.chapterCleanActive:
            return {
                ...state,
                activeChapter: null
            }

    
        default:
            return state;
    }
}