import { Chapter, Survey } from '../../interfaces/Survey';
import { existsSurvey, getSurveys, addNewSurvey, editSurvey, existsChapter, addNewChapter, deleteChapter, editChapter, addQuestion, editQuestion, getChapters, deleteQuestion, getSurveysAndChapters } from '../../services/firebase/surveys';
import { encuestaDTO, capituloDTO, preguntaDTO, surveyDTO } from '../../helpers/surveyDTO';
import { uiOpenErrorAlert, uiOpenSuccessAlert, uiOpenModalAlert, uiCloseQuestion } from './uiActions';
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

                await dispatch( startLoadingCompleteSurveys(town));
                dispatch( uiOpenSuccessAlert() );
            } catch (error) {
                throw new Error(error);
            }
        }
    } 
}

// Cargar solo informacion de la encuesta
export const startLoadingDataSurveys = ( town: string, flag?: boolean ) => {
    return async(dispatch: any) => {
        const resp = await getSurveys(town);
        const surveys:any[] = [];

        if(flag) {
            dispatch( startLoadingCompleteSurveys(town, resp) )
        }
        resp.forEach( resp => {
            surveys.push(surveyDTO(resp));
        });
        dispatch( setDataSurveys(surveys) );
    }
};


// Cargar encuestas por municipio
export const startLoadingCompleteSurveys = ( town: string, data?: any[] ) => {
    return async(dispatch: any) => {
        const surveys = await getSurveysAndChapters(town, data);

        await dispatch( setSurveys(surveys) );
    }
};

export const setSurveys = (surveys: Survey[]) => ({
    type: types.surveysCompleteLoad,
    payload: surveys
});

export const setDataSurveys = (surveys: Survey[]) => ({
    type: types.surveysDataLoad,
    payload: surveys
});

// Encuesta activa
export const activeSurvey = (survey: {} | null) => ({
    type: types.surveyActive,
    payload: survey
});

export const surveyCleanActive = () => ({type: types.surveyCleanActive});

// Editar encuesta
export const startEditSurvey = (survey: Partial<Survey>) => {
    return async(dispatch: any, getState: any) => {

        const { auth } = getState();
        const town = auth.municipios[0];
        
        try {
            await editSurvey(survey, town);
            await dispatch( startLoadingCompleteSurveys(town) );
            dispatch( uiOpenSuccessAlert() );
        } catch (error) {
            throw new Error(error);
        }
    }
}

