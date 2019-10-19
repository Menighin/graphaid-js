export {}

declare global {
    interface Array<T> {
        any(predicate?: (x: T) => boolean): boolean;
        first(predicate?: (x: T) => boolean): T;
        last(predicate?: (x: T) => boolean): T;
    }
}

Array.prototype.any = function(predicate?: (x: any) => boolean): boolean {
    if (predicate)
        return this.filter(predicate).any();
    return this.length > 0;
}

Array.prototype.first = function(predicate?: (x: any) => boolean): any {
    let data = this;
    if (predicate)
        data = data.filter(predicate);
    if (data.any())
        return data[0];
    return null;
}

Array.prototype.last = function(predicate?: (x: any) => boolean): any {
    let data = this;
    if (predicate)
        data = data.filter(predicate);
    if (data.any())
        return data[data.length - 1];
    return null;
}