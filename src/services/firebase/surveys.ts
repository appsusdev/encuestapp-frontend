import { db } from "../../config/firebase/firebase-config";
import { Survey, Chapter } from '../../interfaces/Survey';
import { questionDTO, chapterDTO, surveyDTO } from '../../helpers/surveyDTO';

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
      console.log("Consulta verificar si existe encuesta");
      return survey;
    })
    .catch((err) => console.log(err));
};

// Obtener solamente informacion de las encuestas
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
}  
// Obtener encuestas con toda la informacion (capitulos y preguntas)
export const getSurveysAndChapters = async (town: string, data?: any[]) => {
  let surveys: any[] = [];
  
  (data) ? (surveys = data) : (surveys = await getSurveys(town));

  // Obtener cada encuesta con sus capitulos
  let surveysAndChapters: any[] = [];
  for (let survey of surveys) {
    const chapters = await getChapters(town, survey.id);

    let surveyDB = {
      id: survey.id,
      ...survey,
      chapters: chapters,
    };
    surveysAndChapters = [...surveysAndChapters, surveyDB];
  }
  
  // DTO surveys
  const resp:any[] = [];
  surveysAndChapters.forEach( survey => {
    resp.push(surveyDTO(survey));
  });

  return resp;
};

// Crear encuesta
export const addNewSurvey = async (
  town: string,
  code: string | undefined,
  surveyToDB: {}
) => {
  const docRef = db.collection("Municipios").doc(town);
  docRef.set({});
  await docRef.collection("Encuestas").doc(code).set(surveyToDB);
};

// Editar encuesta
export const editSurvey = async (survey: Partial<Survey>, town: string) => {
  const { code, name, creationDate } = survey;
  const docRef = db.collection("Municipios").doc(town);
  await docRef
    .collection("Encuestas")
    .doc(code)
    .set({ titulo: name, fechaCreacion: creationDate }, { merge: true });
};

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
    .collection("Capitulos")
    .where("titulo", "==", name)
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
export const addNewChapter = async (
  town: string,
  idSurvey: string,
  chapter: any
) => {
  const docRef = db.collection("Municipios").doc(town);
  docRef.set({});
  await docRef
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .doc(`capitulo${chapter.numero}-${Date.now()}`)
    .set(chapter);
};

// Editar capitulo
export const editChapter = async (
  town: string,
  idSurvey: string,
  idChapter: string,
  chapter: any
) => {
  const docRef = db.collection("Municipios").doc(town);
  docRef.set({});
  await docRef
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .doc(idChapter)
    .set(chapter, { merge: true });
};

// Obtener capitulos por encuesta
export const getChapters = async (town: string, idSurvey: string) => {
  // Obtener capitulos
  const chapterSnap = await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .orderBy("numero", "asc")
    .get();
  const chapters: any[] = [];

  chapterSnap.forEach(async (snap) => {
    chapters.push({
      id: snap.id,
      ...snap.data(),
    });
  });

  // Obtener preguntas por capitulo
  let chaptersAndQuestions: any[] = [];
  for (let chapter of chapters) {
    const questions = await getQuestions(town, idSurvey, chapter.id);

    let chapterFromDB = {
      id: chapter.id,
      titulo: chapter.titulo,
      numero: chapter.numero,
      questions: questions,
    };
    chaptersAndQuestions = [...chaptersAndQuestions, chapterFromDB];
  }

  // DTO chapters
  const resp:any[] = [];
  chaptersAndQuestions.forEach( chapter => {
      resp.push(chapterDTO(chapter));
  });

  return resp;
};

// Eliminar capitulo
export const deleteChapter = async (
  town: string,
  idSurvey: string,
  idChapter: string
) => {
  let chapterRef = db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .doc(idChapter);

  // Eliminar preguntales individuales del capitulo
  let individual = await chapterRef.collection("PreguntasIndividual").get();
  individual.forEach((snap) => {
    snap.ref.delete();
  });

  // Eliminar preguntales hogar del capitulo
  let home = await chapterRef.collection("PreguntasHogar").get();
  home.forEach((snap) => {
    snap.ref.delete();
  });

  await chapterRef.delete();
};

// Crear pregunta
export const addQuestion = async (
  town: string,
  idSurvey: string,
  idChapter: string,
  typeQuestion: string,
  question: any,
  idQuestion: string
) => {
  const docRef = db.collection("Municipios").doc(town);
  docRef.set({});
  await docRef
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .doc(idChapter)
    .collection(typeQuestion)
    .doc(idQuestion)
    .set(question);
};

// Obtener preguntas hogar e indivual
export const getQuestions = async (
  town: string,
  idSurvey: string,
  idChapter: string
) => {
  const docChaptersRef = db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos");
  let allQuestions: any[] = [];

  // Preguntas individuales
  const individualQuestions = await docChaptersRef
    .doc(idChapter)
    .collection("PreguntasIndividual")
    .get();

  individualQuestions.forEach((snap) => {
    allQuestions.push({
      id: snap.id,
      ...snap.data(),
    });
  });

  // Preguntas hogar
  const homeQuestions = await docChaptersRef
    .doc(idChapter)
    .collection("PreguntasHogar")
    .get();

  homeQuestions.forEach((snap) => {
    allQuestions.push({
      id: snap.id,
      ...snap.data(),
    });
  });

  // DTO questions
  const resp:any[] = [];
  allQuestions.forEach( question => {
      resp.push(questionDTO(question));
  });

  return resp;
};


// Editar pregunta
export const editQuestion = async (
  town: string,
  idSurvey: string,
  idChapter: string,
  typeQuestion: string,
  idQuestion: string,
  question: any
) => {
  const docRef = db.collection("Municipios").doc(town);
  docRef.set({});
  await docRef
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .doc(idChapter)
    .collection(typeQuestion)
    .doc(idQuestion)
    .set(question, { merge: true });
};

// Eliminar pregunta
export const deleteQuestion = async (
  town: string,
  idSurvey: string,
  idChapter: string,
  typeQuestion: string,
  idQuestion: string
) => {
  await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .doc(idChapter)
    .collection(typeQuestion)
    .doc(idQuestion)
    .delete();    
}