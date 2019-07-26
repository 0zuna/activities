import React from 'react';
//import logo from './logo.svg';
import './App.css';
import 'materialize-css';
import 'materialize-css/sass/materialize.scss';
//import Dashboard from './components/dashboard'
import Login from './components/login'
import Create from './components/create'
import { BrowserRouter as Router, Route, /*Link*/ } from "react-router-dom";
import {UserProvider} from './UserContext';

const App=()=>{
	return (
		<UserProvider>
		<Router>
			<div>
				<Route path="/" exact component={Login} />
				<Route path="/create/" component={Create} />
			</div>
		</Router>
		</UserProvider>
	);
}

export default App;
