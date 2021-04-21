import { Setting } from '../interfaces/Setting';
import { SettingsActionTypes, types } from '../types/types';

const initialSettings: Setting = {
  navCollapsed: false,
  initialPath: '/',
};

const settingsReducer = (state = initialSettings, action: SettingsActionTypes) => {
  switch (action.type) {
    case types.ROUTE_CHANGE:
      return {
        ...state,
        navCollapsed: false,
      };

    case types.TOGGLE_NAV_COLLAPSED:
      return {
        ...state,
        navCollapsed: !state.navCollapsed,
      };

    case types.SET_INITIAL_PATH:
      return {
        ...state,
        initialPath: state.initialPath,
      };

    default:
      return state;
  }
};

export default settingsReducer;
