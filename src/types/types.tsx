export const types = {
    //auth
    login: '[Auth] Login',
    logout: '[Auth] Logout',

    //setting
    TOGGLE_NAV_COLLAPSED: 'TOGGLE_NAV_COLLAPSED',
    SET_INITIAL_PATH: 'SET_INITIAL_PATH',
    ROUTE_CHANGE: '@@router/LOCATION_CHANGE',
}

export interface IAuth {
    uid: string,
    name: string,
    email: string,
}

export type AuthAction = {
    type: string,
    payload: IAuth
}

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
