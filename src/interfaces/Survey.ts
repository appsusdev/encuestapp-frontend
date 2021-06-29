import { TypeQuestion, TypeDirectedTo } from '../enums/enums';

export interface Survey {
    idSurvey: string,
    code: string,
    name: string,
    creationDate: string,
    state: boolean,
    authorizationFormats: null | string[],
    surveyors: string[],
    idTown: string,
    chapters: Chapter[] 
}

export interface SurveyQuestion {
    id: string;
    question: string;
    directedTo: string | TypeDirectedTo;
    chart?: boolean;
    type: TypeQuestion;
    options?: QuestionOptions[] | null;
    answers: ISurveyAnswers[] 
    othersAnswers?: any[] | ISurveyAnswers[] |ISurveyAnswers
}
export interface QuestionOptions {
    label: string;
    value?: number;
    description?: boolean;
    textDescription?: string;
    typeDescription?: Partial<TypeQuestion>
}

export interface Chapter {
    id: string;
    number: number | string;
    name: string;
    questions: SurveyQuestion[],
}

// export interface IAnswerWithDescription {
//     value: string | number | answerFile | readonly string[] | undefined;
//     description: string | null;
// }

// type answer = IAnswerWithDescription[] | IAnswerWithDescription;

export interface ISurveyAnswers {
    respuesta: any;
    citizen: string;
}

export type answerFile = {
    fileName: string;
    path: string;
    readableSize: string;
    size: number;
    type: string;
    uri: string;
};