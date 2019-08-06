import React, { useEffect, useState } from 'react'
import AssignUser from '../assignUser'
import M from 'materialize-css';
import { axi } from '../../config';
import Jerarquia from './jerarquia'
//import $ from 'jquery'
//window.$=$


const Unidad = ({unidad,setUnidad}) =>{
	const [actividades, setActividades]=useState([{actividad:'actividad1',descripcion:'descripcion1', status:'En Proceso'}]);
	const [data, setData]=useState({actividad:{ sub_actividades:[] }})
	const [search, setSearch]=useState({})
	useEffect(()=>{
		const AUTH_TOKEN = localStorage.getItem('access_token');
		axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
		//fecha
		var elem = document.querySelector('#date');
		M.Datepicker.init(elem, {format:'yyyy-mm-dd',autoClose:false,i18n:{
			cancel:'cancelar',
			months:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			monthsShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
			weekdays: [ 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado' ],
			weekdaysShort: [ 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab' ],
			weekdaysAbbrev:	['D','L','M','M','J','V','S'],
		},
			onSelect:(d)=>{
			//console.log(d.toISOString().substr(0,10))
			setData({...data,actividad:{...data.actividad,fecha:d.toISOString().substr(0,10)}})
			},
			/*onCloseEnd:()=>{
			setData({...data,actividad:{...data.actividad,fecha:d.toISOString().substr(0,10)}})
			}*/
		});
		//hora
		M.Timepicker.init(document.querySelectorAll('#time'), {
			twelveHour:false,
			onCloseEnd:()=>{
				setData({...data,actividad:{...data.actividad,hora:document.querySelector('#time').value}})
			}
		});
	})

	const _descripcion=(act)=>{
		setData({...data,actividad:{...data.actividad,descripcion:act}})
		console.log(data)
	}
	const _updateActivity=()=>{
		//console.log(data)
		axi.put('/api/auth/updateActivity',data.actividad)
		.then(r=>{
			const acto=unidad.actividades.map(a=>{
				if(a.id==data.actividad.id)
					return data.actividad
				return a
			})
			setUnidad({...unidad,actividades:acto})
		})
		.catch(r=>alert(r))
	}
	const _newSub=(e)=>{
		if(e.key=='Enter'){
			axi.post('/api/auth/newSubActivity',{actividad_id:data.actividad.id,subactividad:data.newSubActividad})
			.then(r=>{
				setData({...data,actividad:{...data.actividad,sub_actividades:[...data.actividad.sub_actividades,r.data]}})
				console.log(r.data)
			})
			//setData({...data,actividad:{...data.actividad,sub_actividades:[...data.actividad.sub_actividades,{subactividad:data.newSubActividad}]}})
			//setData({...data,newSubActividad:''})
		}
	}
	const _assignActivity=(u)=>{
		//console.log({...data,data.actividad.users})
		axi.post('/api/auth/assignActivity',{user_id:u.id,actividad_id:data.actividad.id})
		.then(r=>{
			setData({...data,actividad:{...data.actividad,users:[...data.actividad.users,u]}})
		})
		.catch(r=>alert(r))
	}
	const _unassigned=(u)=>{
		axi.post('/api/auth/unAssignActivity',{user_id:u.id,actividad_id:data.actividad.id})
		.then(r=>{
			const users=data.actividad.users.filter(us=>us.id!==u.id)
			setData({...data,actividad:{...data.actividad,users}})
		})
		.catch(r=>alert(r))
	}
	const _newActivity=(e)=>{
		console.log(unidad)
		if(e.key=='Enter'){
			console.log(data.newActividad)
			axi.post('/api/auth/newActivity',{unidad_id:unidad.id,actividad:data.newActividad})
			.then(r=>{
				console.log(r.data)
				setUnidad({...unidad,actividades:[...unidad.actividades,r.data]})
				setData({...data,newActividad:''})
			})
			.catch(r=>alert(r))
		}
	}
	
	return (
		<div id="modalUnidad" className="modal modal-fixed-footer full">
			<div className="modal-content">
				<h4>{unidad.unidad}<small> (Unidad)</small></h4>
				<div className="row">
					<div className="col s3">
					<div className="scroll-box">
					<div className="collection with-header">
						<div className="collection-header"><h4>Actividades</h4></div>
						{unidad.actividades&&unidad.actividades.map(a=>
							<a href="#!" key={a.id} onClick={(e)=>setData({...data,actividad:a})} className="collection-item">{a.actividad}</a>
						)}
					</div>
					<div className="input-field col s12">
						<input id="subact" type="text" onKeyDown={(e)=>_newActivity(e)} onChange={e=>setData({...data,newActividad:e.target.value})} value={data.newActividad||''}/>
						<label htmlFor="subact">Nueva Actividad</label>
					</div>
					</div>
				{data.actividad.actividad&&
				<div className="row">
					<div className="card">
						<div className="card-content">
							<div className="card-title">
							Resumen
							</div>
							<p>{data.actividad&&data.actividad.actividad}</p>
							<div className="row">
							<span className="badge yellow white-text">{data.actividad.confirmacion==null?'En Proceso':'Terminada'}</span>
							</div>
							<div className="row">
							<div className="col s6">
							<label htmlFor="date">Entrega</label>
							<input onChange={e=>setData({...data,actividad:{...data.actividad,fecha:e.target.value}})} value={data.actividad.fecha||''} id="date" type="text" className="datepicker" placeholder="fecha"/>
							</div>
							<div className="col s6">
							<label htmlFor="time">Hora</label>
							<input onChange={e=>setData({...data,actividad:{...data.actividad,hora:e.target.value}})} value={data.actividad.hora||''} id="time" type="text" className="timepicker" placeholder="hora"/>
							</div>
							</div>
							<div className="row">
								<form className="col s12">
									<div className="row">
										<label htmlFor="descripcion">Descripcion</label>
										<div className="input-field col s12">
											<textarea id="descripcion" onChange={e=>setData({...data,actividad:{...data.actividad,descripcion:e.target.value}})} value={data.actividad.descripcion||''} className="materialize-textarea"></textarea>
										</div>
									</div>
								</form>
								<div className="col">
								<a href="#!"><i className="material-icons">file_download</i>Reporte</a>
								</div>
							</div>
							<div className="row">
								<span>Actividades</span>
								<div className="row">
									<div className="input-field col s12">
										<input id="subact" type="text" onKeyDown={(e)=>_newSub(e)} onChange={e=>setData({...data,newSubActividad:e.target.value})} value={data.newSubActividad||''}/>
										<label htmlFor="subact">Nueva Actividad</label>
									</div>
								</div>
								<div className="collection" style={{overflowY:'scroll',height:'150px',padding:'1rem'}}>
								{data.actividad.sub_actividades&&data.actividad.sub_actividades.map((v,k)=>{
									return <a key={k} href="#!" className="collection-item">{v.subactividad} <span className="badge yellow white-text">{'En Proceso'}</span></a>
								})}
								</div>
							</div>
						</div>
						<div className="card-action">
							<a className="waves-effect waves-light btn black" onClick={()=>_updateActivity()}>Guardar</a>
						</div>
					</div>
				</div>
				}
					</div>
					<div className='col s9'>
					<div className='center'>
						<h5>{data.actividad.actividad}
							<span className="badge yellow white-text">{data.actividad.confirmacion==null?'En Proceso':'Terminada'}</span>
						</h5>
					</div>
					<div className="col s4">
						<div className="card-title">Usuarios Asignados</div>
						<div style={{overflowY: 'scroll',height:'60vh'}}>
						<ul className="collection">
						{data.actividad.users&&data.actividad.users.map((u,i)=>
							<li key={i} className="collection-item avatar">
								<img src="https://2.bp.blogspot.com/-VCaXrTYV8sE/WyBY7dMKn5I/AAAAAAAAD58/tht3FfaFHRksaxglk1XGrr5Jt73LIxPagCLcBGAs/s1600/SUZY-FANSERVICE-2017.png" alt="" className="circle"/>
								<span className="title">{u.name}</span>
								<p>{u.celular} <br />
								<a href={"mailto:"+u.email}>{u.email}</a>
								</p>
								<a href="#!" className="secondary-content"><i className="material-icons" style={{color:'gold'}}>grade</i><i onClick={()=>_unassigned(u)} className="material-icons">close</i></a>
							</li>
						)}
						</ul>
					</div>
					</div>
					<div className="col s8">
					<AssignUser assign={_assignActivity}/>
					</div>
					</div>
					<div className="col s9">
						<Jerarquia actividad={data.actividad}/>
					</div>
				</div>
			</div>
			<div className="modal-footer">
				<a href="#!" onClick={()=>setData({...data,actividad:{}})}className="modal-close waves-effect waves-green btn-flat">OK</a>
			</div>
		  </div>
	)
}
export default Unidad
