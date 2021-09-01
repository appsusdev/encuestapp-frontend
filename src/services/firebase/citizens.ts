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

export const addJsonCitizens = (
  jsonStr: string,
  municipio: string,
  nit: string
) => {
  //const docRef = db.collection('Ciudadanos').doc('jsonCitizens')
  const docRef = db
    .collection("Municipios")
    .doc(municipio)
    .collection("Ciudadanos")
    .doc(nit);
  return docRef.set({ data: jsonStr }, { merge: true });
};

export const getCitizens = async (town: string, nit: string) => {
  const citizensRef = db
    .collection("Municipios")
    .doc(town)
    .collection("Ciudadanos")
    .doc(nit);

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
    .collection("Usuarios")
    .doc(nit)
    .get()
    .then((snapShot) => {
      return snapShot.data();
    });
  return mapDataSnap;
};
