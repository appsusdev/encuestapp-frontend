import { TypeUser } from "../../enums/enums";
import { Surveyor } from "../../interfaces/Surveyor";

export const types = {
    // auth
    login: '[Auth] Login',
    logout: '[Auth] Logout',

    // setting
    TOGGLE_NAV_COLLAPSED: 'TOGGLE_NAV_COLLAPSED',
    SET_INITIAL_PATH: 'SET_INITIAL_PATH',
    ROUTE_CHANGE: '@@router/LOCATION_CHANGE',
    
    // ui
    uiOpenModalAdd: '[ui] Open modal add',
    uiCloseModalAdd: '[ui] Close modal add',
    uiOpenModalEdit: '[ui] Open modal edit',
    uiCloseModalEdit: '[ui] Close modal edit',
    uiOpenModalDelete: '[ui] Open modal delete',
    uiCloseModalDelete: '[ui] Close modal delete',
    uiOpenModalAssign: '[ui] Open modal assign',
    uiCloseModalAssign: '[ui] Close modal assign',
    uiStartLoading: '[ui] Start loading',
    uiFinishLoading: '[ui] Finish loading',
    uiOpenAlert: '[ui] Open alert',
    uiCloseAlert: '[ui] Close alert',
    uiOpenSuccessAlert: '[ui] Open success alert',
    uiCloseSuccessAlert: '[ui] Close success alert',
    uiOpenErrorAlert: '[ui] Open error alert',
    uiCloseErrorAlert: '[ui] Close error alert',
    uiChangeRole: '[ui] Change role',

    // surveyors
    surveyorAddNew: '[surveyor] New surveyor',
    surveyorFromDB: '[surveyor] Surveyor from DB',
    surveyorActive: '[surveyor] Set active surveyor',
    surveyorsLoad: '[surveyor] Load surveyors',
    surveyorUpdated: '[surveyor] Updated surveyor',
    surveyorDelete: '[surveyor] Delete surveyor',
    surveyorsLogoutCleaning: '[surveyor] Cleaning surveyors',
}

// Auth
export interface IAuth {
    uid: string | undefined | null,
    displayName: string | undefined | null,
    email: string | undefined | null,
    rol: string | undefined | null,
    municipios: string[]
}

export type AuthAction = {
    type: string,
    payload: IAuth
}

// Ui
export interface IUi {
  modalAddOpen: boolean,
  modalEditOpen: boolean,
  modalDeleteOpen: boolean,
  modalAssignOpen: boolean,
  loading: boolean,
  alert: boolean,
  successAlert: boolean,
  errorAlert: boolean,
  role: TypeUser,
}

export type UiAction = {
  type: string,
  payload: IAuth
}

// Auth
export interface ISurveyor {
  surveyors: Partial<Surveyor>[],
  activeSurveyor: Partial<Surveyor> | null,
  surveyorFromToDB: any
}

export type SurveyorsAction = {
  type: string,
  payload: any
}

// Settings
export interface ToggleNavCollapsedAction {
  type: typeof types.TOGGLE_NAV_COLLAPSED;
  initialPath: string | undefined;
}

export interface SetInitialPathAction {
  type: typeof types.SET_INITIAL_PATH;
  initialPath: string | undefined;
}

export interface RouteChangeAction {
  type: typeof types.ROUTE_CHANGE;
}

export type SettingsActionTypes =
  | ToggleNavCollapsedAction
  | SetInitialPathAction
  | RouteChangeAction;
