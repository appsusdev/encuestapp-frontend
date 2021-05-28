export enum TypeUser {
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
    SURVEYOR = 'ENCUESTADOR',
}

export enum TypeDoc {
    CC = 'CC',
    CE = 'CE',
    PASSPORT = 'Pasaporte',
}

export enum TypeQuestion {
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

export enum TypeDirectedTo {
    HOGAR = 'Al hogar',
    INDIVIDUAL = 'A cada persona'
}