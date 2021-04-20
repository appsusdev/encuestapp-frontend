export interface Survey {
    code: string,
    name: string,
    creationDate: string,
    state: boolean,
}

export interface SurveyQuestion {
    chapter: string;
    question: string;
    directedTo: DirectedToQuestion;
    chart?: boolean;
    type: TypeEnum;
    options?: QuestionOptions[] | null;
}

export enum TypeEnum {
    SELECT = 'SELECT',
    CHECK = 'CHECK',
    FILE = 'FILE',
    TEXT_INPUT = 'TEXT_INPUT',
    DATE = 'DATE',
    NUMBER = 'NUMBER',
    TEXT_AREA = 'TEXT_AREA',
    GEOLOCATION = 'GEOLOCATION',
    PICTURE = 'PICTURE',
    RADIO = 'RADIO',
    REGION = 'REGION'
}

export enum DirectedToQuestion {
    HOGAR,
    INDIVIDUAL
}

export interface QuestionOptions {
    label: string;
    value?: number;
    description?: boolean;
    textDescription?: string;
    typeDescription?: Partial<TypeEnum>
}