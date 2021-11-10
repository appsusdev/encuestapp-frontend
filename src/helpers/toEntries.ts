export function toEntries<T>(a: T[]) {
    return a.map((value, index) => [index, value] as const);
}