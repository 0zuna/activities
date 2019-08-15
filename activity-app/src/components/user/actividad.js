import React, { useEffect, useState, useContext } from 'react'
import useCountdown from 'react-use-countdown'
import { axios } from '../../config';
import { UserContext } from '../../UserContext';

const _hora=(time)=>{
	var hours = Math.floor( time / 3600 );
	var minutes = Math.floor( (time % 3600) / 60 );
	var seconds = time % 60;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	return hours + ":" + minutes + ":" + seconds
}

const Actividad = ({actividad, _updateConfirmacion, _updateActivity }) => {
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [hecha, setHecha]=useState(false)
	const [show, setShow]=useState(false)

	var ff=new Date()
	if(actividad.hora){
		ff.setHours(actividad.hora.split(':')[0])
		ff.setMinutes(actividad.hora.split(':')[1])
		ff.setSeconds(actividad.hora.split(':')[2])
	}else{
		ff.setHours(18)
		ff.setMinutes(0)
		ff.setSeconds(0)
	}

	const countdown = _hora(useCountdown(() =>ff)/1000);

	useEffect(()=>{
		if(actividad.confirmacions.length>0)
			setHecha(true)
	},[actividad])

	const _styleActivity = () => {
		if(actividad.confirmacions[0]&&actividad.confirmacions[0].hora<actividad.hora)
			return {
				border: '1px solid #8AE234',
				boxShadow: '10px 10px 5px #8AE234',
				color:'#636b6f',
			}
		if(countdown==='0:00:00'){
			return {
				border: '1px solid red',
				boxShadow: '10px 10px 5px red',
				color:'#636b6f',
			}
		}
		/*if(hecha){
			return {
				border: '1px solid #8AE234',
				boxShadow: '10px 10px 5px #8AE234',
				color:'#636b6f',
			}
		}*/
		return {
			border: '1px solid yellow',
			boxShadow: '10px 10px 5px yellow',
			color: '#636b6f',
		}
	}

	const _hecho = () =>{
		axios.post('/api/activityDone',{actividad_id:actividad.id,user_id:user.id})
		.then(r=>{
			_updateConfirmacion({actividad_id:actividad.id,confirmacions:r.data})
			setHecha(true)
		})
		.catch(r=>alert(r))
	}

	const _fileUpload=e=>{
		const name=e.target.files[0].name
		var reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = () => {
			axios.post('/api/fileUpload',{actividad_id:actividad.id,data:reader.result,name:name})
			.then(r=>{
				actividad={...actividad,files:[...actividad.files,r.data]}
				_updateActivity(actividad)
			})
			.catch(r=>alert(r))
		}
	}

	const _deleteFile=(f)=>{
		console.log(f)
		actividad.files=actividad.files.filter(a=>f.id!==a.id)
		axios.delete(`/api/fileUpload/${f.id}`)
		.then(r=>{
			console.log(r.data)
			_updateActivity(actividad)
		})
		.catch(r=>alert(r))
	}

	return (
		<div className="card" style={_styleActivity()}>
			<div className="card-content">
			<div className="row">
			<div className="col s9">
				<div className="card-title">{actividad.actividad}</div>
				<p>Descripción: {actividad.descripcion}</p>
				<p>Hora de entrega: {actividad.hora}</p>
				<div className="file-field input-field" style={{width:50}}>
					<i className="material-icons">icloud_upload</i>
					<input type="file" onChange={(e)=>_fileUpload(e)} />
					<div className="file-path-wrapper" style={{display:'none'}}>
						<input className="file-path validate" type="text"/>
					</div>
				</div>
				{actividad.files.map(f=>
				<p key={f.id}>
				  <i onClick={()=>_deleteFile(f)} className="material-icons" style={{cursor: 'pointer'}}>delete</i>
				  <a href={axios.defaults.baseURL+f.name}>{f.name.split('/')[3]}</a>
				</p>
				)}
			</div>
			<div className="col s3">
				{hecha&&
					<div className="row">
						<div>{actividad.confirmacions[0].fecha} {actividad.confirmacions[0].hora}
							<i className="large material-icons right" style={{color: 'green'}}>check</i>
						</div>
					</div>
				}{!hecha&&
				<h4>{countdown}</h4>
				}
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
