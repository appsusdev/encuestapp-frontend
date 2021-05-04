import { TypeDoc } from '../enums/enums';
export interface Surveyor {
    id: string,
    typeDoc: string,
    document: string,
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