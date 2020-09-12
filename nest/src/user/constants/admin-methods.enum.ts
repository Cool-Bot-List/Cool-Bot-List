export enum AdminMethods {
    ADD = "add",
    REMOVE = "remove"
}

export type AdminMethodResolvable = AdminMethods.ADD | AdminMethods.REMOVE;