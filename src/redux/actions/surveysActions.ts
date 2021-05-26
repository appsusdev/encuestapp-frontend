import { Chapter, Survey } from '../../interfaces/Survey';
import { existsSurvey, getSurveys, addNewSurvey, editSurvey, existsChapter, addNewChapter, getChapters, deleteChapter, editChapter } from '../../services/firebase/surveys';
import { encuestaDTO, surveyDTO, capituloDTO, chapterDTO } from '../../helpers/surveyDTO';
import { uiOpenErrorAlert, uiOpenSuccessAlert, uiOpenModalAlert } from './uiActions';
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

                await dispatch( startLoadingSurveys(town));
                dispatch( uiOpenSuccessAlert() );
            } catch (error) {
                throw new Error(error);
            }
        }
    } 
}

// Cargar encuestas por municipio
export const startLoadingSurveys = ( town: string ) => {
    return async(dispatch: any) => {
        const resp = await getSurveys(town);
        const surveys:any[] = [];

        resp.forEach( resp => {
            surveys.push(surveyDTO(resp));
        });
        await dispatch( setSurveys(surveys) );
    }
};

export const setSurveys = (surveys: Survey[]) => ({
    type: types.surveysLoad,
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
            await dispatch( startLoadingSurveys(town) );
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
        const { name } = chapter;

        const existsChapterDB = await existsChapter(town, idSurvey, name);
        const chapterToDB = capituloDTO(chapter);
        
        if( existsChapterDB ) {
            if(action) {
                dispatch( uiOpenErrorAlert() );
            } else {
                if ( name === activeChapter.name) {
                    // Editar capitulo
                    (idChapter) && await editChapter(town, idSurvey, idChapter, chapterToDB);
                    await dispatch( startLoadingChapters(town, idSurvey) );
                    await dispatch( uiOpenSuccessAlert() );
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
                }
                await dispatch( uiOpenSuccessAlert() );
                await dispatch( startLoadingChapters(town, idSurvey) );
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

// Cargar capitulos por encuesta
export const startLoadingChapters = ( town: string, idSurvey: string ) => {
    return async(dispatch: any) => {
        const resp = await getChapters(town, idSurvey);
        const chapters:any[] = [];

        resp.forEach( resp => {
            chapters.push(chapterDTO(resp));
        });
        await dispatch( setChapters(chapters) );
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
        await dispatch( startLoadingChapters(town, idSurvey) );
        dispatch( uiOpenModalAlert() );
        dispatch( chapterCleanActive() );
    }
}

// Capitulo activa
export const chapterActive = (chapter: {} | null) => ({
    type: types.chapterActive,
    payload: chapter
});

export const chapterCleanActive = () => ({type: types.chapterCleanActive});
