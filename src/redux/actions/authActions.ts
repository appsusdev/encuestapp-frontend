import { firebase } from "../../config/firebase/firebase-config";
import { TypeUser } from "../../enums/enums";
import { getUserRole } from "../../services/firebase/auth";
import { types, IAuth } from "../types/types";
import { uiOpenSuccessAlert } from "./uiActions";
import { finishLoading, startLoading, uiOpenErrorAlert } from "./uiActions";

export const startLoginCorreoPassword = (email: string, password: string) => {
  return (dispatch: any) => {
    dispatch(startLoading());

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async ({ user }) => {
        const { rol, municipio, nit, razonSocial } = await getUserRole(
          user?.email
        );

        if (rol) {
          if (rol === TypeUser.ADMIN || rol === TypeUser.SUPER_ADMIN) {
            const userAuth = {
              uid: user?.uid,
              displayName: user?.displayName,
              email: user?.email,
              rol: rol,
              municipio: municipio,
              nit: nit,
              razonSocial: razonSocial,
            };
            dispatch(login(userAuth));
            window.location.reload();
          } else {
            dispatch(uiOpenErrorAlert());
          }
          dispatch(finishLoading());
        } else {
          dispatch(uiOpenErrorAlert());
        }
      })
      .catch((e) => {
        dispatch(uiOpenErrorAlert());
        dispatch(finishLoading());
      });
  };
};

export const login = (user: IAuth) => ({
  type: types.login,
  payload: {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    rol: user.rol,
    municipio: user.municipio,
    nit: user.nit,
    razonSocial: user.razonSocial,
  },
});

export const startLogout = () => {
  return async (dispatch: any) => {
    await firebase.auth().signOut();

    dispatch(logout());
  };
};

export const logout = () => ({ type: types.logout });

export const startPasswordRecovery = (email: string) => {
  return async (dispatch: Function) => {
    try {
      await firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          dispatch(uiOpenSuccessAlert());
        });
    } catch (error: any) {
      dispatch(uiOpenErrorAlert());
      throw new Error(error);
    }
  };
};

export const startChangePassword = (
  currentPassword: string,
  newPassword: string
) => {
  return async (dispatch: Function) => {
    const resp = reauthenticate(currentPassword);
    resp
      ?.then(() => {
        const user = firebase.auth().currentUser;
        user
          ?.updatePassword(newPassword)
          .then(() => {
            dispatch(uiOpenSuccessAlert());
            setTimeout(() => {
              dispatch(startLogout());
            }, 3000);
          })
          .catch((error) => {
            dispatch(uiOpenErrorAlert());
            throw new Error(error);
          });
      })
      .catch((error) => {
        dispatch(uiOpenErrorAlert());
        throw new Error(error);
      });
  };
};

const reauthenticate = (currentPassword: string) => {
  const user = firebase.auth().currentUser;

  if (user?.email) {
    const cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  }
};
