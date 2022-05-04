import { firebase } from "../config/firebase/firebase-config";

export const uploadFileAsync = async (
  file: File | Blob,
  fileName: string
): Promise<string> => {
  return new Promise(async (res, rej) => {
    const upload = firebase.storage().ref(fileName).put(file);
    upload.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        rej(err);
      },
      async () => {
        const url = await upload.snapshot?.ref.getDownloadURL();
        res(url as string);
      }
    );
  });
};
