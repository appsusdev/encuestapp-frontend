import { db } from '../../config/firebase/firebase-config';
import { encuestadorDTO, surveyorDTO } from '../../helpers/surveyorDTO';
import { Surveyor } from '../../interfaces/Surveyor';
import { registerWithEmailPassword } from '../../services/firebase/auth';
import { existsSurveyor, addSurveyorToTown, getSurveyors, editSurveyor, assignSurvey } from '../../services/firebase/surveyors';
import { types } from '../types/types';
import { uiOpenSuccessAlert, uiOpenErrorAlert, uiOpenModalAlert } from './uiActions';
import { Survey } from '../../interfaces/Survey';
import { startLoadingSurveys } from './surveysActions';

// Agregar nuevo encuestador 
export const startNewSurveyor = (surveyor: Partial<Surveyor>) => {
    return async(dispatch: any, getState: any) => {

        const { auth } = getState();
        const { document, email } = surveyor;
        
        // const fileName = profileImage?.split('\\').pop()?.split('.').slice(0,-1).join('.');
        // (profileImage && fileName ) && await uploadFileAsync(profileImage, fileName);
        const existsSurveyorDB = await existsSurveyor(email);
        dispatch( surveyorFromDB(existsSurveyorDB) );
        const townsAdmin: string[] = auth.municipios;
        const userToDB = encuestadorDTO(surveyor, existsSurveyorDB, townsAdmin);

        if(existsSurveyorDB) {
            const townsSurveyor: string[] = existsSurveyorDB.municipios;
            
            townsAdmin.forEach( (town: string) => {
                // Encuestador esta registrado o no en el municipio
                if( townsSurveyor.includes(town) )
                return dispatch(uiOpenErrorAlert());
                else
                return dispatch(uiOpenModalAlert());
            });
            
        } else {
            try {
                // Registrar encuestador correo y contrasena
                (email && document ) && await registerWithEmailPassword(email, document.toString());
                
                // Agregar en coleccion Usuarios
                await db.collection('Usuarios').doc(`${email}`).set(userToDB);
    
                // Agregar encuestador a coleccion Municipios
                const surveyorTown = { email: email, encuestasAsignadas: [] }
                await addSurveyorToTown(townsAdmin, email, surveyorTown);
                    
                dispatch(uiOpenSuccessAlert());
                await dispatch( startLoadingSurveyors(townsAdmin[0]));   
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

// Cargar encuestadores por municipio
export const startLoadingSurveyors = ( town: string ) => {
    return async(dispatch: any) => {
        const resp = await getSurveyors(town);
        const surveyors:any[] = [];

        resp.forEach( resp => {
            surveyors.push(surveyorDTO(resp));
        });
        dispatch( setSurveyors(surveyors) );
    }
};

export const setSurveyors = (surveyors: any[]) => ({
    type: types.surveyorsLoad,
    payload: surveyors
});

// Encuestador activo
export const activeSurveyors = (id: string | undefined, surveyor: {}) => ({
    type: types.surveyorActive,
    payload: {
        id, 
        ...surveyor
    }
});

export const cleanActiveSurvey = () => ({ type: types.surveyCleanActive });

// Editar encuestador
export const startEditSurveyor = (surveyor: Partial<Surveyor>) => {
    return async(dispatch: any) => {
        const userToDB = encuestadorDTO(surveyor)
        delete userToDB.municipios;
        
        await editSurveyor(userToDB);
        dispatch( uiOpenSuccessAlert());
    }
}

// Asignar y eliminar encuestas al encuestador
export const startAssignSurvey = (id: string, email: string, action: boolean) => {
    return async(dispatch: any, getState: any) => {
        const { surveys } = getState().survey;
        const { municipios } = getState().auth;
        const town: string = municipios[0];

        const array = surveys.filter( (survey: Survey) => survey.code === id)
        const { surveyors } = array[0];
        let newSurveyors: string[] = [];

        if(action) {
            // Asignar encuesta
            if(surveyors.includes(email)) {
                dispatch( uiOpenErrorAlert() );
            } else {
                newSurveyors = (surveyors) ? [...surveyors, email] : [email]       
                
                await assignSurvey(town, id, newSurveyors);
                await dispatch(startLoadingSurveys(town));
                dispatch( uiOpenSuccessAlert() );
            }
        } else {
            // Eliminar encuesta asignada
            newSurveyors = surveyors.filter((surveyor: string) => surveyor !== email);

            await assignSurvey(town, id, newSurveyors);
            await dispatch(startLoadingSurveys(town));
        }
    }
}





