const Comparison = ({products, comparisonProducts, removeFromComparison}) => {

    return (
        <>
            <div className="container">
                    <div className="row">
                        {comparisonProducts.map((id, index) => {
                            const product = products.find(p => p.product_id === id);
                            return (
                                <div key={product.product_id} className="col-md-4 mt-2">
                                    <div className="card">
                                        <div className="card-body bg-light text-center">
                                            <div className="mb-2">
                                                <h3 className="font-weight-semibold mb-2"> <a href="#" className="text-default mb-2" data-abc="true">{product.product_name}</a> </h3>
                                            </div>
                                            <h6 className="mb-0 font-weight-semibold">₹ {product.price}</h6>
                                        </div>
                                        <table className="table text-center">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {Object.keys(product.details).map((p, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{p.toUpperCase()} : {product.details[p]}</td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                        <button type="button" className="btn btn-danger" onClick={() => removeFromComparison(index)}>Remove from comparison</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
        </>
    )
}

export default Comparison;
