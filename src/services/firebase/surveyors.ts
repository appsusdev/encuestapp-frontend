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
  townsAdmin: string[],
  email: string | undefined,
  surveyorTown: {}
) => {
  townsAdmin.forEach(async (townAdm: string) => {
    const df = await db.collection("Municipios").doc(townAdm);
    //df.set({});
    df.collection("Encuestadores").doc(email).set(surveyorTown);
  });
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