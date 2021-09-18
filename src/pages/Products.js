import { useDispatch, useSelector } from 'react-redux';
import products from '../records/products.json';
import inventory from '../records/inventory.json';
import { changeLayout, addProduct, removeFromCart } from '../store/product/productActions';
import { useState } from 'react';
import ProductComparison from '../components/ProductComparison';

//Functional component
const Products = () => {
    //Get layout view from the store based onn user preference 
    //By default grid is selected
    const layOutState = useSelector(state => state.product.currentLayout);
    //Get carts details from the store which added/update by user
    const carts = useSelector(state => state.product.carts);
    //Get total price of the all added products from the store 
    const totalPrice = useSelector(state => state.product.totalPrice);
    //Local state to maintain products for comparison
    const [comparisonProducts, setComparisonProducts] = useState([]);
    //Local state for Show/Hide Product comparison details component
    const [hideShowCompare, setHideShowCompare] = useState(false);

    const dispatch = useDispatch();

    //Fn to change layout table to grid or grid to table
    const onLayoutChange = (e) => {
        const name = e.target.checked ? 'grid' : 'table';
        dispatch(changeLayout(name))
    };

    //Fn to add Comparison product more then 2 products
    const onCompare = (product) => {
        if(comparisonProducts.length + 1 > 3) return alert('You can compare only 3 products');
        setComparisonProducts(state => {
            //Prevent duplicate product for comparison
            return [...new Set([...state, product.product_id])];
        });
    };

    //Fn to add products in the cart
    const addToCart = (product) => {
        const newProductId = product.product_id;
        const cartProduct = carts.find(c => c.product_id === newProductId);
        if(cartProduct) {
            const purchasedQty = cartProduct.purchase_quantity;
            const cartQty = cartProduct.qty;
            const { available_qty } = inventory.find(i => i.product_id === newProductId);
            //if there is limited avail qty and user tries to enter add to cart
            if((cartQty + 1) > available_qty) return alert(`Sorry! Only ${available_qty} available.`);
            //If particular product has limited purchased qty and we have to show error message.
            if((cartQty + 1) > purchasedQty) {
               document.getElementById('error'+newProductId).innerHTML = 'Max limit is '+purchasedQty;
            } 
            else {
                //Add product to the cart and redux store
                dispatch(addProduct(product));
            }
        } else {
            //Add product to the cart and redux store
            dispatch(addProduct(product));
        }
    };

    //Fn to remove products from the cart
    const removeProductFromCart = (id) => {
        //Remove product to the cart and redux store
        dispatch(removeFromCart(id))
    };

    //Fn to compare products from the cart
    const doCompare = () => {
        setHideShowCompare(state => !state);
    }

    //Fn to remove Comparison product more then 2 products
    const removeFromComparison = (index) => {
        comparisonProducts.splice(index, 1);
        let _comparisonProducts = [...comparisonProducts];
        setComparisonProducts(_comparisonProducts);
        if(_comparisonProducts.length < 2) {
            doCompare();
        }
    };

    return (
        <>
            <div className="py-2">
                <div className="row">
                    <div className="col-12">
                        <div className="form-check form-control-lg form-switch">
                            <input className="form-check-input" type="checkbox" id="layout" checked={(layOutState === 'grid') ? true : false} onChange={onLayoutChange}/>
                            <label className="form-check-label" htmlFor="layout">Grid View</label>
                            <button type="button" className="btn btn-success btn-sm position-relative float-end">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                                </svg><small>&nbsp;&nbsp;₹ {totalPrice}</small>
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {carts.length}
                                </span>
                            </button>
                            <button type="button" disabled={(comparisonProducts.length > 1) ? false : true} className="btn btn-light btn-sm float-end" onClick={doCompare}>Compare selected products</button>
                            &nbsp;&nbsp;&nbsp;
                        </div>
                    </div>
                </div>
            </div>
            {!hideShowCompare ?
                <div className="text-center">
                    <h2>Products</h2>
                    {(layOutState === 'table') ?
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Sr. no</th>
                            <th>Product Name</th>
                            <th>Product Price</th>
                            <th>Details</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {(products.length > 0) && products.map((product) => {
                                //TODO with best practices
                                const inventory_qty = inventory.find(i => i.product_id === product.product_id);
                                const isInCart = carts.find(c => c.product_id === product.product_id);

                                return (
                                    <tr key={product.product_id}>
                                        <td>
                                            <div className="card-img-actions"> 
                                                <img src={product.product_img} style={{height: '100px', width: '100px'}} className="card-img img-fluid" width="100" height="100" alt="Image" /> 
                                            </div>
                                        </td>
                                        <td className="text-success"><h4 className="pd-25">{product.product_name}</h4></td>
                                        <td><h5 className="pd-25">₹&nbsp;{product.price}</h5></td>
                                        <table className="table">
                                            <tbody>
                                                {Object.keys(product.details).map((p, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>
                                                               <span className="text-muted">{p.toUpperCase()}</span> : {product.details[p]}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        <td>
                                            <button type="button" className="btn btn-sm btn-secondary" onClick={() => onCompare(product)}>Compare</button>&nbsp;&nbsp;
                                            <button type="button" className="btn btn-sm btn-primary" onClick={() => addToCart(product)}>Add to cart</button>&nbsp;&nbsp;
                                            {isInCart && <button type="button" className="btn btn-sm btn-danger" onClick={() => removeProductFromCart(product.product_id)}>Remove from cart</button>}
                                            {isInCart && <p id={'error'+ product.product_id} className="text-danger"></p>}
                                            {(inventory_qty.available_qty <= 3) && <p className="text-warning"><strong>Hurry...Up! Only {inventory_qty.available_qty} items left.</strong></p>}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    :
                    <div className="container d-flex justify-content-center mt-50 mb-50">
                        <div className="row">
                            {products.map((product) => {
                                //TODO with best practices
                                const inventory_qty = inventory.find(i => i.product_id === product.product_id);
                                const isInCart = carts.find(c => c.product_id === product.product_id);

                                return (
                                    <div key={product.product_id} className="col-md-4 mt-2">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="card-img-actions"> <img src={product.product_img} className="card-img img-fluid" width="96" height="350" alt="" /> </div>
                                            </div>
                                            <div className="card-body bg-light text-center">
                                                <div className="mb-2">
                                                    <h3 className="font-weight-semibold mb-2"> <a href="#" className="text-success mb-2" data-abc="true">{product.product_name}</a> </h3>
                                                </div>
                                                <h6 className="mb-0 font-weight-semibold">₹ {product.price}</h6>
                                                <br/>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Details</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {Object.keys(product.details).map((p, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>
                                                                   <span className="text-muted"> {p.toUpperCase()} </span> : {product.details[p]}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                    </tbody>
                                                </table>
                                                <button type="button" className="btn btn-primary btn-sm" onClick={() => addToCart(product)}><i className="fa fa-cart-plus mr-2"></i> Add to cart</button>
                                                &nbsp;&nbsp;&nbsp;
                                                <button type="button" className="btn btn-sm btn-secondary" onClick={() => onCompare(product)}>Compare</button>&nbsp;&nbsp;
                                                {isInCart && <button type="button" className="btn btn-sm btn-danger" onClick={() => removeProductFromCart(product.product_id)}>Remove from cart</button>}<br/>
                                                <br/>
                                                {isInCart && <p id={'error'+ product.product_id} className="text-danger"></p>}
                                                {(inventory_qty.available_qty <= 3) && <p className="text-warning"><strong>Hurry...Up! Only {inventory_qty.available_qty} items left.</strong></p>}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }
                </div>
            :
                <div>
                    <ProductComparison products={products} comparisonProducts={comparisonProducts} removeFromComparison={removeFromComparison}/>
                </div>
            }
        </>
    )
}

export default Products;
