import userReducer from "./reducers/user.reducer";
import {combineReducers} from "redux";
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";
import groupReducer from "./reducers/group.reducer";
import errorReducer from "./reducers/error.reducer";
import messageReducer from "./reducers/message.reducer";


const persistConfig = {
    key: "root", 
    storage,
}

const rootReducer = combineReducers({
    user: userReducer,
    groups: groupReducer,
    errors: errorReducer,
    messages: messageReducer

})

export default persistReducer(persistConfig, rootReducer)