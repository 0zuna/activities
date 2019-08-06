import React,{ useEffect } from 'react'
import { axi } from '../../config';

const Resumen = ({data, setData, unidad, setUnidad}) => {
	useEffect(()=>{
		const AUTH_TOKEN = localStorage.getItem('access_token');
		axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
	},[])
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
	return (
		<div className="card">
			<div className="card-content">
				<div className="card-title">
					Resumen
				</div>
				<p>{data.actividad&&data.actividad.actividad}</p>
				<div className="row">
					<span className="badge yellow white-text">{'En Proceso'}</span>
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
	)
}
export default Resumen
