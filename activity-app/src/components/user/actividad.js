import React, { useEffect, useState, useContext } from 'react'
import useCountdown from 'react-use-countdown'
import { axi } from '../../config';
import { UserContext } from '../../UserContext';

const _hora=(time)=>{
	var hours = Math.floor( time / 3600 );
	var minutes = Math.floor( (time % 3600) / 60 );
	var seconds = time % 60;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	return hours + ":" + minutes + ":" + seconds
}

const Actividad = ({actividad}) => {
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [hecha, setHecha]=useState(false)
	var ff=new Date()
	ff.setHours(actividad.hora.split(':')[0])
	ff.setMinutes(actividad.hora.split(':')[1])
	ff.setSeconds(actividad.hora.split(':')[2])
	const countdown = _hora(useCountdown(() =>ff)/1000);

	useEffect(()=>{
		const AUTH_TOKEN = localStorage.getItem('access_token');
		axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
		actividad.confirmacions.map(c=>{

		})
	})

	const _styleActivity = () => {
		if(countdown==='0:00:00'){
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
		}
		return {
			border: '1px solid yellow',
			boxShadow: '10px 10px 5px yellow',
			color: '#636b6f',
		}
	}

	const _hecho = () =>{
		axi.post('/api/activityDone',{actividad_id:actividad.id,user_id:user.id})
		.then(r=>console.log(r.data))
		.catch(r=>alert(r))
		setHecha(true)
	}

	return (
		<div className="card" style={_styleActivity()}>
			<div className="card-content">
			<div className="row">
			<div className="col s9">
				<div className="card-title">{actividad.actividad}</div>
				<p>Descripcion: {actividad.descripcion}</p>
				<p>Hora de entrega: {actividad.hora}</p>
			</div>
			<div className="col s3">
				<h4>{countdown}</h4>
			</div>
			</div>
			</div>
			{!hecha&&
			<div className="card-action">
				<a onClick={_hecho} className="waves-effect waves-light btn grey modal-trigger">HECHO</a>
			</div>
			}
		</div>
	)
}
export default Actividad
