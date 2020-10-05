import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import ReduxThunk from "redux-thunk";
import userReducer from "./reducers/user.reducer";

const store = createStore(
    combineReducers({
        userReducer,
    }),
    composeWithDevTools(applyMiddleware(ReduxThunk))
);

export default store;
