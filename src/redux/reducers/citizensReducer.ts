import { CitizensAction, CitizenState, types } from '../types/types';

const initialState = {
    citizens: []
}

export const citizensReducer = ( state: CitizenState = initialState, action: CitizensAction) => {
    switch (action.type) {

        case types.citizensLoad:
            return {
                ...state,
                citizens: [...action.payload]
            }
            
        default:
            return state;
    }
}