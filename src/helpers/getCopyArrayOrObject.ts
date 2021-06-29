export const getCopyArrayOrObject = (arrayOrObject: any) => {
    return JSON.parse(JSON.stringify(arrayOrObject));
};