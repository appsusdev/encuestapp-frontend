
import { CitizensType } from "../interfaces/Citizens";
import { addCitizen, addJsonCitizens } from "../services/firebase/citizens";
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
    return new Error(`ERROR AL INSERTAR DATOS ${error}`);
  }
};
export const uploadJsonCitizens = async (jsonData:string)=>{
  try {
    await addJsonCitizens(jsonData)
  } catch (error) {
    return new Error(`ERROR AL INSERTAR DATOS ${error}`);
    
  }

}
