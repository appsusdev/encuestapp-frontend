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
    DEPARTMENT='DEPARTMENT',
    TOWN='TOWN'
}

export enum TypeDirectedTo {
    HOGAR = 'Al hogar',
    INDIVIDUAL = 'A cada persona'
}
export enum TypeDocEnum {
    CC = 1,
    TI = 2,
    CE = 3,
    RC = 4,
    NIT = "NIT",
    Otro = "Otro",
  }
  export enum GenderEnum {
    Women,
    Men,
  }