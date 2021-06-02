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
        authorizationFormats: survey.formatosAutorizacion,
        surveyors: survey.encuestadores,
        idTown: survey.idMunicipio,
        chapters: survey.chapters
    }

    return surveyorFromDB;
}

export const capituloDTO = (chapter: Partial<Chapter>) => {
    const chapterToDB = {
        titulo: chapter.name,
        numero: chapter.number,
    }

    return chapterToDB;
}

export const chapterDTO = ( chapter: any ) => {
    const chapterFromDB = {
        id: chapter.id,
        name: chapter.titulo,
        number: chapter.numero,
        questions: chapter.questions,
    }

    return chapterFromDB;
}

export const preguntaDTO = ( question: any, directedTo: string ) => {
    const questionToDB = {
        pregunta: question.question,
        dirigida: directedTo,
        tipo: question.type,
        graficar: question.chart,
        opciones: question.options,
    }

    return questionToDB;
}

export const questionDTO = ( question: any ) => {
    const questionFromDB = {
        id: question.id,
        question: question.pregunta,
        directedTo: question.dirigida,
        type: question.tipo,
        chart: question.graficar,
        options: question.opciones,
    }

    return questionFromDB;
}


