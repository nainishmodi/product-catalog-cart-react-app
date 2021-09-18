import { ADD_TO_CART, CHANGE_LAYOUT_VIEW, REMOVE_FROM_CART } from "./productTypes";

//Fn to save some form data to the local storage
function saveStateToLocalAStorage(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("productDetails", serializedState);
    }
    catch(e){}
};

//Fn to get store data from the local storage
function loadStateFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem("productDetails");
        if(!serializedState) return;
        return JSON.parse(serializedState);
    }
    catch(e){}
};

const initialState = loadStateFromLocalStorage() || {
    currentLayout: "grid",
    carts: [],
    totalPrice: 0,
    comparesProducts: []
};

//Form builder reducer fn.
const productDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_LAYOUT_VIEW:
            const newState = {
                ...state,
                currentLayout: action.payload
            };
            //Saving data to the local storage after save to the store
            saveStateToLocalAStorage(newState);
            return newState;
        case ADD_TO_CART:
            const newCart = [...state.carts];
            let cart_product = action.payload;
            const idx = newCart.findIndex(n => n.product_id === action.payload.product_id);
            //if already added product then we are updating the qty and price
            if(idx >= 0) {
                newCart[idx].qty += 1;
                newCart[idx].price += cart_product.price;
            } else {
                cart_product = {...cart_product, qty: 1}
                newCart.push(cart_product);
            }
            //Calculate cart price
            const totalPrice = newCart.reduce((a,c) => {
                return a + c.price;
            }, 0)

            const cartState = {
                ...state,
                carts: newCart,
                totalPrice
            };
            //Saving data to the local storage after save to the store
            saveStateToLocalAStorage(cartState);
            return cartState;

        case REMOVE_FROM_CART:
            let removeCart = [...state.carts];
            let productId = action.payload;
            
            const index = removeCart.findIndex(n => n.product_id === productId);
            //If same product with multiple qty then we update the cart
            if(index >= 0 && removeCart[index].qty > 1) {
                removeCart[index].qty -= 1;
                removeCart[index].price -= removeCart[index].price;
            } else {
                removeCart.splice(index, 1);
            }
            const _totalPrice = removeCart.reduce((a,c) => {
                return a + c.price;
            }, 0);
            
            const removedState = {
                ...state,
                carts: removeCart,
                totalPrice: _totalPrice
            };
            //Saving data to the local storage after save to the store
            saveStateToLocalAStorage(removedState);
            return removedState;
        default:
            return state;
    }
};

export default productDetailsReducer;