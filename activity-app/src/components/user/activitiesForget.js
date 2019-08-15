import React, { useEffect, useState } from 'react'
import { axios } from '../../config';

const ActivitiesForget = () => {

	const [activitiesForget, setActivitiesForget] = useState([])

	useEffect(()=>{
		axios.get('/api/activitiesForget')
		.then(r=>{
			setActivitiesForget(r.data)
		})
		.catch(r=>alert(r))

	},[])

	const _done=(a)=>{
		axios.put('/api/activityForgetDone',a)
		.then(r=>{
			const update=activitiesForget.filter(u=>u.fechaConfirmacion!==a.fechaConfirmacion)
			setActivitiesForget(update)
		})
		.catch(r=>alert(r))
	}

	return (
		<div className="card-panel">
				<h2 className="center">Actividades Olvidadas</h2>
				<div className="row">
				{activitiesForget.map((a,i)=>
					<div key={i} className="col s12 m6">
						<div className="card red">
							<div className="card-content white-text">
								<span className="card-title">{a.actividad}</span>
								<p>{a.descripcion?a.descripcion:'Sin Descripción'}</p>
								<p>Fecha de Solicitada: {a.fechaConfirmacion}</p>
							</div>
							<div className="card-action">
								<a href="#!" onClick={()=>_done(a)} className="btn">Hecho</a>
							</div>
						</div>
					</div>
				)}
				</div>
		</div>
	)
}

export default ActivitiesForget
