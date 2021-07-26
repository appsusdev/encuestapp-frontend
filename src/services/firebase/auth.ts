import Axios from "axios";
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
  rol: string;
  municipios: string[];
  municipio: string;
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
interface firebaseApiResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export const registerWithEmailPassword = async (
  email: string,
  password: string
) => {
  //CREAR EL USUARIO MEDIANTE EL API
  //return await firebase.auth().createUserWithEmailAndPassword(email, password);

  return Axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_SERVER_KEY}`,
    { email, password, returnSecureToken: true }
  );
};
export const updateCredentialsEntity = (
  oldEmail: string,
  oldPassword: string,
  newEmail: string,
  newPassword: string
): Promise<any> => {
  //HACER EL CAMBIO MEDIANTE EL API REST PARA NO GENERAR UNA NUEVA SESION EN LA APP
  return Axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_SERVER_KEY}`,
    { email: oldEmail, password: oldPassword, returnSecureToken: true }
  ).then((response) => {
    const { data } = response;

    const { idToken } = data as firebaseApiResponse;
    //peticion para cambiar email
    return Axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_SERVER_KEY}`,
      {
        idToken,
        email: newEmail,
        returnSecureToken: true,
      }
    ).then((response) => {
      const { data } = response;

      const { idToken } = data as firebaseApiResponse;

      //peticion para cambiar contraseña
      return Axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_SERVER_KEY}`,
        {
          idToken,
          password: newPassword,
          returnSecureToken: true,
        }
      );
    });
  });
};

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
