import { SettingsActionTypes, types } from '../types/types';

export const toggleNavCollapsed = () => ({ type: types.TOGGLE_NAV_COLLAPSED });

export const setInitialPath = (
    initialPath: string | undefined,
): SettingsActionTypes => ({
    type: types.SET_INITIAL_PATH,
    initialPath,
});
