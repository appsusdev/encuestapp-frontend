export const convertDate = (input: string | undefined) => {
    const array = (input || '').toString().split('-');

    return `${array[2]}/${array[1]}/${array[0]}`;
}