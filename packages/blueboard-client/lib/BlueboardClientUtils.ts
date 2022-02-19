export const checkIterable = (obj: any): boolean => {
    return obj !== null && typeof obj[Symbol.iterator] === "function";
};
