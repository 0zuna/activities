import React,{ useEffect } from 'react'
import { axios } from '../../../config';
import M from 'materialize-css';

const Resumen = ({data, setData, unidad, setUnidad}) => {
	useEffect(()=>{
		var elems = document.querySelectorAll('select');
		M.FormSelect.init(elems, {});
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
	},[data.actividad.tipo])
	const _newSub=(e)=>{
		if(e.key==='Enter'){
			axios.post('/api/newSubActivity',{actividad_id:data.actividad.id,subactividad:data.newSubActividad})
			.then(r=>{
				setData({...data,actividad:{...data.actividad,sub_actividades:[...data.actividad.sub_actividades,r.data]}})
				console.log(r.data)
			})
		}
	}
	const _updateActivity=()=>{
		console.log(data.actividad)
		axios.put('/api/updateActivity',data.actividad)
		.then(r=>{
			const acto=unidad.actividades.map(a=>{
				if(a.id===data.actividad.id)
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
					{data.actividad.status==-1&&
					<span className="badge yellow white-text">En Proceso</span>
					}
					{data.actividad.status==1&&
					<span className="badge green white-text">Realizada</span>
					}
					{data.actividad.status==0&&
					<span className="badge red white-text">NO Realizada</span>
					}
				</div>
				<div className="input-field col s12">
					<select value={data.actividad.tipo||''} onChange={e=>setData({...data,actividad:{...data.actividad,tipo:e.target.value}})}>
						<option value="" disabled>Periodicidad</option>
						<option value="unica">Unica</option>
						<option value="diaria">Diaria</option>
						<option value="semanal">Semanal</option>
						<option value="mensual">Mensual</option>
					</select>
					<label>Periodicidad</label>
				</div>
				<div className="row">
				{data.actividad.tipo=='unica'&&
					<div className="col s6">
						<label htmlFor="date">Entrega</label>
						<input onChange={e=>setData({...data,actividad:{...data.actividad,fecha:e.target.value}})} value={data.actividad.fecha||''} id="date" type="text" className="datepicker" placeholder="fecha"/>
					</div>
				}
				{(data.actividad.tipo=='semanal'||data.actividad.tipo=='mensual')&&
					<div className="col s6">
					<label htmlFor='dia'>Día</label>
					<select id='dia' value={data.actividad.periodicidad?data.actividad.periodicidad.dia:''} onChange={e=>setData({...data,actividad:{...data.actividad,periodicidad:{dia:e.target.value},periodicidadDia:e.target.value}})}>
						<option value="" disabled>Día</option>
						<option value="lunes">Lunes</option>
						<option value="martes">Martes</option>
						<option value="miercoles">Miercoles</option>
						<option value="jueves">Jueves</option>
						<option value="viernes">Viernes</option>
						<option value="sabado">Sabado</option>
					</select>
					</div>
				}
					<div className="col s6">
						<label htmlFor="time">Hora</label>
						<input onChange={e=>setData({...data,actividad:{...data.actividad,hora:e.target.value}})} value={data.actividad.hora||'18:00:00'} id="time" type="text" className="timepicker" placeholder="hora"/>
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
					<div className="scroll-box">
						{data.actividad.files&&data.actividad.files.map((f,i)=>
						<p key={i} ><a href="#!"><i className="material-icons">file_download</i>{f.name}</a></p>
						)}
					</div>
					</div>
				</div>
				{/*<div className="row">
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
				</div>*/}
			</div>
			<div className="card-action">
				<a className="waves-effect waves-light btn black" onClick={()=>_updateActivity()}>Guardar</a>
			</div>
		</div>
	)
}
export default Resumen
