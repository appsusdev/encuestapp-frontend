import { TypeUser } from "../../enums/enums";
import { Surveyor } from "../../interfaces/Surveyor";
import { Survey, Chapter, SurveyQuestion } from "../../interfaces/Survey";
import { CitizensType, ICitizen, IMap } from "../../interfaces/Citizens";

export const types = {
  // auth
  login: "[Auth] Login",
  logout: "[Auth] Logout",

  // setting
  TOGGLE_NAV_COLLAPSED: "TOGGLE_NAV_COLLAPSED",
  SET_INITIAL_PATH: "SET_INITIAL_PATH",
  ROUTE_CHANGE: "@@router/LOCATION_CHANGE",

  // ui
  uiOpenModalAdd: "[ui] Open modal add",
  uiCloseModalAdd: "[ui] Close modal add",
  uiOpenModalEdit: "[ui] Open modal edit",
  uiCloseModalEdit: "[ui] Close modal edit",
  uiOpenModalDelete: "[ui] Open modal delete",
  uiCloseModalDelete: "[ui] Close modal delete",
  uiOpenModalAssign: "[ui] Open modal assign",
  uiCloseModalAssign: "[ui] Close modal assign",
  uiOpenModalAlert: "[ui] Open modal alert",
  uiCloseModalAlert: "[ui] Close modal alert",
  uiStartLoading: "[ui] Start loading",
  uiFinishLoading: "[ui] Finish loading",
  uiOpenAlert: "[ui] Open alert",
  uiCloseAlert: "[ui] Close alert",
  uiOpenSuccessAlert: "[ui] Open success alert",
  uiCloseSuccessAlert: "[ui] Close success alert",
  uiOpenErrorAlert: "[ui] Open error alert",
  uiCloseErrorAlert: "[ui] Close error alert",
  uiOpenDeleteSuccess: "[ui] Open delete success",
  uiCloseDeleteSuccess: "[ui] Close delete success",
  uiOpenDeleteError: "[ui] Open delete error",
  uiCloseDeleteError: "[ui] Close delete error",
  uiOpenQuestion: "[ui] Open edit question",
  uiCloseQuestion: "[ui] Close edit question",
  uiChangeRole: "[ui] Change role",
  uiSetprogres: "[ui] setProgress",

  // surveyors
  surveyorAddNew: "[surveyor] New surveyor",
  surveyorFromDB: "[surveyor] Surveyor from DB",
  surveyorActive: "[surveyor] Set active surveyor",
  surveyorCleanActive: "[survey] Clean active surveyor",
  surveyorsLoad: "[surveyor] Load surveyors",
  surveyorsLoadAssignedSurveys: "[surveyor] Load assigned surveys",
  surveyorsAddNewAssignedSurveys: "[surveyor] Add new assigned surveys",
  surveyorsDeleteAssignedSurveys: "[surveyor] Delete info assigned surveys",
  surveyorsUpdatedAssignedSurveys: "[surveyor] Updated assigned surveys",
  surveyorsDeleteAssignedSurvey: "[surveyor] Delete assigned survey",
  surveyorUpdated: "[surveyor] Updated surveyor",
  surveyorDelete: "[surveyor] Delete surveyor",
  surveyorsLogoutCleaning: "[surveyor] Cleaning surveyors",
  surveyorsTransmittedSurveys: "[surveyor] Load transmitted surveys",
  surveyorsInfoTransmittedSurveys: "[surveyor] Load info transmitted surveys",
  surveyorsIdResponsibleCitizens: "[surveyor] Set id responsible citizens",

  // survey
  surveyAddNew: "[survey] New survey",
  surveyActive: "[survey] Set active survey",
  surveyCleanActive: "[survey] Clean active survey",
  surveysCompleteLoad: "[survey] Load complete surveys",
  surveyUpdated: "[survey] Updated survey",
  surveyUpdatedSurveyors: "[survey] Updated survey surveyors",
  surveyDelete: "[survey] Delete survey",
  chaptersLoad: "[survey] Load chapters",
  chapterActive: "[survey] Set active chapter",
  chapterCleanActive: "[survey] Clean active chapter",
  questionActive: "[survey] Set active question",
  questionCleanActive: "[survey] Clean active question",
  chapterQuestionActive: "[survey] Set active chapter question",
  chapterQuestionCleanActive: "[survey] Clean active chapter question",

  // Search
  arraySearch: "[search] Array search",
  valueSearched: "[search] Value searched",

  // Citizens
  citizensLoad: "[citizen] Load citizens",
  citizensLoadSurveysAnswered: "[citizen] Load surveys answered",
  citizenActive: "[citizen] Set active citizen",
  citizenCleanActive: "[citizen] Clean active citizen",
  citizensLoadMapData: "[citizen] Load map data",

  //ENTITIES
  entitiesLoad: "[entities] load all entities",
  purgeEntities: "[entities] purge all entities",
  setActiveEntity: "[entities] set active entity",
  purgeActiveEntity: "[entities] purge active entity",
  addNewEntity: "[entities] add new entity",
  deleteEntity: "[entities] delete entity",
  updateEntity: "[entities] update entity",
};

//ENTITIES

export interface IEntity {
  activo: boolean;
  razonSocial: string;
  nit: string;
  direccion: string;
  celular: string;
  departamento: string;
  codigoSigep: string;
  codigoDane: string;
  municipio: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  identificacion: string;
}
export interface EntitiesState {
  entities: EntitiesType;
  entityActive: IEntity | null;
}
export type EntitiesType = IEntity[];
export interface EntitiesAction {
  type: string;
  payload?: EntitiesType | IEntity | string;
}

// Auth
export interface IAuth {
  uid: string | undefined | null;
  displayName: string | undefined | null;
  email: string | undefined | null;
  rol: string | undefined | null;
  municipios?: string[];
  municipio: string;
  nit: string;
  razonSocial: string;
}

export type AuthAction = {
  type: string;
  payload: IAuth;
};

// Ui
export interface IUi {
  modalAddOpen: boolean;
  modalEditOpen: boolean;
  modalDeleteOpen: boolean;
  modalAssignOpen: boolean;
  modalAlert: boolean;
  loading: boolean;
  alert: boolean;
  successAlert: boolean;
  errorAlert: boolean;
  deleteSuccess: boolean;
  deleteError: boolean;
  openQuestion: boolean;
  role: TypeUser;
  progress: number;
}

export type UiAction = {
  type: string;
  payload: IAuth;
};

// Surveyor
export interface ISurveyor {
  surveyors: Partial<Surveyor>[];
  activeSurveyor: Partial<Surveyor> | null;
  assignedSurveys: any;
  surveyorFromToDB: any;
  surveysTransmitted: any[];
  infoSurveysTransmitted: any[];
  idResponsibleCitizens: any[];
}

export type SurveyorsAction = {
  type: string;
  payload: any;
};

// Surveys
export interface ISurvey {
  surveys: Survey[];
  activeSurvey: Partial<Survey> | null;
  chapters: any[];
  activeChapter: Partial<Chapter> | null;
  activeQuestion: Partial<SurveyQuestion> | null;
  chapterQuestion: any | null;
}

export type SurveysAction = {
  type: string;
  payload: any;
};

// Search
export interface ISearch {
  data: any[];
  value: string;
}

export type SearchAction = {
  type: string;
  payload: any;
};

// Citizens
export interface CitizenState {
  citizens: CitizensType;
  surveysAnswered: Survey[];
  activeCitizen: Partial<ICitizen> | null;
  mapData: IMap;
}

export type CitizensAction = {
  type: string;
  payload: any;
};

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
