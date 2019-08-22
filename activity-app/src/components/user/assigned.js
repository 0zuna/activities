import React, { useState, useEffect } from 'react'
import { axios } from '../../config'

const Assigned = () => {
	const [actos, setActos] = useState([])

	useEffect(()=>{
		axios.get('/api/assigned')
		.then(r=>{
			setActos(r.data)
			console.log(r.data)
		})
		.catch(r=>alert(r))
	},[])

	const _hecha=(a)=>{
		axios.post('/api/hecha',{actividad_id:a.id,fechaEntrega:a.fechaEntrega,horaEntrega:a.horaEntrega})
		.then(r=>{console.log(r.data)
			alert('actividad realizada')
		})
		.catch(r=>alert(r))
	}

	return(
		<div className="card-panel">
			<h4>Actividades Asignadas</h4>
			<div className="row">
				<table className="highlight">
					<thead>
						<tr>
							<th>#</th>
							<th>Actividad</th>
							<th>Periodicidad</th>
							<th>Entrega</th>

						</tr>
					</thead>
					<tbody>
					{actos.map((a,i)=>
						<tr key={i}>
							<td>{i+1}</td>
							<td>{a.actividad}</td>
							<td>{a.tipo} {a.tipo=='semanal'||a.tipo=='mensual'?a.periodicidad.dia:''}</td>
							<td>{a.fechaEntrega} {a.horaEntrega}</td>
							<td>
								<button onClick={()=>_hecha(a)} className="btn">Hecha</button>
							</td>
						</tr>
					)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Assigned
