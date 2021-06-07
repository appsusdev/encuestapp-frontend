import { db } from "../../config/firebase/firebase-config";
import { ICitizen } from "../../interfaces/Citizens";

export const addCitizen = (citizen: ICitizen) => {
  const { identificacion,tipoIdentificacion } = citizen;
  //console.log(identificacion,'=>', tipoIdentificacion);
  let docRef = db.collection("Ciudadanos").doc(`${tipoIdentificacion}-${identificacion}`);
  return docRef.set({ ...citizen }, { merge: true });
};
