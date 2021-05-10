import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import routes
import { routes } from "./router";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          {routes.map((route) => (
            <Route
              exact
              path={route.path}
              component={route.component}
              key={route.id}
            />
          ))}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
