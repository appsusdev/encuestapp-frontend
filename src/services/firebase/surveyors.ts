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

  await df
    .collection("Encuestadores")
    .doc(email)
    .set(surveyorTown, { merge: true });
};

// Actualizar municipios del encuestador
export const updateTowns = async (
  email: string | undefined,
  surveyorTowns: {}
) => {
  await db
    .collection("Usuarios")
    .doc(`${email}`)
    .set(surveyorTowns, { merge: true });
};

// Get encuestadores por municipio
export const getSurveyors = async (town: string, nit: string) => {
  const surveyorsSnap = await db
    .collection("Usuarios")
    .where("rol", "==", TypeUser.SURVEYOR)
    .where("municipios", "array-contains", town)
    .where("entidad", "==", nit)
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
  await db
    .collection("Usuarios")
    .doc(surveyor.id)
    .set(surveyor, { merge: true });
};

// Asignar o eliminar encuestas al encuestador
export const assignSurvey = async (
  town: string,
  idSurvey: string,
  newSurveyors: string[],
  email: string,
  newAssignedSurveys: string[]
) => {
  await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey)
    .set({ encuestadores: [...newSurveyors] }, { merge: true });

  await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestadores")
    .doc(email)
    .set({ encuestasAsignadas: [...newAssignedSurveys] }, { merge: true });
};

// Obtener coleccion de encuestadores con sus encuestas asignadas
export const getAssignedSurveys = async (town: string, nit: string) => {
  const surveyorsSnap = await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestadores")
    .where("idEntidad", "==", nit)
    .get();
  const resp: any[] = [];

  surveyorsSnap.forEach((snap) => {
    resp.push({
      id: snap.id,
      email: snap.data().email,
      assignedSurveys: snap.data().encuestasAsignadas,
    });
  });

  return resp;
};

// Obtener encuestas transmitidas por el encuestador
export const getTransmittedSurveysBySurveyor = async (
  town: string,
  idSurvey: string,
  idSurveyor: string,
  startDate: any,
  endDate: any
):Promise<any[]> => {
  let surveysSnap;

  idSurveyor === "Todos"
    ? (surveysSnap = await db
        .collectionGroup("EncuestasTransmitidas")
        .where("municipio", "==", town)
        .where("idEncuesta", "==", idSurvey)
        .where("fechaDeCarga", ">", startDate)
        .where("fechaDeCarga", "<=", endDate)
        .limit(4)
        .get())
    : (surveysSnap = await db
        .collectionGroup("EncuestasTransmitidas")
        .where("municipio", "==", town)
        .where("idEncuesta", "==", idSurvey)
        .where("idEncuestador", "==", idSurveyor)
        .where("fechaDeCarga", ">", startDate)
        .where("fechaDeCarga", "<=", endDate)
        .limit(4)
        .get());

  const surveys: any[] = [];

  surveysSnap.forEach((snap) => {
    surveys.push({
      id: snap.id,
      ...snap.data(),
    });
  });
  return surveys;
};

// Asignar o eliminar encuestas al encuestador
export const changeAssignedSurveys = async (
  email: string,
  nit: string,
  idSurvey: string,
  newAssignedSurveys: string[]
) => {
  const docRef = await db
    .collectionGroup("Encuestadores")
    .where("email", "==", email)
    .where("encuestasAsignadas", "array-contains", idSurvey)
    .where("idEntidad", "==", nit)
    .get();

  docRef.forEach(async (snap) => {
    await snap.ref.set(
      { encuestasAsignadas: [...newAssignedSurveys] },
      { merge: true }
    );
  });
};

// Verificar si el encuestador ha transmitido o no encuestas para poder eliminarlo
export const existsTransmittedSurveys = async (
  idEntity: string,
  idSurveyor: string
) => {
  const transmittedSnap = await db
    .collectionGroup("EncuestasTransmitidas")
    .where("idEntidad", "==", idEntity)
    .where("idEncuestador", "==", idSurveyor)
    .get();
  const transmitted: any[] = [];

  transmittedSnap.forEach((snap) => {
    transmitted.push({
      id: snap.id,
      ...snap.data(),
    });
  });
  return transmitted;
};

// Eliminar encuestador
export const deleteSurveyorFirebase = async (
  town: string,
  idSurveyor: string
) => {
  await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestadores")
    .doc(idSurveyor)
    .delete();
};

export const deleteUserFirebase = async (idSurveyor: string) => {
  await db.collection("Usuarios").doc(idSurveyor).delete();
};

// Obtener respuestas del ciudadano buscado
export const getAnswersBySurveyor = async (
  town: string,
  idSurvey: string,
  idChapter: string,
  typeQuestion: string,
  idQuestion: string,
  idSurveyor: string,
  idResponsibleCitizens?: string
) => {
  const docRef = db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .doc(idChapter)
    .collection(typeQuestion)
    .doc(idQuestion)
    .collection("Respuestas");
  let answersRef;
  if (typeQuestion === "PreguntasHogar" && idResponsibleCitizens) {
    idSurveyor === "Todos"
      ? (answersRef = await docRef
          .where("idEncuestaCiudadano", "==", idResponsibleCitizens)
          .limit(1)
          .get())
      : (answersRef = await docRef
          .where("idEncuestador", "==", idSurveyor)
          .where("idEncuestaCiudadano", "==", idResponsibleCitizens)
          .limit(1)
          .get());
  } else {
    idSurveyor === "Todos"
      ? (answersRef = await docRef.get())
      : (answersRef = await docRef
          .where("idEncuestador", "==", idSurveyor)
          .get());
  }

  const answers: any[] = [];
  answersRef.forEach((resp: any) => {
    answers.push({ citizen: resp.id, ...resp.data() });
  });

  return answers;
};
