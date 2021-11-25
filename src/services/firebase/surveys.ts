import { db } from "../../config/firebase/firebase-config";
import { Survey, Chapter } from "../../interfaces/Survey";
import { questionDTO, chapterDTO, surveyDTO } from "../../helpers/surveyDTO";

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

      return survey;
    })
    .catch((err) => console.log(err));
};

// Obtener solamente informacion de las encuestas
export const getSurveys = async (town: string, nit: string) => {
  const surveyorsSnap = await db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .where("idEntidad", "==", nit)
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
// Obtener encuestas con toda la informacion (capitulos y preguntas)
export const getSurveysAndChapters = async (town: string, nit: string) => {
  const surveys: any[] = await getSurveys(town, nit);

  // Obtener cada encuesta con sus capitulos
  let surveysAndChapters: any[] = [];
  for (let survey of surveys) {
    const chapters = await getChapters(town, survey.id);

    let surveyDB = {
      id: survey.id,
      ...survey,
      chapters: chapters,
      idEntity: nit,
    };
    surveysAndChapters = [...surveysAndChapters, surveyDB];
  }

  // DTO surveys
  const resp: any[] = [];
  surveysAndChapters.forEach((survey) => {
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
  chapter: any,
  idNewChapter: string
) => {
  const docRef = db.collection("Municipios").doc(town);
  await docRef
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .doc(idNewChapter)
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
  const resp: any[] = [];
  chaptersAndQuestions.forEach((chapter) => {
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
  const individualQuestionsRef = docChaptersRef
    .doc(idChapter)
    .collection("PreguntasIndividual")
    .orderBy("numeroPregunta");
  const indQuestions = await individualQuestionsRef.get();

  indQuestions.forEach((snap) => {
    allQuestions.push({
      id: snap.id,
      ...snap.data(),
      answers: [],
    });
  });

  // Preguntas hogar
  let homeQuestionsRef = docChaptersRef
    .doc(idChapter)
    .collection("PreguntasHogar")
    .orderBy("numeroPregunta");
  const homeQuestions = await homeQuestionsRef.get();

  homeQuestions.forEach((snap) => {
    allQuestions.push({
      id: snap.id,
      ...snap.data(),
      answers: [],
    });
  });

  const resp: any[] = [];
  allQuestions.forEach((question) => {
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
};

// Eliminar encuesta: (Se eliminan respuestas, preguntas y capitulos)
export const deleteSurveyFirebase = async (town: string, idSurvey: string) => {
  const surveyRef = db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey);

  // Eliminar capitulos de la encuesta
  let chapters = await surveyRef.collection("Capitulos").get();
  chapters.forEach(async (snapChapter) => {
    // RECORRER PRREGUNTAS INDIVIDUAL
    let ind = await surveyRef
      .collection("Capitulos")
      .doc(snapChapter.ref.id)
      .collection("PreguntasIndividual")
      .get();
    ind.forEach(async (snapInd) => {
      let respuestas = await surveyRef
        .collection("Capitulos")
        .doc(snapChapter.ref.id)
        .collection("PreguntasIndividual")
        .doc(snapInd.ref.id)
        .collection("Respuestas")
        .get();

      respuestas.forEach(async (snapResp) => {
        // Eliminar respuestas
        await snapResp.ref.delete();
      });

      // Eliminar preguntas INDIVIDUAL
      await snapInd.ref.delete();
    });

    // RECORRER PRREGUNTAS HOGAR
    let home = await surveyRef
      .collection("Capitulos")
      .doc(snapChapter.ref.id)
      .collection("PreguntasHogar")
      .get();
    home.forEach(async (snapHome) => {
      let respuestas = await surveyRef
        .collection("Capitulos")
        .doc(snapChapter.ref.id)
        .collection("PreguntasHogar")
        .doc(snapHome.ref.id)
        .collection("Respuestas")
        .get();

      respuestas.forEach(async (snapResp) => {
        // Eliminar respuestas
        await snapResp.ref.delete();
      });

      // Eliminar preguntas HOGAR
      await snapHome.ref.delete();
    });

    // Eliminar el capitulo
    await snapChapter.ref.delete();
  });

  // Eliminar la encuesta
  await surveyRef.delete();
};

// Eliminar encuestas tranasmitidas
export const deleteSurveysTransmitted = async (
  nit: string,
  idSurvey: string
) => {
  const surveys = await db
    .collectionGroup("EncuestasTransmitidas")
    .where("idEntidad", "==", nit)
    .where("idEncuesta", "==", idSurvey)
    .get();

  surveys.forEach(async (snap) => {
    await snap.ref.delete();
  });
};

// Obtener respuestas del ciudadano buscado
export const getAnswers = async (
  town: string,
  idSurvey: string,
  idChapter: string,
  typeQuestion: string,
  idQuestion: string,
  idCitizen?: string
) => {
  const docRef = db
    .collection("Municipios")
    .doc(town)
    .collection("Encuestas")
    .doc(idSurvey)
    .collection("Capitulos")
    .doc(idChapter)
    .collection(typeQuestion)
    .doc(idQuestion)
    .collection("Respuestas");
  let answersRef;
  if (idCitizen) {
    if (typeQuestion === "PreguntasHogar") {
      answersRef = await docRef
        .where("idEncuestaCiudadano", "==", idCitizen)
        .limit(1)
        .get();
    } else {
      answersRef = await docRef
        .where("idEncuestaCiudadano", "==", idCitizen)
        .get();
    }
  } else {
    answersRef = await docRef.get();
  }
  /*  idCitizen
    ? (answersRef = await docRef
        .where("idEncuestaCiudadano", "==", idCitizen)
        .get())
    : (answersRef = await docRef.get()); */

  const answers: any[] = [];
  answersRef.forEach((resp: any) => {
    answers.push({ citizen: resp.id, ...resp.data() });
  });

  return answers;
};
