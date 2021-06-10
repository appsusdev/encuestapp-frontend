import * as XLSX from "xlsx";
export const excelToJson = (file: File,callback:Function): Promise<string> => {
  return new Promise((res, rej) => {
    //const name = file.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */

      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws);
      /* Update state */
      //console.log("Data>>>" + data);// shows that excel data is read
      //console.log(convertToJson(data)); // shows data in json format
      res(convertToJson(data,callback));
    };
    reader.readAsBinaryString(file);
  });
};
const convertToJson = (csv: any,onProgress:Function) => {
  const lines = csv.split("\n");
  const result = [];

  const headers: any[] = lines[0].split(",");
  let totalParse=0;

  for (let i = 1; i < lines.length-1; i++) {
    let obj: any = {};
    let currentline = lines[i].split(",");

    for (let j = 0; j <= headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    
    
    result.push(obj);
    totalParse+=1;
    onProgress(totalParse,lines.length)
  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
};
