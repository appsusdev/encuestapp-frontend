import { AuthAction, IAuth, types } from "../types/types";

const initialState = {
  uid: "",
  displayName: "",
  email: "",
  rol: "",
  municipios: [],
  municipio: "",
  nit: "",
  razonSocial: "",
};

export const authReducer = (
  state: Partial<IAuth> = initialState,
  action: AuthAction
) => {
  switch (action.type) {
    case types.login:
      return {
        uid: action.payload.uid,
        displayName: action.payload.displayName,
        email: action.payload.email,
        rol: action.payload.rol,
        municipio: action.payload.municipio,
        nit: action.payload.nit,
        razonSocial: action.payload.razonSocial,
      };

    case types.logout:
      return {};

    default:
      return state;
  }
};
