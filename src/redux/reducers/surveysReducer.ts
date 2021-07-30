import { types, SurveysAction, ISurvey } from '../types/types';
import { Survey } from '../../interfaces/Survey';

const initialState = {
    surveys: [],
    activeSurvey: null,
    chapters: [],
    activeChapter: null,
    activeQuestion: null,
    chapterQuestion: null
}

export const surveysReducer = ( state: ISurvey = initialState, action: SurveysAction ) => {
    switch (action.type) {

        case types.surveysCompleteLoad:
            return {
                ...state,
                surveys: [...action.payload]
            }
            
        case types.surveyAddNew:
            return {
                ...state,
                surveys: [...state.surveys, action.payload]
            }

        case types.surveyUpdated:
            return {
                ...state,
                surveys: state.surveys.map(
                    (survey: Partial<Survey>) => survey.idSurvey === action.payload.idSurvey
                        ? action.payload
                        : survey
                )
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

        case types.questionActive:
            return {
                ...state,
                activeQuestion: {
                    ...action.payload
                }
            }

        case types.questionCleanActive:
            return {
                ...state,
                activeQuestion: null
            }

        case types.chapterQuestionActive:
            return {
                ...state,
                chapterQuestion: {
                    ...action.payload
                }
            }

        case types.chapterQuestionCleanActive:
            return {
                ...state,
                chapterQuestion: null
            }
    
    
        default:
            return state;
    }
}