import { UserType } from "../../types/graphql";

const initialState: UserType = {
    id: "",
    tag: "",
    avatarUrl: "",
    bio: "",
    bots: [],
    newUser: false,
    notifications: [],
};

const userReducer = (
    state = initialState,
    action: { type: string; payload: any }
) => {
    switch (action.type) {
        case "SET_USER":
            state = {
                id: action.payload.id,
                tag: action.payload.tag,
                avatarUrl: action.payload.avatarUrl,
                bio: action.payload.bio,
                bots: action.payload.bots,
                newUser: action.payload.newUser,
                notifications: action.payload.notifications,
            };
            break;

        case "RESET_USER":
            state = {
                id: "",
                tag: "",
                avatarUrl: "",
                bio: "",
                bots: [],
                newUser: false,
                notifications: [],
            };
            break;

        default:
            break;
    }

    return state;
};

export default userReducer;
