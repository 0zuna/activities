import React, { useEffect, useState } from 'react'
import { axios } from '../../config'

const Reported = () => {
	const [reportados, setReportados]=useState([])

	useEffect(()=>{
		axios.get('/api/reported')
		.then(r=>setReportados(r.data))
		.catch(r=>alert(r))
	},[])

	return (
		<div className="card-panel">
			<h2 className="center">Usuarios Reportados</h2>
			<div className="row">
				<table className="highlight">
					<thead>
						<tr>
							<th>#</th>
							<th>Reportado</th>
							<th>Actividad Relacionada</th>
							<th>Reportante</th>
							<th>fecha</th>
						</tr>
					</thead>

					<tbody>
					{reportados.map((r,i)=>
						<tr key={i}>
							<td>{i+1}</td>
							<td>{r.reportado}</td>
							<td>{r.actividad}</td>
							<td>{r.reportante}</td>
							<td>{r.fecha}</td>
						</tr>
					)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Reported
