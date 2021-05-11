import { db } from "../../config/firebase/firebase-config";
import { Survey } from "../../interfaces/Survey";

// Verificar si existe encuesta
export const existsSurvey = (
  town: string,
  code: string | undefined
): Promise<Survey> => {
  return db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .where("idEncuesta", "==", code)
    .get()
    .then((snapShot) => {
      let survey: any;
      snapShot.forEach((doc: any) => {
        survey = doc.data() as Survey;
      });
      console.log('Consulta verificar si existe encuesta')
      return survey;
    })
    .catch((err) => console.log(err));
};

// Obtener encuestas por municipio
export const getSurveys = async (town: string) => {
  const surveyorsSnap = await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .get();
  const surveys: any[] = [];

  surveyorsSnap.forEach((snap) => {
    surveys.push({
      id: snap.id,
      ...snap.data(),
    });
  });

  return surveys;
};

// Crear encuesta
export const addNewSurvey = async (town: string, code: string | undefined, surveyToDB: {} ) => {
  const docRef = await db.collection("Municipios").doc(town);
  docRef.set({});
  docRef.collection("Encuestas").doc(code).set(surveyToDB);
};

// Editar encuesta
export const editSurvey = async (survey: Partial<Survey>, town: string ) => {
  const {code, name, creationDate} = survey;
  const docRef = await db.collection("Municipios").doc(town);
  docRef.set({});
  docRef.collection("Encuestas").doc(code).set({titulo: name, fechaCreacion: creationDate}, {merge: true});
}
