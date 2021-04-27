import { TypeDoc } from '../enums/enums';
export interface Surveyor {
    typeDoc: string,
    document: number | string,
    firstName: string,
    secondName: string,
    firstLastName: string,
    secondLastName: string,
    username: string,
    email: string,
    mobilePhone: number | string ,
    address: string,
    profileImage: string,
    state: boolean,
}