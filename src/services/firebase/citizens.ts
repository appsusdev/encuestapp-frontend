import { db } from "../../config/firebase/firebase-config";
import { ICitizen } from "../../interfaces/Citizens";

export const addCitizen = (citizen: ICitizen) => {
  const { identificacion, tipoIdentificacion } = citizen;
  //console.log(identificacion,'=>', tipoIdentificacion);
  let docRef = db
    .collection("Ciudadanos")
    .doc(`${tipoIdentificacion}-${identificacion}`);
  return docRef.set({ ...citizen }, { merge: true });
};

export const addJsonCitizens = (jsonStr: string, nit: string) => {
  const docRef = db.collection("Entidades").doc(nit);
  return docRef.set({ ciudadanos: jsonStr }, { merge: true });
};

export const getCitizens = async (nit: string) => {
  const citizensRef = db.collection("Entidades").doc(nit);

  const citizens = await citizensRef.get().then((snapShot) => {
    return snapShot.data();
  });

  return citizens;
};

export const getTransmittedSurveysByCitizen = async (
  town: string,
  idCitizen: string,
  nit: string
) => {
  const surveysSnap = await db
    .collectionGroup("EncuestasTransmitidas")
    .where("encuestados", "array-contains", idCitizen)
    .where("municipio", "==", town)
    .where("idEntidad", "==", nit)
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

// Obtener informacion del mapa
export const getMapData = async (nit: string) => {
  const mapDataSnap = await db
    .collection("Entidades")
    .doc(nit)
    .get()
    .then((snapShot) => {
      return snapShot.data();
    });
  return mapDataSnap;
};
