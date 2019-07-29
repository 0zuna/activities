import React, { useEffect, useState } from 'react'
import AssignUser from './assignUser'
import { axi } from '../config'


const Division = ({division,setDivision}) =>{
	const [actividades, setActividades]=useState([{actividad:'actividad1',descripcion:'descripcion1', status:'En Proceso'}]);
	const [data, setData]=useState({newActividad:{actividad:''}})
	useEffect(()=>{
		const AUTH_TOKEN = localStorage.getItem('access_token');
		axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
	},[])
	
	const _assignDiv=(user)=>{
		axi.post('/api/auth/jefe_div',{division_id:division.id,user_id:user.id})
			.then((r)=>{
				setDivision({...division,user})
			})
			.catch(r=>alert('ha ocurrido un error'))
	}
	const _newActivity=(e)=>{
		if(e.key=='Enter'){
		axi.post('/api/auth/newActivity',{...data.newActividad,user_id:division.user.id})
			.then(r=>{
				setData({...data,newActividad:{actividad:''}})
				setDivision({...division,user:{...division.user,actividades:[...division.user.actividades,r.data]}})
			})
			.catch(r=>alert(r))
		}
	}
	return (
		<div id="modalDivision" className="modal">
			<div className="modal-content">
				<h4>{division.division}<small> (Division)</small></h4>
				<p>telefono: {division.telefono}</p>
				{division.user&&
				<div className="row">
					<div className="col s3">
						<div className="card">
							<div className="card-image">
								<img src="https://media.revistagq.com/photos/5ca5f030267a328ad27242c3/16:9/w_1920,c_limit/como_llevarte_bien_con_tu_jefe_regla_5_15_felicidad_trabajo_2065.jpg" alt='img'/>
								<span className="card-title">{division.user.name}</span>
							</div>
							<div className="card-contenti">
								<p>Jefe de division</p>
								<p>Celular: 33987765</p>
								<p>Correo: <a href={'mailto:'+division.user.email}>{division.user.email}</a></p>
							</div>
							<div className="card-action">
								<a href={'mailto:'+division.user.email}>Contactar</a>
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
									<div className="row">
										<div className="input-field col s12">
											<input id="act" type="text" onKeyDown={(e)=>_newActivity(e)} onChange={e=>setData({...data,newActividad:{actividad:e.target.value}})} value={data.newActividad.actividad}/>
											<label htmlFor="act">Nueva Actividad</label>
										</div>
									</div>
									<ul className="collapsible">
									{division.user.actividades&&division.user.actividades.map((a,i)=>
										<li key={i}>
											<div className="collapsible-header">
												<i className="material-icons">assignment</i>
												{a.actividad}
												<span className="new badge">1</span>
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
				{!division.user&&
				<div><p>Jefe sin asignar elija a un usuario</p>
				<AssignUser assign={_assignDiv}/>
				</div>
				}
				
			</div>
			<div className="modal-footer">
				<a href="#!" className="modal-close waves-effect waves-green btn-flat">OK</a>
			</div>
		  </div>
	)
}
export default Division
