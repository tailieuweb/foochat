import React from "react";
import { Route, Router, Switch } from "react-router-dom";

import { history } from "./configs/browserHistory";

import LoginAdmin from "./components/Authentication/LoginAdmin";
import RegisterAdmin from "./components/Authentication/RegisterAdmin";
import LoginUser from "./components/Authentication/LoginUser";
import RegisterUser from "./components/Authentication/RegisterUser";

import Chat from "./components/Chat/Chat";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles.scss";
import "./assets/tailwind.css";
import "./assets/main.css";

class App extends React.Component {
	render() {
		return (
			<Router history={history}>
				<Switch>
					<Route exact path="/admin" component={LoginAdmin} />
					<Route
						exact
						path="/admin/register"
						component={RegisterAdmin}
					/>
					<Route exact path="/" component={LoginUser} />
					<Route exact path="/register" component={RegisterUser} />
					<Route exact path="/admin/chat" component={Chat} />
					<Route exact path="/admin/chat/:id" component={Chat} />
				</Switch>
			</Router>
		);
	}
}
export default App;
