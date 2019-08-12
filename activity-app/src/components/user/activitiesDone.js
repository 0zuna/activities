import React, { useEffect, useState } from 'react'
import { axi } from '../../config';

const ActivitiesDone = () => {
	const [activitiesDone, setActivitiesDone] = useState([])
	useEffect(()=>{
		const AUTH_TOKEN = localStorage.getItem('access_token');
		axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
		axi.get('/api/activitiesDone')
		.then(r=>{
			setActivitiesDone(r.data)
		})
		.catch(r=>alert(r))
	},[])

	const _styleActivity = (actividad) => {
		if(actividad.entregadaATiempo){
			return {
				border: '2px solid #8AE234',
				//boxShadow: '10px 10px 5px #8AE234',
				color: '#636b6f',
			}
		}else{
			return {
				border: '2px solid red',
				//boxShadow: '10px 10px 5px red',
				color: '#636b6f',
			}
		}
		/*if(countdown==='0:00:00'){
			return {
				border: '1px solid red',
				boxShadow: '10px 10px 5px red',
				color:'#636b6f',
			}
		}
		if(hecha){
			return {
				border: '1px solid #8AE234',
				boxShadow: '10px 10px 5px #8AE234',
				color:'#636b6f',
			}
		}*/
	}
	return (
		<div className="card-panel">
			<h2 className="center">MIS ACTIVIDADES REALIZADAS</h2>
			 <div className="row">
			 {activitiesDone.map(a=>
				<div className="col s12 m6">
					<div className="card blue-grey darken-1">
						<div className="card-content white-text">
							<span className="card-title">{a.actividad}</span>
							<p>{a.descripcion}</p>
						</div>
						{/*<div className="card-action">
							<a href="#">This is a link</a>
							<a href="#">This is a link</a>
						</div>*/}
					</div>
				</div>
			)}
			</div>
			{/*<ul className="collection with-header">
				<li className="collection-header"><h4>MIS ACTIVIDADES REALIZADAS</h4></li>
				{activitiesDone.map(a=>
					<li className="collection-item" style={_styleActivity(a)}><div>{a.actividad}<a href="#!" className="secondary-content"><span className="badge">status</span><i className="material-icons">send</i></a></div></li>

				)}
			</ul>*/}
		</div>
	)
}
export default ActivitiesDone
