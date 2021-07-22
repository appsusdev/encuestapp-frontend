import { firebase, db } from "../../config/firebase/firebase-config";
import { TypeUser } from "../../enums/enums";
import { IEntityForm } from "../../redux/types/types";

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
export const addNewEntity = (entity:IEntityForm):Promise<any>=>{
  const {adminCorreo,adminIdentificacion,adminPrimerNombre,adminPrimerApellido,adminSegundoApellido,adminSegundoNombre,codigoDane,codigoSigep,departamento,telefono,direccion,municipio,nit,razonSocial} = entity
  return db.collection('Usuarios').doc(adminCorreo).set({
    activo:true,
    primerNombre: adminPrimerNombre.trim(),
    segundoNombre: adminSegundoNombre.trim(),
    primerApellido: adminPrimerApellido.trim(),
    segundoApellido: adminSegundoApellido.trim(),
    nombreCompleto: `${adminPrimerNombre} ${adminSegundoNombre} ${adminPrimerApellido} ${adminSegundoApellido}`,
    avatar: "",
    celular: telefono.trim(),
    direccion,
    identificacion: adminIdentificacion.toString().trim(),
    rol: TypeUser.ADMIN,
    departamento,
    municipio,
    codigoDane,
    codigoSigep,
    nit,
    razonSocial,
    fechaCreacion: firebase.firestore.Timestamp.now()
  }).then(()=>{
    //CREAR LA COLECCION DE LOS MUNICIPIOS
    return db.collection('Municipios').doc(municipio).set({
      departamento,
      admin:adminIdentificacion,

    }).then(()=>{
      return {
        ok:true
      }
    })
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
