import React, { useState, useContext, useEffect } from 'react'
import AssignUser from './assignUser'
import { axios } from '../../config'
import {UserContext} from '../../UserContext';


const Departamento = ({departamento,setDepartamento}) =>{
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [actividades, setActividades]=useState([{actividad:'actividad1',descripcion:'descripcion1', status:'En Proceso'}]);
	const [data, setData]=useState({newActividad:{actividad:''}})
	
	useEffect(()=>{
		const ar=arbol.map(d=>{
			if(d.id==departamento.id)
				return departamento
			return d
		})
		setArbol(ar)
	},[departamento])

	const _assignDep=(user)=>{
		axios.post('/api/jefe_dep',{departamento_id:departamento.id,user_id:user.id})
			.then((r)=>{
				setDepartamento({...departamento,user})
			})
			.catch(r=>alert(r))
	}
	const _newActivity=(e)=>{
		if(e.key=='Enter'){
		axios.post('/api/newActivityToUser',{...data.newActividad,user_id:departamento.user.id})
			.then(r=>{
				setData({...data,newActividad:{actividad:''}})
				setDepartamento({...departamento,user:{...departamento.user,actividades:[...departamento.user.actividades,r.data]}})
			})
			.catch(r=>alert(r))
		}
	}
	return (
		<div id="modalDepartamento" className="modal modal-fixed-footer">
			<div className="modal-content">
				<h4>{departamento.departamento}<small> (Departamento)</small></h4>
				<p>telefono: {departamento.telefono}</p>
				{departamento.user&&
				<div className="row">
					<div className="col s3">
						<div className="card">
							<div className="card-image">
								<img src={axios.defaults.baseURL+'assets/img/users/'+departamento.user.id+'.jpeg'} onError={(e)=>e.target.src=axios.defaults.baseURL+"assets/img/logo.jpeg"} alt="img"/>
								<span className="card-title">{departamento.user.name}</span>
							</div>
							<div className="card-contenti">
								<p>Jefe del departamento</p>
								<p>Celular: {departamento.user.celular}</p>
								<p>Correo: <a href={'mailto:'+departamento.user.email}>{departamento.user.email}</a></p>
							</div>
							<div className="card-action">
								<a href={'mailto:'+departamento.user.email}>Contactar</a>
							</div>
						</div>
					</div>
					<div className="col s6">
						<div className="card">
							<div className="card-content">
								<p>Actividades</p>
							</div>
							<div className="card-tabs">
								<ul className="tabs tabs-fixed-width">
									<li className="tab"><a className="active" href="#tab_enproceso">En Proceso</a></li>
									{/*<li className="tab"><a href="#test5">Terminadas</a></li>*/}
								</ul>
							</div>
							<div className="card-content grey lighten-4">
								<div id="tab_enproceso">
								{/*<div className="row">
										<div className="input-field col s12">
											<input id="act" type="text" onKeyDown={(e)=>_newActivity(e)} onChange={e=>setData({...data,newActividad:{actividad:e.target.value}})} value={data.newActividad.actividad}/>
											<label htmlFor="act">Nueva Actividad</label>
										</div>
									</div>
									*/}
									<ul className="collapsible">
									{departamento.user.actividades&&departamento.user.actividades.map((a,i)=>
										<li key={i}>
											<div className="collapsible-header">
												<i className="material-icons">assignment</i>
												{a.actividad}
											</div>
										</li>
									)}
									</ul>
								</div>
								{/*<div id="test5">Terminadas</div>*/}
							</div>
						</div>
					</div>
				</div>
				}
				{!departamento.user&&
				<div><p>Jefe sin asignar elija a un usuario</p>
				<AssignUser assign={_assignDep}/>
				</div>
				}
				
			</div>
			<div className="modal-footer">
				<a href="#!" className="modal-close waves-effect waves-green btn-flat">OK</a>
			</div>
		  </div>
	)
}
export default Departamento
