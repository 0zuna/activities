import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { axios } from '../../config';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ActivitiesDone from './activitiesDone'
import ActivitiesForget from './activitiesForget'
import DayActivities from './dayActivities'

const Dashboard = () => {
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	
	const _salir=()=>{
		axios.get('/api/logout')
		.then(r=>{
			console.log(r.data)
			setAuth(false)
		})
	}
	
	const hechas=()=>{
		return (
			<div className="card-panel">
				<div>hola</div>
			</div>
		)
	}
	return (
		<div className="row">
			<div className="col s12 m4 l3" style={{width: '300px'}}>
				<ul id="slide-out" className="sidenav sidenav-fixed">
					<li>
						<div className="user-view">
							<div className="background">
								<img src="http://dimitri/usupso/activities/activity/public/assets/img/usupso_store.jpeg" style={{width:400}}/>
							</div>
							<a href="#user"><img className="circle" src="http://dimitri/usupso/activities/activity/public/assets/img/logo.jpeg"/></a>
							<a href="#name"><span className="white-text name">{user.name}</span></a>
							<a href="#email"><span className="white-text email">{user.email}</span></a>
						</div>
					</li>
					{/*<li><a href="#!" className="waves-effect"><i className="material-icons">today</i>Mis Actividades Diarias</a></li>
					*/}
					<li><Link to="/" className="waves-effect"><i className="material-icons">today</i>Mis Actividades Diarias</Link></li>
					<li><Link to="/finish" className="waves-effect"><i className="material-icons" style={{color: 'green'}}>check</i>Mis actividades realizadas</Link></li>
					<li><Link to="/forget" className="waves-effect"><i className="material-icons" style={{color: 'red'}}>sentiment_very_dissatisfied</i>Actividades Olvidadas</Link></li>
					<li><div className="divider"></div></li>
					<li><a className="subheader">Datos</a></li>
					<li><a className="waves-effect" href="#!">Mis Datos</a></li>
					<li><a onClick={_salir} className="waves-effect"><i className="material-icons">exit_to_app</i>Salir</a></li>
				</ul>
				<a href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
			</div>
			<div className="col s12 m8 l9">
				<Route path="/" exact component={DayActivities} />
				<Route path="/finish" exact component={ActivitiesDone} />
				<Route path="/forget" exact component={ActivitiesForget} />
			</div>
		</div>
	)
}

export default Dashboard
