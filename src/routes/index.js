import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//UI views
import Products from "../pages/Products";
import Navbar from "../components/Navbar";

const pages = [
    {
        exact: true,
        path: "/",
        component: Products,
        key: 1
    }
];

const Routes = () => {
    return (
        <Router>
            <Navbar />
            <hr/>
            <Switch>
                {pages.map((route) => {
                    return <Route {...route} />
                })}
            </Switch>
        </Router>
    )
};

export default Routes;