// Agregar nuevo capítulo o editar capitulo
export const startNewChapter = (chapter: Partial<Chapter>, idSurvey: string, action: boolean, idChapter?: string) => {
    return async(dispatch: any, getState: any) => {
        const { auth } = getState();
        const { activeChapter } = getState().survey;
        const town = auth.municipios[0];
        const { name, number } = chapter;

        const existsChapterDB = await existsChapter(town, idSurvey, name);
        const chapterToDB = capituloDTO(chapter);
        
        if( existsChapterDB ) {
            if(action) {
                dispatch( uiOpenErrorAlert() );
            } else {
                if ( name === activeChapter.name) {
                    // Editar capitulo
                    (idChapter) && await editChapter(town, idSurvey, idChapter, chapterToDB);
                    dispatch( chapterActive({...activeChapter, name: name, number: number}))
                    await dispatch( uiOpenSuccessAlert() );
                    await dispatch( startLoadingCompleteSurveys(town) );
                    await dispatch( startLoadingChapters(town, idSurvey) );
                    
                } else {
                    dispatch( uiOpenErrorAlert() );
                }
            }
        } else {
            try {
                if(action) {
                    // Crear capitulo
                    await addNewChapter(town, idSurvey, chapterToDB);            
                } else {
                    // Editar capitulo
                    (idChapter) && await editChapter(town, idSurvey, idChapter, chapterToDB);
                    dispatch( chapterActive({...activeChapter, name: name, number: number}))
                }
                await dispatch( uiOpenSuccessAlert() );
                await dispatch( startLoadingCompleteSurveys(town) );
                await dispatch( startLoadingChapters(town, idSurvey) );
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

// Cargar capitulos por encuesta
export const startLoadingChapters = ( town: string, idSurvey: string ) => {
    return async(dispatch: any, getState: any) => {
        const { activeSurvey } = getState().survey;

        dispatch( setChapters(activeSurvey.chapters) );
        
    }
};

export const setChapters = (chapters: Chapter[]) => ({
    type: types.chaptersLoad,
    payload: chapters
});

// Eliminar capitulo en una encuesta
export const startDeleteChapter = ( idSurvey: string, idChapter: string ) => {
    return async(dispatch: any, getState: any) => {
        const { auth } = getState();
        const town = auth.municipios[0];

        await deleteChapter(town, idSurvey, idChapter);
        dispatch( uiOpenModalAlert() );
        await dispatch( startLoadingCompleteSurveys(town) );
        dispatch( chapterCleanActive() );
    }
}

// Capitulo activa
export const chapterActive = (chapter: {} | null) => ({
    type: types.chapterActive,
    payload: chapter
});

export const chapterCleanActive = () => ({type: types.chapterCleanActive});

// Agregar pregunta
export const startNewQuestion = (question: any, idSurvey: string) => {
    return async(dispatch: any, getState: any) => {
        const { auth, survey } = getState();
        const { surveys } = survey;
        const town = auth.municipios[0];
        const idChapter = question.chapter;
        let surveyFilter: Survey[] = surveys;

        const getSurvey = surveyFilter.filter( survey => survey.idSurvey === idSurvey);
        const getChapter = getSurvey[0].chapters.filter( chapter => chapter.id === question.chapter );
        const idQuestion = `pregunta${getChapter[0].questions.length + 1}_${Date.now()}`;

        let typeQuestion:string = '';
        (question.directedTo === 0) ? (typeQuestion = 'PreguntasIndividual') : (typeQuestion = 'PreguntasHogar')

        const questionToDB = preguntaDTO(question, typeQuestion);
        try {
            await addQuestion(town, idSurvey, idChapter, typeQuestion, questionToDB, idQuestion);
            dispatch( uiOpenSuccessAlert() );
            await dispatch( startLoadingCompleteSurveys(town) );
        } catch (error) {
            throw new Error(error);
        }
    }
}

// Pregunta activa
export const questionActive = (question: {} | null) => ({
    type: types.questionActive,
    payload: question
});

export const questionCleanActive = () => ({type: types.questionCleanActive});

// Capitulo de la pregunta activa
export const chapterQuestionActive = (chapter: {} | null) => ({
    type: types.chapterQuestionActive,
    payload: chapter
});

export const chapterQuestionCleanActive = () => ({type: types.chapterQuestionCleanActive});

// Editar
export const startEditQuestion = (question: any, idSurvey: string, idQuestion: string) => {
    return async(dispatch: any, getState: any) => {
        const { auth } = getState();
        const { activeSurvey: active } = getState().survey;
        const survey: Survey = active;
        const town = auth.municipios[0];
        const idChapter = question.chapter;

        let typeQuestion:string = '';
        (question.directedTo === 0) ? (typeQuestion = 'PreguntasIndividual') : (typeQuestion = 'PreguntasHogar')

        const questionToDB = preguntaDTO(question, typeQuestion);
        try {
            await editQuestion(town, idSurvey, idChapter, typeQuestion, idQuestion, questionToDB,);
            const chapters = await getChapters(town, idSurvey)
            dispatch( uiOpenSuccessAlert() );
            dispatch( activeSurvey({...survey, chapters: chapters}));
            dispatch( setChapters(chapters) );
            
        } catch (error) {
            throw new Error(error);
        }
        dispatch( uiCloseQuestion() );
        dispatch( questionCleanActive() );
        dispatch( chapterQuestionCleanActive() );
    }
}

// Eliminar pregunta
export const startDeleteQuestion = ( question: any, idChapter: string ) => {
    return async(dispatch: any, getState: any) => {
        const { auth } = getState();
        const { activeSurvey: active } = getState().survey;
        const survey: Survey = active;
        const town = auth.municipios[0];
        
        await deleteQuestion(town, survey.idSurvey, idChapter, question.directedTo, question.id);
        const chapters = await getChapters(town, survey.idSurvey)
        dispatch( uiOpenSuccessAlert() );
        dispatch( activeSurvey({...survey, chapters: chapters}));
        dispatch( setChapters(chapters) );
    }
}