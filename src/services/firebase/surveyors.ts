import { db } from "../../config/firebase/firebase-config";
import { TypeUser } from "../../enums/enums";
import { Surveyor } from "../../interfaces/Surveyor";

// Verificar si existe encuestador en la BD
export const existsSurveyor = (
  email: string | null | undefined
): Promise<any> => {
  return db
    .collection("Usuarios")
    .where("rol", "==", TypeUser.SURVEYOR)
    .where("email", "==", email)
    .get()
    .then((snapShot) => {
      let users: any;
      snapShot.forEach((doc: any) => {
        users = {
          id: doc.id,
          ...(doc.data() as any),
        };
      });

      return users;
    })
    .catch((err) => console.log(err));
};

// Agregar encuestador a la colección Municipios
export const addSurveyorToTown = async (
  town: string,
  email: string | undefined,
  surveyorTown: {}
) => {
  
  const df = db.collection("Municipios").doc(town);
    
  await df.collection("Encuestadores").doc(email).set(surveyorTown, {merge: true});
  
};

// Actualizar municipios del encuestador
export const updateTowns = async (
  email: string | undefined,
  surveyorTowns: {}
) => {
  await db.collection("Usuarios").doc(`${email}`).set(surveyorTowns, {merge: true});
};

// Get encuestadores por municipio
export const getSurveyors = async (town: string) => {
  const surveyorsSnap = await db.collection("Usuarios")
    .where("rol", "==", TypeUser.SURVEYOR)
    .where("municipios", "array-contains", town)
    .get();
  const surveyors: any[] = [];

  surveyorsSnap.forEach((snap) => {
    surveyors.push({
      id: snap.id,
      ...snap.data(),
    });
  });

  return surveyors;
};

// Editar encuestador en tabla usuarios
export const editSurveyor = async (surveyor: Partial<Surveyor>) => {
  await db.collection('Usuarios').doc(surveyor.id).set(surveyor, {merge: true});
}

// Asignar o eliminar encuestas al encuestador 
export const assignSurvey = async (town: string, idSurvey: string, newSurveyors: string[], email: string, newAssignedSurveys: string[]) => {
  await db.collection('Municipios').doc(town).collection('Encuestas').doc(idSurvey)
    .set({encuestadores: [...newSurveyors]}, {merge: true});
  
  await db.collection('Municipios').doc(town).collection('Encuestadores').doc(email)
    .set({encuestasAsignadas: [...newAssignedSurveys]}, {merge: true});
}

// Obtener coleccion de encuestadores con sus encuestas asignadas
export const getAssignedSurveys = async (town: string) => {
  const surveyorsSnap = await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestadores")
    .get();
  const resp: any[] = [];

  surveyorsSnap.forEach((snap) => {
    resp.push({
      id: snap.id,
      email: snap.data().email,
      assignedSurveys: snap.data().encuestasAsignadas
    });
  });

  return resp;
}  

// Obtener encuestas transmitidas por el encuestador
export const getTransmittedSurveysBySurveyor = async (
  town: string,
  idSurvey: string,
  idSurveyor: string,
  startDate: any,
  endDate: any,
) => {
  let surveysSnap;

  (idSurveyor === "Todos") ?
  surveysSnap = await db
    .collectionGroup("EncuestasTransmitidas")
    .where("municipio", "==", town)
    .where("idEncuesta", "==", idSurvey)
    .where("fechaDeCarga", ">", startDate)
    .where("fechaDeCarga", "<=", endDate)
    .get()
  :
  surveysSnap = await db
    .collectionGroup("EncuestasTransmitidas")
    .where("municipio", "==", town)
    .where("idEncuesta", "==", idSurvey)
    .where("idEncuestador", "==", idSurveyor)
    .where("fechaDeCarga", ">", startDate)
    .where("fechaDeCarga", "<=", endDate)
    .get(); 

  const surveys: any[] = [];

  surveysSnap.forEach((snap) => {
    surveys.push({
      id: snap.id,
      ...snap.data(),
    });
  });
  return surveys;
};