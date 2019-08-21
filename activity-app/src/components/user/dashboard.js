import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { axios } from '../../config';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ActivitiesDone from './activitiesDone'
import ActivitiesForget from './activitiesForget'
import DayActivities from './dayActivities'
import Perfil from './perfil'
import Assigned from './assigned'

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
								<img src={axios.defaults.baseURL+"/assets/img/U.png"} style={{width:300}}/>
							</div>
							<div style={{width:100}}>
								<div className="ratio img-responsive img-circle" style={{backgroundImage:"url("+axios.defaults.baseURL+'assets/img/users/'+user.id+'.jpeg'+")"}}></div>
							</div>
							<a href="#name"><span className="white-text name" style={{fontSize:40,fontWeight: 'bold'}}>{user.name}</span></a>
							<a href="#email"><span className="white-text email" style={{fontWeight: 'bold'}}>{user.email}</span></a>
						</div>
					</li>
					{/*<li><a href="#!" className="waves-effect"><i className="material-icons">today</i>Mis Actividades Diarias</a></li>
					*/}
					<li><Link to="/" className="waves-effect"><i className="material-icons">today</i>Mis Actividades Diarias</Link></li>
					<li><Link to="/assigned" className="waves-effect"><i className="material-icons" style={{color:'purple'}}>new_releases</i>Mis Actividades Asignadas</Link></li>
					<li><Link to="/finish" className="waves-effect"><i className="material-icons" style={{color: 'green'}}>check</i>Mis actividades realizadas</Link></li>
					<li><Link to="/forget" className="waves-effect"><i className="material-icons" style={{color: 'red'}}>sentiment_very_dissatisfied</i>Actividades Olvidadas</Link></li>
					<li><div className="divider"></div></li>
					<li><a className="subheader">Configuración</a></li>
					<li><Link to="/myData" className="waves-effect" href="#!"><i className="material-icons" style={{color: 'blue'}}>account_circle</i>Mis Datos</Link></li>
					<li><a onClick={_salir} className="waves-effect"><i className="material-icons">exit_to_app</i>Salir</a></li>
				</ul>
				<a href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
			</div>
			<div className="col s12 m8 l9">
				<Route path="/" exact component={DayActivities} />
				<Route path="/finish" exact component={ActivitiesDone} />
				<Route path="/forget" exact component={ActivitiesForget} />
				<Route path="/myData" exact component={Perfil} />
				<Route path="/assigned" exact component={Assigned} />
			</div>
		</div>
	)
}

export default Dashboard
