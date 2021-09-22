import { db, firebase } from "../../config/firebase/firebase-config";
import { TypeUser } from "../../enums/enums";
import { EntitiesType, IEntity } from "../../redux/types/types";

export const loadAllEntities = (): Promise<EntitiesType | []> => {
  return db
    .collection("Usuarios")
    .where("rol", "==", TypeUser.ADMIN)
    .get()
    .then((snapShot) => {
      let Response: EntitiesType | [] = [];
      snapShot.forEach((doc) => {
        Response = [...Response, doc.data() as IEntity];
      });
      return Response;
    });
};

export const addNewEntity = (entity: IEntity,uid:string): Promise<any> => {
  const {
    email,
    identificacion,
    primerNombre,
    primerApellido,
    segundoApellido,
    segundoNombre,
    codigoDane,
    codigoSigep,
    departamento,
    celular,
    direccion,
    municipio,
    nit,
    razonSocial,
  } = entity;

  return db
    .collection("Usuarios")
    .doc(nit)
    .set(
      {
        activo: true,
        primerNombre: primerNombre.trim(),
        segundoNombre: segundoNombre.trim(),
        primerApellido: primerApellido.trim(),
        segundoApellido: segundoApellido.trim(),
        nombreCompleto: `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`,
        avatar: "",
        celular: celular.trim(),
        direccion,
        identificacion: identificacion.toString().trim(),
        rol: TypeUser.ADMIN,
        departamento,
        municipio,
        codigoDane,
        codigoSigep,
        nit,
        razonSocial,
        email,
        uid,
        fechaCreacion: firebase.firestore.Timestamp.now(),
      },
      { merge: true }
    )
    .then(() => {
      //CREAR LA COLECCION DE LOS MUNICIPIOS
      return db
        .collection("Municipios")
        .doc(municipio)
        .set({ departamento })
        .then(() => {
          return {
            ok: true,
          };
        });
    })
    .then(() => {
      //CREAR LA COLECCIÓN DE ENTIDADES
      return db
        .collection("Entidades")
        .doc(nit)
        .set({ ciudadanos: null, lat: 2.495, lng: -73.781, zoom: 4.32 })
        .then(() => {
          return {
            ok: true,
          };
        });
    });
};

export const updateEntity = (entity: IEntity,uid:string): Promise<any> => {
  const {
    email,
    identificacion,
    primerNombre,
    primerApellido,
    segundoApellido,
    segundoNombre,
    codigoDane,
    codigoSigep,
    departamento,
    celular,
    direccion,
    municipio,
    nit,
    razonSocial,
  } = entity;
  return db
    .collection("Usuarios")
    .doc(nit)
    .set(
      {
        primerNombre: primerNombre.trim(),
        segundoNombre: segundoNombre.trim(),
        primerApellido: primerApellido.trim(),
        segundoApellido: segundoApellido.trim(),
        nombreCompleto: `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`,
        avatar: "",
        celular: celular.trim(),
        direccion,
        identificacion: identificacion.toString().trim(),

        departamento,
        municipio,
        codigoDane,
        codigoSigep,
        nit,
        razonSocial,
        email,
        uid
      },
      { merge: true }
    )
    .then(() => {
      //CREAR LA COLECCION DE LOS MUNICIPIOS
      return db
        .collection("Municipios")
        .doc(municipio)
        .set(
          {
            departamento,
          },
          { merge: true }
        )
        .then(() => {
          return {
            ok: true,
          };
        });
    });
};

export const getEntity = (nit: string): Promise<any> => {
  return db
    .collection("Usuarios")
    .where("rol", "==", TypeUser.ADMIN)
    .where("nit", "==", nit)
    .get()
    .then((snapShot) => {
      let users: any;
      snapShot.forEach((doc: any) => {
        users = {
          id: doc.id,
          ...(doc.data() as any),
        };
      });

      return users;
    })
    .catch((err) => console.log(err));
};
