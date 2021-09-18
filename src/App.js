import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";

import { Provider } from "react-redux";
import store from "./store";
import Routes from "./routes";

function App() {
  return (
    <Provider store={store}>
      <div className="container">
        <div className="row">
            <Routes />
        </div>
      </div>
    </Provider>
  );
}

export default App;
