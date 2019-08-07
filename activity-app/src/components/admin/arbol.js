import React, { useEffect, useState, useContext } from 'react'
import { axi } from '../../config'
import {UserContext} from '../../UserContext';
import M from 'materialize-css';
import Departamento from './modalDepartamento'
import Division from './modalDivision'
import Unidad from './unidad'

const Arbol=()=>{
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [departamento,setDepartamento]=useState({user:{actividades:[]}})
	const [division,setDivision]=useState({user:{actividades:[]}})
	const [unidad,setUnidad]=useState({})
	useEffect(()=>{
		//init
		M.AutoInit();
		const AUTH_TOKEN = localStorage.getItem('access_token');
		axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
		axi.get('/api/data').then(r=>{
			setArbol(r.data)

		}).catch(r=>alert('se ha producido un error'))
	},[setArbol])
	const _departamentoShow=(d)=>{
		setDepartamento(d)
		if(d.user)
		axi.post('/api/actividad_user',{user_id:d.user.id})
			.then((r)=>{
				setDepartamento({...d,user:{...d.user,actividades:r.data}})
			})
			.catch(r=>alert(r))
	}
	const _divisionShow=(d)=>{
		setDivision(d)
		if(d.user)
		axi.post('/api/actividad_user',{user_id:d.user.id})
			.then((r)=>{
				setDivision({...d,user:{...d.user,actividades:r.data}})
			})
			.catch(r=>alert(r))
	}
	const _unniShow=(unni)=>{
		setUnidad(unni)
	}

	return (
		<div>
		<Departamento departamento={departamento} setDepartamento={setDepartamento} />
		<Division division={division} setDivision={setDivision} />
		<Unidad unidad={unidad} setUnidad={setUnidad} />
		<div style={{overflowX: 'scroll',overflowY: 'hidden',whiteSpace:'nowrap'}}>
		<div className="row" style={{ width:'8000px',marginBottom:'50px'}}>
			{arbol.map(d=>{
				return <div key={d.id} className='card'>
				<div className="col">
				<div className="card">
				<div className="card-content">
				<center>
				<a className="waves-effect waves-light btn-large black modal-trigger" data-target="modalDepartamento" onClick={()=>_departamentoShow(d)}>{d.departamento}</a>
				</center>
				<div className='row'>
				{d.divisions.map(div=>{
				return <div key={div.id} className='col'>
				<a className="waves-effect waves-light btn-large grey darken-4 modal-trigger" data-target="modalDivision" onClick={()=>_divisionShow(div)}>{div.division}</a>
						{div.unidads.map(unni=>{
						return <div key={unni.id} className='row'>
						<div className='col'>
				<a className="waves-effect waves-light btn-large white black-text modal-trigger" data-target="modalUnidad" onClick={()=>_unniShow(unni)}>{unni.unidad}</a>
						</div>
						</div>
						})
						}
					</div>
				})
				}
				</div>
				</div>
				</div>
		</div>
		</div>
					})
			}
		</div>
		</div>
		</div>)
}
export default Arbol
