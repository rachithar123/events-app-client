import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Account from "./containers/Account";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Events from "./containers/Events";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/events/new">
        <NewNote />
      </Route>
      <Route exact path="/events/:id">
        <Events />
      </Route>
      <Route exact path="/account">
        <Account />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}