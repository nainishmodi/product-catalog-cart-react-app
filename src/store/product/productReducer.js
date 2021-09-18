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

//Fn to calculate price all items whoch are already in the cart.
function calculateTotalPrice(lists) {
    return lists.reduce((a,c) => {
        return a + c.price;
    }, 0)
};

const initialState = loadStateFromLocalStorage() || {
    currentLayout: "grid",
    carts: [],
    totalPrice: 0,
    comparesProducts: []
};

//Form builder reducer fn.
const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_LAYOUT_VIEW:
            const layoutState = {
                ...state,
                currentLayout: action.payload
            };
            //Saving data to the local storage after save to the store
            saveStateToLocalAStorage(layoutState);
            return layoutState;
        case ADD_TO_CART:
            const newCarts = [...state.carts];
            let cart_product = action.payload;
            const idx = newCarts.findIndex(n => n.product_id === action.payload.product_id);
            //if already added product then we are updating the qty and price
            if(idx >= 0) {
                newCarts[idx].qty += 1;
                newCarts[idx].price += cart_product.price;
            } else {
                cart_product = {...cart_product, qty: 1}
                newCarts.push(cart_product);
            }
            //Calculate cart price
            const totalPrice = calculateTotalPrice(newCarts);

            const cartState = {
                ...state,
                carts: newCarts,
                totalPrice
            };
            //Saving data to the local storage after save to the store
            saveStateToLocalAStorage(cartState);
            return cartState;

        case REMOVE_FROM_CART:
            let _carts = [...state.carts];
            let productId = action.payload;
            
            const index = _carts.findIndex(n => n.product_id === productId);
            //If same product with multiple qty then we update the cart
            if(index >= 0 && _carts[index].qty > 1) {
                const _price = _carts[index].price / _carts[index].qty;
                _carts[index].qty -= 1;
                _carts[index].price = _price;
            } else {
                _carts.splice(index, 1);
            }

            const _totalPrice = calculateTotalPrice(_carts)
            
            const removedState = {
                ...state,
                carts: _carts,
                totalPrice: _totalPrice
            };
            //Saving data to the local storage after save to the store
            saveStateToLocalAStorage(removedState);
            return removedState;
        default:
            return state;
    }
};

export default productsReducer;