import { CitizensType } from "../interfaces/Citizens";
import { uploadFileAsync } from "../services/firebase/auth";
import { addCitizen } from "../services/firebase/citizens";
export const uploadCitizens = async (
  data: CitizensType,
  callback: Function
) => {
  try {
    let totalInserted = 0;
    for (let citizen of data) {
      await addCitizen(citizen);
      totalInserted += 1;
      callback(totalInserted);
    }
  } catch (error) {
    return new Error(`ERROR AL INSERTAR DATOS ${error}`);
  }
};
export const uploadJsonCitizens = async (jsonData: string, nit: string) => {
  try {
    //await addJsonCitizens(jsonData, nit);
   //create blob to upload json
   const blob = new Blob([jsonData], {type: "application/json"});
   await uploadFileAsync(blob,`json/${nit}/citizens.json`);
  
    
  } catch (error) {
    throw new Error(`ERROR AL INSERTAR DATOS ${error}`);
  }
};
