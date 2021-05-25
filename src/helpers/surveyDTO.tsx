import { Chapter, Survey } from '../interfaces/Survey';

export const encuestaDTO = (survey: Partial<Survey>, town: string) => {
    const { code, name, creationDate, state } = survey;

    const surveyToDB = {
        idEncuesta: code,
        idMunicipio: town,
        formatosAutorizacion: null,
        encuestadores: [],
        titulo: name,
        fechaCreacion: creationDate,
        activo: state
    }

    return surveyToDB;
}

export const surveyDTO = (survey: any) => {
    const surveyorFromDB = {
        idSurvey: survey.idEncuesta,
        code: survey.idEncuesta,
        name: survey.titulo,
        creationDate: survey.fechaCreacion,
        state: survey.activo,
        authorizationFormats: survey.formatoAutorizacion,
        surveyors: survey.encuestadores,
        idTown: survey.idMunicipio
    }

    return surveyorFromDB;
}

export const capituloDTO = (chapter: Partial<Chapter>) => {
    const chapterToDB = {
        titulo: chapter.name,
        numero: chapter.number,
        index: chapter.index
    }

    return chapterToDB;
}

export const chapterDTO = ( chapter: any ) => {
    const chapterFromDB = {
        id: chapter.id,
        name: chapter.titulo,
        number: chapter.numero,
        index: chapter.index
    }

    return chapterFromDB;
}