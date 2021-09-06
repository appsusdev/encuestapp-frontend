import firebase from "firebase/app";
import { db } from "../../config/firebase/firebase-config";

import { types } from "../types/types";
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
  getAssignedSurveys,
  getTransmittedSurveysBySurveyor,
} from "../../services/firebase/surveyors";
import {
  uiOpenSuccessAlert,
  uiOpenErrorAlert,
  uiOpenModalAlert,
} from "./uiActions";
import { updateSurvey } from "./surveysActions";

// Agregar nuevo encuestador
export const startNewSurveyor = (surveyor: Partial<Surveyor>) => {
  return async (dispatch: any, getState: any) => {
    const { auth } = getState();
    const { document, email, profileImage, firstName, firstLastName } =
      surveyor;
    let { secondName, secondLastName } = surveyor;

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
    const town: string = auth.municipio;
    const nit: string = auth.nit;
    let towns: string[] = [];
    towns.push(town);
    const userToDB = encuestadorDTO(surveyor, existsSurveyorDB, towns);

    if (existsSurveyorDB) {
      dispatch(uiOpenModalAlert());
    } else {
      try {
        // Registrar encuestador correo y contrasena
        email &&
          document &&
          (await registerWithEmailPassword(email, document.toString()));

        // Agregar en coleccion Usuarios
        await db
          .collection("Usuarios")
          .doc(`${email}`)
          .set({ ...userToDB, entidad: nit });

        // Agregar encuestador a coleccion Municipios
        const surveyorTown = {
          email: email,
          encuestasAsignadas: [],
          idEntidad: nit,
        };
        await addSurveyorToTown(town, email, surveyorTown);
        dispatch(uiOpenSuccessAlert());

        surveyor.id = email;
        surveyor.state = false;
        secondName?.trim() && (secondName = ` ${secondName}`);
        secondLastName?.trim() && (secondLastName = ` ${secondLastName}`);
        surveyor.username =
          `${firstName}${secondName} ${firstLastName} ${secondLastName}`.trim();
        surveyor.entity = nit;

        dispatch(addNewSurveyor(surveyor));
        dispatch(
          addNewAssignedSurveys({
            id: email,
            email,
            assignedSurveys: [],
            entity: nit,
          })
        );
      } catch (error: any) {
        throw new Error(error);
      }
    }
  };
};

const addNewSurveyor = (surveyor: any) => ({
  type: types.surveyorAddNew,
  payload: surveyor,
});

const addNewAssignedSurveys = (data: any) => ({
  type: types.surveyorsAddNewAssignedSurveys,
  payload: data,
});

const surveyorFromDB = (surveyor: any) => ({
  type: types.surveyorFromDB,
  payload: surveyor,
});

