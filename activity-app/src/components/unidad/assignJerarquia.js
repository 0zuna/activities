import React, { useEffect, useState, useContext } from 'react'
//import M from 'materialize-css';
import { axi } from '../../config'
import {UserContext} from '../../UserContext';

const AssignJerarquia=({assign})=>{
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [users, setUsers]=useState([])
	const [search, setSearch]=useState('')
	const [actividades, setActividades]=useState([])
	useEffect(()=>{
		const AUTH_TOKEN = localStorage.getItem('access_token');
		axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
		axi.get('/api/auth/users').then(r=>{
			setUsers(r.data)
		}).catch(r=>alert('se ha producido un error'))

		const acto=arbol.flatMap((d,i)=>{
			return d.divisions.flatMap(division=>{
				return division.unidads.flatMap(unidad=>{
					return unidad.actividades.flatMap(act=>{
						return {...act,unidad:unidad.unidad,division:division.division,departamento:d.departamento}
					})
				})
			})
		})
		setActividades(acto)
	},[arbol])

	return (
		<div className="row">
			<nav className="yellow lighten-5">
				<div className="nav-wrapper">
					<form>
					<div className="input-field">
						<input onChange={(e)=>setSearch(e.target.value)} id="search" type="search" required/>
						<label className="label-icon" htmlFor="search"><i className="material-icons black-text">search</i></label>
						<i className="material-icons">close</i>
					</div>
					</form>
				</div>
			</nav>
		{actividades.filter(a=>a.actividad.toLowerCase().includes(search.toLowerCase())).map(act=>
		<div key={act.id} className="col">
			<a className="waves-effect waves-light btn" onClick={()=>assign(act)}>{act.actividad}</a>
		</div>
	).slice(0,30)
      }


  </div>
	)
}
export default AssignJerarquia
