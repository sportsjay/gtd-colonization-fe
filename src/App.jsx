import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import routes
import { routes } from "./router";

function App() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Quicksand:300,500"
        rel="stylesheet"
      ></link>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
        integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
        crossorigin="anonymous"
      />
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
    </>
  );
}

export default App;
