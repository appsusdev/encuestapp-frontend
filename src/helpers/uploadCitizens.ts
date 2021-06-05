
import { CitizensType } from "../interfaces/Citizens";
import { addCitizen } from "../services/firebase/citizens";
export const uploadCitizens = async (data: CitizensType,callback:Function) => {
 
  try {
    let totalInserted = 0
    for (let citizen of data) {
      await addCitizen(citizen);
      totalInserted+=1
      callback(totalInserted)
    }
  } catch (error) {
    console.log("ERROR AL INSERTAR DATOS");
    return new Error(error);
  }
};
