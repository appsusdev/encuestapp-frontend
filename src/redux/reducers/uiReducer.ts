import { TypeUser } from "../../enums/enums";
import { IUi, types, UiAction } from "../types/types";

const initialState = {
  modalAddOpen: false,
  modalEditOpen: false,
  modalDeleteOpen: false,
  modalAssignOpen: false,
  modalAlert: false,
  loading: false,
  alert: false,
  successAlert: false,
  errorAlert: false,
  deleteSuccess: false,
  openQuestion: false,
  role: TypeUser.ADMIN,
  progress: 0,
};

export const uiReducer = (state: IUi = initialState, action: UiAction) => {
  switch (action.type) {
    case types.uiOpenModalAdd:
      return {
        ...state,
        modalAddOpen: true,
      };

    case types.uiCloseModalAdd:
      return {
        ...state,
        modalAddOpen: false,
      };

    case types.uiOpenModalEdit:
      return {
        ...state,
        modalEditOpen: true,
      };

    case types.uiCloseModalEdit:
      return {
        ...state,
        modalEditOpen: false,
      };

    case types.uiOpenModalDelete:
      return {
        ...state,
        modalDeleteOpen: true,
      };

    case types.uiCloseModalDelete:
      return {
        ...state,
        modalDeleteOpen: false,
      };

    case types.uiOpenModalAssign:
      return {
        ...state,
        modalAssignOpen: true,
      };

    case types.uiCloseModalAssign:
      return {
        ...state,
        modalAssignOpen: false,
      };

    case types.uiOpenModalAlert:
      return {
        ...state,
        modalAlert: true,
      };

    case types.uiCloseModalAlert:
      return {
        ...state,
        modalAlert: false,
      };

    case types.uiStartLoading:
      return {
        ...state,
        loading: true,
      };

    case types.uiFinishLoading:
      return {
        ...state,
        loading: false,
      };

    case types.uiOpenAlert:
      return {
        ...state,
        alert: true,
      };

    case types.uiCloseAlert:
      return {
        ...state,
        alert: false,
      };

    case types.uiOpenSuccessAlert:
      return {
        ...state,
        successAlert: true,
      };

    case types.uiCloseSuccessAlert:
      return {
        ...state,
        successAlert: false,
      };

    case types.uiOpenErrorAlert:
      return {
        ...state,
        errorAlert: true,
      };

    case types.uiCloseErrorAlert:
      return {
        ...state,
        errorAlert: false,
      };

    case types.uiOpenDeleteSuccess:
      return {
        ...state,
        deleteSuccess: true,
      };

    case types.uiCloseDeleteSuccess:
      return {
        ...state,
        deleteSuccess: false,
      };

    case types.uiOpenQuestion:
      return {
        ...state,
        openQuestion: true,
      };

    case types.uiCloseQuestion:
      return {
        ...state,
        openQuestion: false,
      };

    case types.uiChangeRole:
      return {
        ...state,
        role: action.payload,
      };
    case types.uiSetprogres:
      return {
        ...state,
        progress: action.payload,
      };

    default:
      return state;
  }
};
