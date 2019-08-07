import React, { useEffect, useContext, useState } from 'react';
import M from 'materialize-css';
import { UserContext } from '../../UserContext';
import { axi } from '../../config';
import Actividad from './actividad'

const Dashboard = () => {
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [misActividades, setMisActividades]=useState([])
	const f=new Date()
//cad=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
	
	useEffect(()=>{
		M.AutoInit();
		const AUTH_TOKEN = localStorage.getItem('access_token');
		axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
		axi.post('/api/auth/actividad_user',{user_id:user.id})
		.then(r=>{
			setMisActividades(r.data)
			console.log(r.data)
		})
		.catch(r=>alert(r))
	},[])
	return (
		<div className="row">
			<div className="col s12 m4 l3" style={{width: '300px'}}>
				<ul id="slide-out" className="sidenav sidenav-fixed">
					<li>
						<div className="user-view">
							<div className="background">
								<img src="http://lorempixel.com/400/200/sports/"/>
							</div>
							<a href="#user"><img className="circle" src="http://lorempixel.com/400/200/sports/"/></a>
							<a href="#name"><span className="white-text name">{user.name}</span></a>
							<a href="#email"><span className="white-text email">{user.email}</span></a>
						</div>
					</li>
					<li><a href="#!" className="waves-effect"><i className="material-icons">today</i>Mis Actividades</a></li>
					<li><div className="divider"></div></li>
					<li><a className="subheader">Datos</a></li>
					<li><a className="waves-effect" href="#!">Agenda</a></li>
				</ul>
				<a href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
			</div>
			<div className="col s12 m8 l9">
				<div className="col s12 m12">
					<div className="card-panel">
						<h2 className="center">HOY</h2>
						{misActividades.map(a=>
							<Actividad actividad={a} />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard