import React,{useEffect, useContext, useState} from 'react';
import M from 'materialize-css';
import {UserContext} from '../../UserContext';
import { axios } from '../../config'
import Arbol from './arbol'

const Dash=()=>{
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [data,setData]=useState({});
	useEffect(()=>{
		let elems = document.querySelectorAll('.dropdown-trigger');
		M.Dropdown.init(elems, {inDuration: 300, outDuration: 225});
		var elem = document.querySelector('.sidenav');
		M.Sidenav.init(elem, {
			inDuration: 350,
			outDuration: 350,
			edge: 'left'
		});
	},[])
	const _salir=()=>{
		axios.get('/api/logout')
		.then(r=>{
			console.log(r.data)
			setAuth(false)
		})
	}
	const _upexcel=(e)=>{
		var reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = () => {
			axios.post('/api/upexcel',{excel:reader.result})
			.then(response=>{
				console.log(response.data)
				setArbol(response.data)
			})
			.catch(response=>console.log(response.data))
		};
	}
	return (
	<div>
		<nav className="grey darken-2">
			<div className="nav-wrapper container">
				<a href="#!" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
				<a href="#!" className="brand-logo">Actividades</a>
				<ul id="nav-mobile" className="right hide-on-med-and-down">
					{/*<li><a href="#!">Item 1</a></li>
					<li><a href="#!">Item 2</a></li>
					<li><a href="#!">Item 3</a></li>*/}
					<ul id="dropdown1" className="dropdown-content">
						<li>
						{/*<a href="#!">Subir excel</a>*/}
							<a href="#!" className="file-field input-field">Subir excel
							<input onChange={(e)=>_upexcel(e)} type="file" className="form-control-file"/>
							</a>
						</li>
						<li className="divider"></li>
						<li><a href="#!" onClick={_salir}>Salir</a></li>
					</ul>
					<li><a className="dropdown-trigger" href="#!" data-target="dropdown1">Opciones<i className="material-icons right">arrow_drop_down</i></a></li>
				</ul>
			</div>
			<ul id="slide-out" className="sidenav">
				<li>
					<div className="user-view">
						<div className="background">
							<img src="http://materializecss.com/images/office.jpg" alt="Background User View" ></img>
						</div>
						<a href="#user"><img className="circle" src="http://materializecss.com/images/yuna.jpg" alt="Avatar User View" /></a>
						<a href="#name"><span className="white-text name">Pretty Woman</span></a>
						<a href="#email"><span className="white-text email">prettywoman@gmail.com</span></a>
					</div>
				</li>
				<li><a className="waves-effect" href="#!">Item 1</a></li>
				<li><a className="waves-effect" href="#!">Item 2</a></li>
				<li><a className="waves-effect" href="#!">Item 3</a></li>
				<ul id="dropdown2" className="dropdown-content">
					<li><a href="#!">Subir excel</a></li>
					<li className="divider"></li>
					<li><a href="#!">Salir</a></li>
				</ul>
				<li><a className="dropdown-trigger" href="#!" data-target="dropdown2">Opciones<i className="material-icons right">arrow_drop_down</i></a></li>
			</ul>
		</nav>
		<Arbol />
	</div>
  );
}

export default Dash;
