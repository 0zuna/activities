import React from 'react';
//import logo from './logo.svg';
import './App.css';
import 'materialize-css';
import 'materialize-css/sass/materialize.scss';
//import Dashboard from './components/dashboard'
import Login from './components/auth/login'
import Create from './components/auth/signup'
import { BrowserRouter as Router, Route, /*Link*/ } from "react-router-dom";
import {UserProvider} from './UserContext';

const App=()=>{
	return (
		<UserProvider>
		<Router>
			<Route path="/" component={Login} />
			<Route path="/create/" component={Create} />
		</Router>
		</UserProvider>
	);
}

export default App;
