import { types } from '../types/types';

export const arraySearch = (data: any[]) => ({
    type: types.arraySearch,
    payload: data
});

export const valueSearched = (value: string) => ({
    type: types.valueSearched,
    payload: value
});
