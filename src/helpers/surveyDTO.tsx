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
    }

    return chapterToDB;
}

export const chapterDTO = ( chapter: any ) => {

    const questionsFromDB = chapter.questions;
    const questions:any[] = [];

    questionsFromDB.forEach( (question: any) => {
        questions.push(questionDTO(question));
    });

    const chapterFromDB = {
        id: chapter.id,
        name: chapter.titulo,
        number: chapter.numero,
        questions: questions,
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
        departamento: question.department,
        municipio: question.town,
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
        department: question.departamento,
        town: question.municipio,
    }

    return questionFromDB;
}


