import { TypeUser } from "../../enums/enums";
import { Surveyor } from "../../interfaces/Surveyor";
import { Survey, Chapter, SurveyQuestion } from '../../interfaces/Survey';

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
    uiOpenModalAlert: '[ui] Open modal alert',
    uiCloseModalAlert: '[ui] Close modal alert',
    uiStartLoading: '[ui] Start loading',
    uiFinishLoading: '[ui] Finish loading',
    uiOpenAlert: '[ui] Open alert',
    uiCloseAlert: '[ui] Close alert',
    uiOpenSuccessAlert: '[ui] Open success alert',
    uiCloseSuccessAlert: '[ui] Close success alert',
    uiOpenErrorAlert: '[ui] Open error alert',
    uiCloseErrorAlert: '[ui] Close error alert',
    uiOpenQuestion: '[ui] Open edit question',
    uiCloseQuestion: '[ui] Close edit question',
    uiChangeRole: '[ui] Change role',
    uiSetprogres: '[ui] setProgress',

    // surveyors
    surveyorAddNew: '[surveyor] New surveyor',
    surveyorFromDB: '[surveyor] Surveyor from DB',
    surveyorActive: '[surveyor] Set active surveyor',
    surveyorsLoad: '[surveyor] Load surveyors',
    surveyorsLoadAssignedSurveys: '[surveyor] Load assigned surveys',
    surveyorUpdated: '[surveyor] Updated surveyor',
    surveyorDelete: '[surveyor] Delete surveyor',
    surveyorsLogoutCleaning: '[surveyor] Cleaning surveyors',

    // survey
    surveyAddNew: '[survey] New survey',
    surveyActive: '[survey] Set active survey',
    surveyCleanActive: '[survey] Clean active survey',
    surveysCompleteLoad: '[survey] Load complete surveys',
    surveysDataLoad: '[survey] Load data surveys',
    surveyUpdated: '[survey] Updated survey',
    surveyDelete: '[survey] Delete survey',
    chaptersLoad: '[survey] Load chapters',
    chapterActive: '[survey] Set active chapter',
    chapterCleanActive: '[survey] Clean active chapter',
    questionActive: '[survey] Set active question',
    questionCleanActive: '[survey] Clean active question',
    chapterQuestionActive: '[survey] Set active chapter question',
    chapterQuestionCleanActive: '[survey] Clean active chapter question',

    // Search
    arraySearch: '[search] Array search',
    valueSearched: '[search] Value searched'
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
  modalAlert: boolean,
  loading: boolean,
  alert: boolean,
  successAlert: boolean,
  errorAlert: boolean,
  openQuestion: boolean,
  role: TypeUser,
  progress:number
}

export type UiAction = {
  type: string,
  payload: IAuth
}

// Surveyor
export interface ISurveyor {
  surveyors: Partial<Surveyor>[],
  activeSurveyor: Partial<Surveyor> | null,
  assignedSurveys: any,
  surveyorFromToDB: any
}

export type SurveyorsAction = {
  type: string,
  payload: any
}

// Surveys
export interface ISurvey {
  surveys: Survey[],
  dataSurveys: Survey[],
  activeSurvey: Partial<Survey> | null,
  chapters: any[]
  activeChapter: Partial<Chapter> | null,
  activeQuestion: Partial<SurveyQuestion> | null,
  chapterQuestion: any | null
}

export type SurveysAction = {
  type: string,
  payload: any
}

// Search
export interface ISearch {
  data: any[],
  value: string
}

export type SearchAction = {
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
