import { db } from "../../config/firebase/firebase-config";
import { ICitizen } from "../../interfaces/Citizens";

export const addCitizen = (citizen: ICitizen) => {
  const { identificacion,tipoIdentificacion } = citizen;
  //console.log(identificacion,'=>', tipoIdentificacion);
  let docRef = db.collection("Ciudadanos").doc(`${tipoIdentificacion}-${identificacion}`);
  return docRef.set({ ...citizen }, { merge: true });
};

export const addJsonCitizens = (jsonStr:string,municipio:string)=>{
  //const docRef = db.collection('Ciudadanos').doc('jsonCitizens')
  const docRef = db.collection('Municipios').doc(municipio).collection('Ciudadanos').doc('jsonCitizens')
  return docRef.set({data:jsonStr},{merge:true})
}

export const getCitizens = async() => {
  const citizensRef = db.collection('Ciudadanos').doc('jsonCitizens');
  
  const citizens = await citizensRef.get().then(snapShot=>{
      return snapShot.data()
  });

  return citizens;
}

export const getTransmitedSurveys = async(town: string, idCitizen: string) => {
  const surveysSnap = await db.collectionGroup('EncuestasTransmitidas').where('encuestados','array-contains', idCitizen).where('municipio','==',town).get();
  const surveys: any[] = [];

  surveysSnap.forEach((snap) => {
    surveys.push({
      id: snap.id,
      ...snap.data(),
    });
  });
  return surveys;
};

