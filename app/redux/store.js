import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { authReducer } from './reducers/authReducers';
import { entReducer } from './reducers/entReducers';
import { tbReducer } from './reducers/tbReducers';


const rootReducer = combineReducers({
    authReducer: authReducer,
    entReducer: entReducer,
    tbReducer: tbReducer
})

export const store = createStore(rootReducer,(applyMiddleware(thunk)))