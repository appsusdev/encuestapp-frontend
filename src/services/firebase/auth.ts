import { firebase, db } from "../../config/firebase/firebase-config";
import { TypeUser } from "../../enums/enums";


export interface IUserInfo {
  activo: boolean;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  nombreCompleto: string;
  avatar: string;
  celular: number;
  direccion: string;
  identificacion: number;
  rol: TypeUser;
  municipios: string[];//este ya no
  municipio:string
}

export const getUserRole = (
  email: string | null | undefined
): Promise<IUserInfo> => {
  return db
    .collection("Usuarios")
    .where("activo", "==", true)
    .where("email", "==", email)
    .get()
    .then((snapShot) => {
      let users: any;
      snapShot.forEach((doc: any) => {
        users = doc.data() as IUserInfo;
      });

      return users;
    })
    .catch((err) => console.log(err));
};

export const registerWithEmailPassword = async (
  email: string,
  password: string
) => {
  return await firebase.auth().createUserWithEmailAndPassword(email, password);
};
export const updateCredentialsEntity = (oldEmail:string,oldPassword:string,newEmail:string,newPassword:string)=>{
  firebase.auth().signInWithEmailAndPassword(oldEmail,oldPassword).then(async (credential)=>{
    await credential.user?.updateEmail(newEmail);
    await credential.user?.updatePassword(newPassword);
  })
}


export const uploadFileAsync = async (
  file: File,
  fileName: string
): Promise<string> => {
  return new Promise(async (res, rej) => {

    const upload = firebase.storage().ref(fileName).put(file);
    upload.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        rej(err);
      },
      async () => {
        const url = await upload.snapshot?.ref.getDownloadURL();
        res(url as string);
      }
    );
  });
};