// Cargar encuestadores por municipio
export const startLoadingSurveyors = (town: string, nit: string) => {
  return async (dispatch: any) => {
    const resp = await getSurveyors(town, nit);
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

export const surveyorCleanActive = () => ({ type: types.surveyorCleanActive });

// Editar encuestador
export const startEditSurveyor = (
  surveyor: Partial<Surveyor>,
  changeImage: boolean
) => {
  return async (dispatch: any, getState: any) => {
    const { email, profileImage, firstName, firstLastName } = surveyor;
    let { secondName, secondLastName } = surveyor;

    if (changeImage) {
      const uriResponse = await uploadFileAsync(
        profileImage as File,
        `avatars/${email}`
      );
      surveyor.profileImage = uriResponse;
    }

    const userToDB = encuestadorDTO(surveyor);
    delete userToDB.municipios;
    secondName?.trim() && (secondName = ` ${secondName}`);
    secondLastName?.trim() && (secondLastName = ` ${secondLastName}`);
    surveyor.username =
      `${firstName}${secondName} ${firstLastName} ${secondLastName}`.trim();

    dispatch(activeSurveyors(surveyor.email, { ...surveyor }));

    await editSurveyor(userToDB);
    dispatch(updateSurveyor(surveyor));
    dispatch(uiOpenSuccessAlert());
  };
};

export const updateSurveyor = (surveyor: any) => ({
  type: types.surveyorUpdated,
  payload: surveyor,
});

// Asignar y eliminar encuestas al encuestador
export const startAssignSurvey = (
  id: string,
  email: string,
  action: boolean
) => {
  return async (dispatch: any, getState: any) => {
    const { surveys } = getState().survey;
    const { assignedSurveys: surveysBySurveyor } = getState().surveyor;
    const { municipio } = getState().auth;
    const town: string = municipio;

    const arraySurveys = surveysBySurveyor.filter(
      (survey: any) => survey.email === email
    );
    const { assignedSurveys } = arraySurveys[0];
    const arraySurveyors = surveys.filter(
      (survey: Survey) => survey.code === id
    );
    const { surveyors } = arraySurveyors[0];
    let newAssignedSurveys: string[] = [];
    let newSurveyors: string[] = [];

    if (action) {
      // Asignar encuesta
      if (surveyors.includes(email)) {
        dispatch(uiOpenErrorAlert());
      } else {
        newAssignedSurveys = assignedSurveys ? [...assignedSurveys, id] : [id];
        newSurveyors = surveyors ? [...surveyors, email] : [email];

        await assignSurvey(town, id, newSurveyors, email, newAssignedSurveys);
        dispatch(uiOpenSuccessAlert());
        dispatch(
          updateSurvey({ ...arraySurveyors[0], surveyors: newSurveyors })
        );
        dispatch(
          updateAssignedSurveys({
            id: email,
            email,
            assignedSurveys: newAssignedSurveys,
          })
        );
      }
    } else {
      // Eliminar encuesta asignada
      newAssignedSurveys = assignedSurveys.filter(
        (survey: string) => survey !== id
      );
      newSurveyors = surveyors.filter((surveyor: string) => surveyor !== email);

      await assignSurvey(town, id, newSurveyors, email, newAssignedSurveys);
      dispatch(uiOpenSuccessAlert());
      dispatch(updateSurvey({ ...arraySurveyors[0], surveyors: newSurveyors }));
      dispatch(
        updateAssignedSurveys({
          id: email,
          email,
          assignedSurveys: newAssignedSurveys,
        })
      );
    }
  };
};

// Cargar coleccion de encuestadores con sus encuestas asignadas
export const startLoadingAssignedSurveys = (town: string, nit: string) => {
  return async (dispatch: any) => {
    const resp = await getAssignedSurveys(town, nit);
    dispatch(setAssignedSurveys(resp));
  };
};

export const setAssignedSurveys = (surveyors: any[]) => ({
  type: types.surveyorsLoadAssignedSurveys,
  payload: surveyors,
});

//Actualizar encuestas asignadas al encuestador
export const updateAssignedSurveys = (data: any) => ({
  type: types.surveyorsUpdatedAssignedSurveys,
  payload: data,
});

// MICRODATA
export const startLoadingMicrodata = (data: any) => {
  return async (dispatch: Function, getState: Function) => {
    const { auth } = getState();
    const { surveys } = getState().survey;
    const town = auth.municipio;
    const { survey, surveyor } = data;
    const idSurveys: string[] = [];
    const idResponsibleCitizen: any[] = [];

    // Manejo de fechas
    let date1 = new Date(data.startDate);
    date1.setDate(date1.getDate());
    let date2 = new Date(data.endDate);
    date2.setDate(date2.getDate() + 1);

    const startDate = firebase.firestore.Timestamp.fromDate(new Date(date1));
    const endDate = firebase.firestore.Timestamp.fromDate(new Date(date2));

    // Obtener respuestas transmitidas
    let resp = await getTransmittedSurveysBySurveyor(
      town,
      survey,
      surveyor,
      startDate,
      endDate
    );

    if (resp.length === 0) {
      dispatch(setTransmittedSurveys([]));
      dispatch(setInfoTransmittedSurveys([]));
      dispatch(setIdResponsibleCitizens([]));
    } else {
      dispatch(setInfoTransmittedSurveys(resp));
      resp.forEach((survey) => {
        idSurveys.push(survey.idEncuesta);
        idResponsibleCitizen.push(survey.id);
      });
      dispatch(setIdResponsibleCitizens(idResponsibleCitizen));
      const newSurveys = surveys.filter(
        (survey: Partial<Survey>) =>
          survey.idSurvey && idSurveys.includes(survey.idSurvey)
      );
      dispatch(setTransmittedSurveys(newSurveys));
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
