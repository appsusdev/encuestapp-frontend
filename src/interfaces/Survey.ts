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
}

export interface SurveyQuestion {
    id: string;
    question: string;
    directedTo: TypeDirectedTo;
    chart?: boolean;
    type: TypeQuestion;
    options?: QuestionOptions[] | null;
    department: boolean;
    town: boolean;
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