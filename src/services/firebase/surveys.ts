import { db } from "../../config/firebase/firebase-config";
import { Survey, Chapter } from '../../interfaces/Survey';

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

  console.log('Obtener encuestas')

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
  docRef.collection("Encuestas").doc(code).set({titulo: name, fechaCreacion: creationDate}, {merge: true});
}

// Verificar si existe capitulo
export const existsChapter = (
  town: string,
  idSurvey: string,
  name?: string 
): Promise<Chapter> => {
  return db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey)
    .collection('Capitulos')
    .where('titulo','==',name)
    .get()
    .then((snapShot) => {
      let chapter: any;
      snapShot.forEach((doc: any) => {
        chapter = doc.data() as Chapter;
      });
      return chapter;
    })
    .catch((err) => console.log(err));
};

// Crear capitulo
export const addNewChapter = async (town: string, idSurvey: string , chapter: any ) => {
  const docRef = await db.collection("Municipios").doc(town);
  docRef.set({});
  docRef.collection("Encuestas").doc(idSurvey).collection("Capitulos").doc(`capitulo${chapter.numero}-${Date.now()}`).set(chapter);
};

// Editar capitulo
export const editChapter = async (town: string, idSurvey: string , idChapter: string, chapter: any ) => {
  const docRef = await db.collection("Municipios").doc(town);
  docRef.set({});
  docRef.collection("Encuestas").doc(idSurvey).collection("Capitulos").doc(idChapter).set(chapter, {merge: true});
};

// Obtener capitulos por encuesta
export const getChapters = async (town: string, idSurvey: string) => {
  const chapterSnap = await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .orderBy("numero","asc")
    .get();
  const chapters: any[] = [];

  chapterSnap.forEach((snap) => {
    chapters.push({
      id: snap.id,
      ...snap.data(),
    });
  });

  console.log('Obtener capitulos');

  return chapters;
};

// Eliminar capitulo
export const deleteChapter =  async(town: string, idSurvey: string, idChapter: string) => {
  await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .doc(idChapter)
    .delete();
}