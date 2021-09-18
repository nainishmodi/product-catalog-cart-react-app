import { combineReducers } from "redux";
import productsReducer from "./product/productReducer";

const rootReducer = combineReducers({
    product: productsReducer
});

export default rootReducer;