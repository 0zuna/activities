import React, { useEffect, useState } from 'react'
import { axios } from '../../config';
import M from 'materialize-css'

const ActivitiesDone = () => {
	const [activitiesDone, setActivitiesDone] = useState([])
	const [verActividad, setVerActividad] = useState({})
	const [filterPeriodicidad, setFilterPeriodicidad] = useState('')
	const [filterDia, setFilterDia] = useState('')
	const [filterDateInit, setFilterDateInit] = useState('')
	const [filterDateFin, setFilterDateFin] = useState('')
	useEffect(()=>{
		M.AutoInit();
		axios.get('/api/activitiesDone')
		.then(r=>{
			setActivitiesDone(r.data)
		})
		.catch(r=>alert(r))

		var elems = document.querySelectorAll('select');
		M.FormSelect.init(elems, {});
	},[filterPeriodicidad])

	const _styleActivity = (actividad) => {
		if(actividad.entregadaATiempo){
			return {
				border: '2px solid #8AE234',
				//boxShadow: '10px 10px 5px #8AE234',
				color: '#636b6f',
				backgroundColor: '#E4FFCA',
			}
		}else{
			return {
				border: '2px solid red',
				//boxShadow: '10px 10px 5px red',
				color: '#636b6f',
				backgroundColor: '#FFEAEA',
			}
		}
	}
	return (
		<div>
		<div id="modalActivityDone" className="modal modal-fixed-footer">
			<div className="modal-content">
				<h4>{verActividad.actividad}</h4>
				<p>{verActividad.descripcion?verActividad.descripcion:'SIN DESCRIPCIÓN'}</p>
				<p>Periodicidad: {verActividad.tipo}</p>
				<p>{verActividad.dia?'Día '+verActividad.dia:''}</p>
				<p>{verActividad.fecha?'Fecha solicitada '+verActividad.fecha:''}</p>
				<p>Hora Solicitada: {verActividad.horaSolicitada}</p>
				<p>Fecha de Entrega: {verActividad.fechaEntregada}</p>
				<p>Hora de Entrega: {verActividad.horaEntregada}</p>
				{(verActividad.periodicidad=='semanal' || verActividad.periodicidad=='mensual')&&
				<p>Fecha solicitada: verActividad.fechaConfirmacion.split(' ')[0]</p>
				}
				<h5>
					STATUS: {verActividad.entregadaATiempo?'ENTREGADA A TIEMPO :)':'NO ENTREGADA A TIEMPO :('}
				</h5>
			</div>
			<div className="modal-footer">
				<a href="#!" className="modal-close waves-effect waves-green btn-flat">OK</a>
			</div>
		  </div>
		<div className="card-panel">
			<h2 className="center">MIS ACTIVIDADES REALIZADAS</h2>
			<div className="row">
				<div className="input-field col s3">
					<select value={filterPeriodicidad} onChange={(e)=>setFilterPeriodicidad(e.target.value)}>
						<option value="" disabled>Elegír periodicidad</option>
						<option value="unica">única</option>
						<option value="diaria">diaria</option>
						<option value="semanal">semanal</option>
						<option value="mensual">mensual</option>
						<option value="">todas</option>
					</select>
					<label>Periodicidad</label>
				</div>
				{(filterPeriodicidad=='semanal'||filterPeriodicidad=='mensual')&&
				<div className="input-field col s3">
					<select value={filterDia} onChange={(e)=>setFilterDia(e.target.value)}>
						<option value="" disabled>Elegír día</option>
						<option value="lunes">Lunes</option>
						<option value="martes">Martes</option>
						<option value="miercoles">Miércoles</option>
						<option value="jueves">Jueves</option>
						<option value="viernes">Viernes</option>
						<option value="sabado">Sábado</option>
						<option value="">todas</option>
					</select>
					<label>Día</label>
				</div>
				}
				<div className="col s3">
					<span>Fecha Inicio</span>
					<input value={filterDateInit} onChange={(e)=>setFilterDateInit(e.target.value)} id="dateInit" type="text" placeholder='YYYY-MM-DD' />
				</div>
				<div className="col s3">
					<span>Fecha Fin</span>
					<input value={filterDateFin} onChange={(e)=>setFilterDateFin(e.target.value)} type="text" placeholder='YYYY-MM-DD' />
				</div>
			</div>
			<div className="row">
				<table className="highlight">
					<thead>
						<tr>
							<th>#</th>
							<th>Actividad</th>
							<th>Periodicidad</th>
							<th>fecha entregada</th>
						</tr>
					</thead>
					<tbody>
					{activitiesDone
						.filter(a=>a.tipo.includes(filterPeriodicidad))
						.filter(a=>{if(filterDia=='')return true;if(a.dia) return a.dia==filterDia; else return true;})
						.filter(a=>{
								if(filterDateInit.length>9)
								return a.fechaEntregada>=filterDateInit; 
								else return true})
						.filter(a=>{
								if(filterDateFin.length>9)
								return a.fechaEntregada<=filterDateFin; 
								else return true})
								.map((a,i)=>
						<tr key={i} style={_styleActivity(a)}>
							<td>{i+1}</td>
							<td>{a.actividad}</td>
							<td>{a.tipo} {a.dia}</td>
							<td>{a.fechaEntregada+' '+a.horaEntregada}</td>
							<td>
								<a href="#!" className="modal-trigger" data-target="modalActivityDone" onClick={()=>setVerActividad(a)}>ver</a>
							</td>
						</tr>
					)}
					</tbody>
				</table>
			</div>
		</div>
		</div>
	)
}
export default ActivitiesDone
