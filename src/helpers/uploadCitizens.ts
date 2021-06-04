import { CitizensType } from "../interfaces/Citizens";
import { addCitizen } from "../services/firebase/citizens";

export const uploadCitizens = async (data: CitizensType) => {
  try {
    for (let citizen of data) {
      await addCitizen(citizen);
    }
  } catch (error) {
    console.log("ERROR AL INSERTAR DATOS");
    return new Error(error);
  }
};
