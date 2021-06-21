import { getCitizens } from '../../services/firebase/citizens';
import { CitizensType } from '../../interfaces/Citizens';
import { types } from '../types/types';

export const startLoadingCitizens = () => {
  return async (dispatch: Function) => {
    const jsonResponse: any = await getCitizens();
    const parseJson = await JSON.parse(jsonResponse.data);

    dispatch( setCitizens( JSON.parse(parseJson)) );
  };
};

export const setCitizens = (citizens: CitizensType)=> ({
  type: types.citizensLoad,
  payload: citizens,
});
