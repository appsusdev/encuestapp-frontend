import { db } from "../../config/firebase/firebase-config";
import { ICitizen } from "../../interfaces/Citizens";

export const addCitizen = (citizen: ICitizen) => {
  const { identificacion } = citizen;
  let docRef = db.collection("Ciudadanos").doc(identificacion);
  return docRef.set({ ...citizen }, { merge: true });
};
