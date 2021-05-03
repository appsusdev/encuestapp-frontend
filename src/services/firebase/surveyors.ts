import { db } from '../../config/firebase/firebase-config';
import { TypeUser } from '../../enums/enums';

// Verificar si existe encuestador en la BD
export const existsSurveyor = (email:string | null | undefined): Promise<any> => {
    
  return db.collection('Usuarios')
  .where("rol", "==", TypeUser.SURVEYOR)
  .where("email","==",email)
  .get()
  .then((snapShot) => {
      let users: any;
      snapShot.forEach((doc: any) => {
        users = { 
          id: doc.id, 
          ...doc.data() as any
        };
      });

      return users;
  })
  .catch( err => console.log(err));
};

// Agregar encuestador a la colección Municipios
export const addSurveyorToTown = async(townsAdmin: string[] , email: string | undefined, surveyorTown: {}) => {
  townsAdmin.forEach( async(townAdm: string) => {
    const df = await db.collection('Municipios').doc(townAdm);
    df.set({})
    df.collection('Encuestadores').doc(email).set(surveyorTown);
  });
}

// Actualizar municipios del encuestador
export const updateTowns = async(email: string | undefined, surveyorTowns: {}) => {
  await db.collection('Usuarios').doc(`${email}`).update(surveyorTowns);
}