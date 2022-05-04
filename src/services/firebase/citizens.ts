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


export const listenerGetCitizens = (nit: string, callback: Function) => {
  db.collection("Entidades")
    .doc(nit)
    .onSnapshot((snap) => {
      const jsonResponse = snap.data();
      if (jsonResponse && jsonResponse.ciudadanos) {
        const parseJson = JSON.parse(jsonResponse.ciudadanos) as CitizensType;
        callback(setCitizens(parseJson));
      }
    });
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
