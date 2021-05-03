import { firebase, db } from "../../config/firebase/firebase-config";

export interface IUserInfo {
  activo: boolean;
  nombres: string;
  apellidos: string;
  avatar: string;
  celular: number;
  direccion: string;
  identificacion: number;
  rol: string;
  municipios: string[]
}

export const getUserRole = (email:string | null | undefined): Promise<IUserInfo> => {
    
    return db.collection('Usuarios')
    .where("activo", "==", true)
    .where("email","==",email)
    .get()
    .then((snapShot) => {
        let users: any;
        snapShot.forEach((doc: any) => {
          users = doc.data() as IUserInfo;
        });

        return users;
    })
    .catch( err => console.log(err));

};

export const registerWithEmailPassword = async(email:string , password: string ) => {
  return await firebase.auth().createUserWithEmailAndPassword(email, password);
}