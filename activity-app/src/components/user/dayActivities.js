import React, { useEffect, useState, useContext } from 'react'
import Actividad from './actividad'
import { axios } from '../../config';
import { UserContext } from '../../UserContext';
import M from 'materialize-css';

const DayActivities = () => {
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [misActividades, setMisActividades]=useState([])

	useEffect(()=>{
		M.AutoInit();
		axios.post('/api/misActividadesHoy',{user_id:user.id})
		.then(r=>{
			setMisActividades(r.data)
		})
		.catch(r=>alert(r))
	},[])

	const _updateConfirmacion=(data)=>{
		const update=misActividades.map(a=>{
			if(a.id==data.actividad_id){
				a={...a,confirmacions:[data.confirmacions]}
			}
			return a
		})
		console.log(update)
		setMisActividades(update)
		console.log(data.actividad_id)
	}

	const _updateActivity=(actividad)=>{
		const update=misActividades.map(a=>{
			if(a.id==actividad.id){
				a=actividad
			}
			return a
		})
		setMisActividades(update)
	}
	return (
		<div className="card-panel">
			<h2 className="center">MIS ACTIVIDADES DEL DÍA</h2>
			{misActividades.map(a=>
				<Actividad key={a.id} actividad={a} _updateActivity={_updateActivity} _updateConfirmacion={_updateConfirmacion}/>
			)}
		</div>
	       )
}

export default DayActivities
