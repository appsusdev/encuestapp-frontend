import axios from "axios";
import firebase from "firebase/app";
import { db } from "../../config/firebase/firebase-config";
import { ICitizen, CitizensType } from "../../interfaces/Citizens";
import { setCitizens } from "../../redux/actions/citizensActions";

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

export const listenerGetCitizens = async (nit: string, callback: Function) => {
  const jsonStorage = await getJsonCitizenStorage(nit);

  db.collection("Entidades")
    .doc(nit)
    .onSnapshot((snap) => {
      const jsonResponse = snap.data();
      if (jsonResponse && jsonResponse.ciudadanos) {
        const parseJson = JSON.parse(jsonResponse.ciudadanos) as CitizensType;

        let totalCitizens = jsonStorage
          ? parseJson.concat(jsonStorage)
          : parseJson;

        const result = totalCitizens.filter((item, index) => {
          return (
            totalCitizens.findIndex(
              (el) => el.identificacion === item.identificacion
            ) === index
          );
        });

        callback(setCitizens(result));
      } else if (jsonStorage) {
        callback(setCitizens(jsonStorage));
      }
    });
};

export const getJsonCitizenStorage = async (nit: string) => {
  try {
    const urlJsonCitizens = await firebase
      .storage()
      .ref(`json/${nit}/citizens.json`)
      .getDownloadURL();

    const citizens = axios
      .get(urlJsonCitizens)
      .then((response) => response.data);

    return citizens;
  } catch (error: any) {
    return;
  }
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
