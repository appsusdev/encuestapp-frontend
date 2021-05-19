import { TypeUser } from '../enums/enums';
import { Surveyor } from '../interfaces/Surveyor';

export const encuestadorDTO = (surveyor: Partial<Surveyor>, existsSurveyorDB?: any, municipios?: string[]) => {
    let { firstName, secondName, firstLastName, secondLastName, document, email, address, profileImage, mobilePhone, typeDoc } = surveyor;
    if(secondName?.trim()){
        secondName = ` ${secondName}`;
    }
    if(secondLastName?.trim()){
        secondLastName = ` ${secondLastName}`;
    }

    const surveyorToDB = {
        id: (existsSurveyorDB)? existsSurveyorDB.id : email,
        activo: false,
        primerNombre: firstName,
        segundoNombre: secondName?.trim(),
        primerApellido: firstLastName,
        segundoApellido: secondLastName?.trim(),
        nombreCompleto: `${firstName}${secondName} ${firstLastName} ${secondLastName}`.trim() ,
        identificacion: Number(document),
        tipoDocumento: typeDoc,
        email,
        direccion: address,
        avatar: profileImage,
        celular: Number(mobilePhone),
        rol: TypeUser.SURVEYOR,
        municipios: municipios
    }

    return surveyorToDB;
}

export const surveyorDTO = (surveyor: any) => {
    const surveyorFromDB = {
        id: surveyor.id,
        typeDoc: surveyor.tipoDocumento,
        document: surveyor.identificacion,
        firstName: surveyor.primerNombre,
        secondName: surveyor.segundoNombre,
        firstLastName: surveyor.primerApellido,
        secondLastName: surveyor.segundoApellido,
        username: surveyor.nombreCompleto,
        email: surveyor.email,
        mobilePhone: surveyor.celular,
        address: surveyor.direccion,
        profileImage: surveyor.avatar,
        state: surveyor.activo,
    }

    return surveyorFromDB;
}