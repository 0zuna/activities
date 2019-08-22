import React, { useEffect, useState, useContext } from 'react'
import { axios } from '../../config'
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
		axios.get('/api/data').then(r=>{
			setArbol(r.data)
			console.log(r.data)

		}).catch(r=>alert(r))
	},[setArbol])
	const _departamentoShow=(d)=>{
		setDepartamento(d)
		if(d.user)
		axios.post('/api/actividad_user',{user_id:d.user.id})
			.then((r)=>{
				setDepartamento({...d,user:{...d.user,actividades:r.data}})
			})
			.catch(r=>alert(r))
	}
	const _divisionShow=(d)=>{
		setDivision(d)
		if(d.user)
		axios.post('/api/actividad_user',{user_id:d.user.id})
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
				<a className="waves-effect waves-light btn-large white black-text modal-trigger" data-target="modalUnidad" onClick={()=>_unniShow(unni)}>{unni.unidad}
				{unni.notDone>0&&
					<span className="badge circle" style={{border:'1px solid red',backgroundColor:'#FFD8D8',boxShadow: '0px 0px 10px red'}}>{unni.notDone}</span>
				}
				{unni.inProcess>0&&
					<span className="badge circle" style={{border:'1px solid yellow',backgroundColor:'#FFFCEA',boxShadow: '0px 0px 10px yellow'}}>{unni.inProcess}</span>
				}
				{unni.done>0&&
					<span className="badge circle" style={{border:'1px solid green',backgroundColor:'#E0FFC2',boxShadow: '0px 0px 10px green'}}>{unni.done}</span>
				}
				</a>
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
