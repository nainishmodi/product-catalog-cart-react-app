import { ADD_TO_CART, CHANGE_LAYOUT_VIEW, REMOVE_FROM_CART } from "./productTypes";

//fn to change layout
export const changeLayout = data => {
    return {
        type: CHANGE_LAYOUT_VIEW,
        payload: data
    };
};

//fn to addProduct to the cart and store
export const addProduct = data => {
    return {
        type: ADD_TO_CART,
        payload: data
    };
};

//fn to remove product to the cart and store
export const removeFromCart = data => {
    return {
        type: REMOVE_FROM_CART,
        payload: data
    };
};