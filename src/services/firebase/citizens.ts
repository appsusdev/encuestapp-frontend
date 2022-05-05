import axios from "axios";
import firebase from "firebase/app";
import { db } from "../../config/firebase/firebase-config";
import { ICitizen, CitizensType } from "../../interfaces/Citizens";
import { setCitizens } from "../../redux/actions/citizensActions";

export const addCitizen = (citizen: ICitizen) => {
  const { identificacion, tipoIdentificacion } = citizen;

  let docRef = db
    .collection("Ciudadanos")
    .doc(`${tipoIdentificacion}-${identificacion}`);
  return docRef.set({ ...citizen }, { merge: true });
};

export const addJsonCitizens = (jsonStr: string, nit: string) => {
  const docRef = db.collection("Entidades").doc(nit);
  return docRef.set({ ciudadanos: jsonStr }, { merge: true });
};

export const getCitizens = async (nit: string, callback: Function) => {
  const jsonStorage = await getJsonCitizenStorage(nit);
  const jsonFirestore = await getCitizensFirestore(nit);

  if (jsonFirestore && jsonFirestore.ciudadanos) {
    const parseJson = JSON.parse(jsonFirestore.ciudadanos) as CitizensType;
    let totalCitizens = jsonStorage ? parseJson.concat(jsonStorage) : parseJson;

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
};

export const getCitizensFirestore = async (nit: string) => {
  const citizensRef = db.collection("Entidades").doc(nit);

  const citizens = await citizensRef.get().then((snapShot) => {
    return snapShot.data();
  });
  return citizens;
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
