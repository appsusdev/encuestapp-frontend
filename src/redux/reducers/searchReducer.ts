import { types, ISearch, SearchAction } from '../types/types';

const initialState = {
    data: [],
    value: ''
}

export const searchReducer = ( state: Partial<ISearch> = initialState, action: SearchAction) => {
    switch (action.type) {
        case types.arraySearch:
            return {
                ...state,
                data: [ ...action.payload ]
            }

        case types.valueSearched:
            return {
                ...state,
                value: action.payload
            }
    
        default:
            return state;
    }
}