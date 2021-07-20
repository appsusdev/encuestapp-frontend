import { db } from "../../config/firebase/firebase-config";
import { encuestadorDTO, surveyorDTO } from "../../helpers/surveyorDTO";
import { Survey } from "../../interfaces/Survey";
import { Surveyor } from "../../interfaces/Surveyor";
import {
  registerWithEmailPassword,
  uploadFileAsync,
} from "../../services/firebase/auth";
import {
  existsSurveyor,
  addSurveyorToTown,
  getSurveyors,
  editSurveyor,
  assignSurvey,
} from "../../services/firebase/surveyors";
import { types } from "../types/types";
import { startLoadingDataSurveys, startLoadingCompleteSurveys } from './surveysActions';
import { getAssignedSurveys } from '../../services/firebase/surveyors';
import firebase from 'firebase/app';
import { getTransmittedSurveysBySurveyor } from '../../services/firebase/surveyors';
import {
  uiOpenSuccessAlert,
  uiOpenErrorAlert,
  uiOpenModalAlert
} from "./uiActions";

// Agregar nuevo encuestador
export const startNewSurveyor = (surveyor: Partial<Surveyor>) => {
  return async (dispatch: any, getState: any) => {
    const { auth } = getState();
    const { document, email, profileImage } = surveyor;

    if (profileImage) {
      const uriResponse = await uploadFileAsync(
        profileImage as File,
        `avatars/${email}`
      );
      surveyor.profileImage = uriResponse;
    } else {
      surveyor.profileImage = null;
    }

    const existsSurveyorDB = await existsSurveyor(email);
    dispatch(surveyorFromDB(existsSurveyorDB));
    const townsAdmin: string[] = auth.municipios;
    const userToDB = encuestadorDTO(surveyor, existsSurveyorDB, townsAdmin);

    if (existsSurveyorDB) {
      const townsSurveyor: string[] = existsSurveyorDB.municipios;

      townsAdmin.forEach((town: string) => {
        // Encuestador esta registrado o no en el municipio
        if (townsSurveyor.includes(town)) return dispatch(uiOpenErrorAlert());
        else return dispatch(uiOpenModalAlert());
      });
    } else {
      try {
        // Registrar encuestador correo y contrasena
        email &&
          document &&
          (await registerWithEmailPassword(email, document.toString()));

        // Agregar en coleccion Usuarios
        await db.collection("Usuarios").doc(`${email}`).set(userToDB);

        // Agregar encuestador a coleccion Municipios
        const surveyorTown = { email: email, encuestasAsignadas: [] };
        await addSurveyorToTown(townsAdmin, email, surveyorTown);
        dispatch(uiOpenSuccessAlert());
        dispatch(startLoadingSurveyors(townsAdmin[0]));
      } catch (error) {
        throw new Error(error);
      }
    }
  };
};

const surveyorFromDB = (surveyor: any) => ({
  type: types.surveyorFromDB,
  payload: surveyor,
});

// Cargar encuestadores por municipio
export const startLoadingSurveyors = (town: string) => {
  return async (dispatch: any) => {
    const resp = await getSurveyors(town);
    const surveyors: any[] = [];

    resp.forEach((resp) => {
      surveyors.push(surveyorDTO(resp));
    });
    dispatch(setSurveyors(surveyors));
  };
};

export const setSurveyors = (surveyors: any[]) => ({
  type: types.surveyorsLoad,
  payload: surveyors,
});

// Encuestador activo
export const activeSurveyors = (id: string | undefined, surveyor: {}) => ({
  type: types.surveyorActive,
  payload: {
    id,
    ...surveyor,
  },
});

export const cleanActiveSurvey = () => ({ type: types.surveyCleanActive });

// Editar encuestador
export const startEditSurveyor = (surveyor: Partial<Surveyor>, changeImage: boolean) => {
    return async(dispatch: any, getState: any) => {
        const { municipios } = getState().auth;
        const { email, profileImage } = surveyor;
        if( changeImage ) {
          const uriResponse = await uploadFileAsync(
            profileImage as File,
            `avatars/${email}`
          );
          surveyor.profileImage = uriResponse;
        } 

        const userToDB = encuestadorDTO(surveyor)
        delete userToDB.municipios;

        dispatch( activeSurveyors(surveyor.email, {...surveyor}))
        await editSurveyor(userToDB);
        dispatch( uiOpenSuccessAlert());
        await dispatch( startLoadingSurveyors(municipios[0]))
    }
}

