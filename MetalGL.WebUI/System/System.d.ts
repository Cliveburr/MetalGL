
declare module System {
    export interface IEvent<T> {
        raise: T;
        add(fun: T): void;
        remove(fun: T): boolean;
    }
}