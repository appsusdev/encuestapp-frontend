import { db } from '../../config/firebase/firebase-config';
import { TypeUser } from '../../enums/enums';
import { Surveyor } from '../../interfaces/Surveyor';
import { registerWithEmailPassword } from '../../services/firebase/auth';
import { existsSurveyor, addSurveyorToTown } from '../../services/firebase/surveyors';
import { types } from '../types/types';
import { uiOpenAlert, uiOpenSuccessAlert, uiOpenErrorAlert } from './uiActions';

export const startNewSurveyor = (surveyor: Partial<Surveyor>) => {
    return async(dispatch: any, getState: any) => {

        const { auth } = getState();

        const { firstName, secondName, firstLastName, secondLastName, document, email, address, profileImage, mobilePhone } = surveyor;
        
        // const fileName = profileImage?.split('\\').pop()?.split('.').slice(0,-1).join('.');
        // (profileImage && fileName ) && await uploadFileAsync(profileImage, fileName);
        const existsSurveyorDB = await existsSurveyor(email);
        dispatch( surveyorFromDB(existsSurveyorDB) );
        const townsAdmin: string[] = auth.municipios;

        const userDB = {
            id: (existsSurveyorDB)? existsSurveyorDB.id : email,
            activo: false,
            nombres: `${firstName} ${secondName}`.trim(),
            apellidos: `${firstLastName} ${secondLastName}`.trim(),
            identificacion: Number(document),
            email,
            direccion: address,
            avatar: profileImage,
            celular: Number(mobilePhone),
            rol: TypeUser.SURVEYOR,
            municipios: auth.municipios
        }

        if(existsSurveyorDB) {
            const townsSurveyor: string[] = existsSurveyorDB.municipios;
            
            townsAdmin.forEach( (town: string) => {
                // Encuestador esta registrado o no en el municipio
                if( townsSurveyor.includes(town) )
                return dispatch(uiOpenErrorAlert());
                else
                return dispatch(uiOpenAlert());
            });
            
        } else {
            try {
                // Registrar encuestador correo y contrasena
                (email && document ) && await registerWithEmailPassword(email, document.toString());
                
                // Agregar en coleccion Usuarios
                await db.collection('Usuarios').doc(`${email}`).set(userDB);
    
                //Agregar encuestador a coleccion Municipios
                const surveyorTown = { email: email, encuestasAsignadas: [] }
                await addSurveyorToTown(townsAdmin, email, surveyorTown);
                    
                dispatch(uiOpenSuccessAlert());   
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

const surveyorFromDB = (surveyor: any) => ({ 
    type: types.surveyorFromDB,
    payload: surveyor
});