// Asignar y eliminar encuestas al encuestador
export const startAssignSurvey = (id: string, email: string, action: boolean) => {
    return async(dispatch: any, getState: any) => {
        const { dataSurveys } = getState().survey;
        const { assignedSurveys: surveys } = getState().surveyor;
        const { municipios } = getState().auth;
        const town: string = municipios[0];
      
        const arraySurveys = surveys.filter( (survey: any)  => survey.email  === email );
        const { assignedSurveys } = arraySurveys[0];
        const arraySurveyors = dataSurveys.filter( (survey: Survey) => survey.code === id)
        const { surveyors } = arraySurveyors[0];
        let newAssignedSurveys: string[] = [];
        let newSurveyors: string[] = [];

        if(action) {
            // Asignar encuesta
            if(surveyors.includes(email)) {
                dispatch( uiOpenErrorAlert() );
            } else {
                newAssignedSurveys = (assignedSurveys) ? [...assignedSurveys, id] : [id]      
                newSurveyors = (surveyors) ? [...surveyors, email] : [email]       
                
                await assignSurvey(town, id, newSurveyors, email, newAssignedSurveys);
                dispatch( uiOpenSuccessAlert() );
                await dispatch(startLoadingDataSurveys(town));
                await dispatch(startLoadingAssignedSurveys(town));
                await dispatch(startLoadingCompleteSurveys(town));
            }
        } else {
            // Eliminar encuesta asignada
            newAssignedSurveys = assignedSurveys.filter((survey: string) => survey !== id);
            newSurveyors = surveyors.filter((surveyor: string) => surveyor !== email);

            await assignSurvey(town, id, newSurveyors, email, newAssignedSurveys);
            dispatch( uiOpenSuccessAlert() );
            await dispatch(startLoadingDataSurveys(town));
            await dispatch(startLoadingAssignedSurveys(town));
            await dispatch(startLoadingCompleteSurveys(town));
        }
    }
}

// Cargar coleccion de encuestadores con sus encuestas asignadas
export const startLoadingAssignedSurveys = (town: string) => {
  return async (dispatch: any) => {

    const resp = await getAssignedSurveys(town);
    dispatch(setAssignedSurveys(resp));
  };
};

export const setAssignedSurveys = (surveyors: any[]) => ({
  type: types.surveyorsLoadAssignedSurveys,
  payload: surveyors,
});

// MICRODATA
export const startLoadingMicrodata = (data: any) => {
  return async (dispatch: Function, getState: Function) => {
    const { auth } = getState();
    const { surveys } = getState().survey;
    const town = auth.municipios[0];
    const { survey, surveyor } = data;
    const idSurveys: string[] = [];
    const idResponsibleCitizen: any[] = [];

    // Manejo de fechas
    let date1 = new Date(data.startDate);
    date1.setDate(date1.getDate());
    let date2 = new Date(data.endDate);
    date2.setDate(date2.getDate()+1);

    const startDate =  firebase.firestore.Timestamp.fromDate(new Date(date1));
    const endDate =  firebase.firestore.Timestamp.fromDate(new Date(date2));

    // Obtener respuestas transmitidas
    let resp = await getTransmittedSurveysBySurveyor(town, survey, surveyor, startDate, endDate);

    if(resp.length === 0){
      dispatch( setTransmittedSurveys([]) );
      dispatch( setInfoTransmittedSurveys([]) );
      dispatch( setIdResponsibleCitizens([]));
    } else {
      dispatch( setInfoTransmittedSurveys(resp) );
      resp.forEach((survey) => {idSurveys.push(survey.idEncuesta); idResponsibleCitizen.push(survey.id)});
      dispatch( setIdResponsibleCitizens(idResponsibleCitizen));
      const newSurveys = surveys.filter( (survey: Partial<Survey>) => (survey.idSurvey) && idSurveys.includes(survey.idSurvey));
      dispatch( setTransmittedSurveys(newSurveys) );
    }
    
  };
};

export const setTransmittedSurveys = (surveys: any[]) => ({
  type: types.surveyorsTransmittedSurveys,
  payload: surveys,
});

export const setInfoTransmittedSurveys = (surveys: any[]) => ({
  type: types.surveyorsInfoTransmittedSurveys,
  payload: surveys,
});

export const setIdResponsibleCitizens = (ids: any[]) => ({
  type: types.surveyorsIdResponsibleCitizens,
  payload: ids,
});



