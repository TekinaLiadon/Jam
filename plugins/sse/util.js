export function isAsyncIterable(source) {
    if (source === null || source === undefined || typeof source !== "object") {
        return false;
    }
    else return Symbol.asyncIterator in source;
}