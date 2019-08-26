import React, { useEffect, useState, useContext } from 'react'
import AssignUser from '../assignUser'
import M from 'materialize-css';
import { axios } from '../../../config';
import Jerarquia from './jerarquia'
import Resumen from './resumen'
import {UserContext} from '../../../UserContext';
//import $ from 'jquery'
//window.$=$


const Unidad = ({unidad,setUnidad}) =>{
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [actividades, setActividades]=useState([{actividad:'actividad1',descripcion:'descripcion1', status:'En Proceso'}]);
	const [data, setData]=useState({actividad:{ sub_actividades:[] }})
	const [search, setSearch]=useState({})

	useEffect(()=>{
		const ar=arbol.map(d=>{
			const di=d.divisions.map(div=>{
				const u=div.unidads.map(uni=>{
					if(uni.id==unidad.id)
						return unidad
					return uni
				})
				return {...div,unidads:u}
			})
			return {...d,divisions:di}
		})
		setArbol(ar)
	},[unidad])

	const _descripcion=(act)=>{
		setData({...data,actividad:{...data.actividad,descripcion:act}})
		const actos=unidad.actividads.map(a=>{
			if(a.id==act.id)
				return act
			return a
		})
		setUnidad({...unidad,actividads:actos})
		console.log(data)
	}
	const _assignActivity=(u)=>{
		if(!data.actividad.users.some(us=>us.id==u.id) && data.actividad.users)
		axios.post('/api/assignActivity',{user_id:u.id,actividad_id:data.actividad.id})
		.then(r=>{
			const actividad={...data.actividad,users:[...data.actividad.users,u]}
			setData({...data,actividad})
			const actos=unidad.actividades.map(a=>{
				if(a.id==actividad.id)
					return actividad
				return a
			})
			setUnidad({...unidad,actividades:actos})
		})
		.catch(r=>alert(r))
	}
	const _unassigned=(u)=>{
		axios.post('/api/unAssignActivity',{user_id:u.id,actividad_id:data.actividad.id})
		.then(r=>{
			const users=data.actividad.users.filter(us=>us.id!==u.id)
			const actividad={...data.actividad,users}
			setData({...data,actividad})
			const actos=unidad.actividades.map(a=>{
				if(a.id==actividad.id)
					return actividad
				return a
			})
			setUnidad({...unidad,actividades:actos})
		})
		.catch(r=>alert(r))
	}
	const _newActivity=(e)=>{
		console.log(unidad)
		if(e.key=='Enter'){
			console.log(data.newActividad)
			axios.post('/api/newActivity',{unidad_id:unidad.id,actividad:data.newActividad})
			.then(r=>{
				console.log(r.data)
				setUnidad({...unidad,actividades:[...unidad.actividades,r.data]})
				setData({...data,newActividad:''})
			})
			.catch(r=>alert(r))
		}
	}

	const _styleActo=(status)=>{
		if(status==0)
			return {backgroundColor:'#FFBDBD'}
		if(status==1)
			return {backgroundColor:'#DAFFB5'}
		if(status==-1)
			return {backgroundColor:'#FFF289'}
	}
	
	return (
		<div id="modalUnidad" className="modal modal-fixed-footer full">
			<div className="modal-content">
				<h4>{unidad.unidad}<small> (Unidad)</small></h4>
				<div className="row">
					<div className="col s3">
						<div className="scroll-box">
							<div className="collection with-header">
								<div className="collection-header"><h4>Actividades</h4></div>
								{unidad.actividades&&unidad.actividades.map(a=>
								<a href="#!" key={a.id} onClick={(e)=>setData({...data,actividad:a})} className="collection-item" style={_styleActo(a.status)}>{a.actividad}</a>
								)}
							</div>
							<div className="input-field col s12">
								<input id="subact" type="text" onKeyDown={(e)=>_newActivity(e)} onChange={e=>setData({...data,newActividad:e.target.value})} value={data.newActividad||''}/>
								<label htmlFor="subact">Nueva Actividad</label>
							</div>
						</div>
						<div className="row">
							<Resumen data={data} setData={setData} unidad={unidad} setUnidad={setUnidad} />
						</div>
					</div>
					<div className='col s9'>
						<div className='center'>
							<h5>{data.actividad.actividad}
							{data.actividad.status==-1&&
							<span className="badge yellow white-text">En Proceso</span>
							}
							{data.actividad.status==1&&
							<span className="badge green white-text">Realizada</span>
							}
							{data.actividad.status==0&&
							<span className="badge red white-text">NO Realizada</span>
							}
							</h5>
						</div>
						<div className="col s4">
							<div className="card-title">Usuarios Asignados</div>
							<div style={{overflowY: 'scroll',height:'60vh'}}>
								<ul className="collection">
									{data.actividad.users&&data.actividad.users.map((u,i)=>
									<li key={i} className="collection-item avatar">
										<img className="circle" src={axios.defaults.baseURL+'assets/img/users/'+u.id+'.jpeg'} onError={(e)=>e.target.src=axios.defaults.baseURL+"assets/img/logo.jpeg"} alt="img"/>
										<span className="title">{u.name}</span>
										<p>{u.celular} <br />
											<a href={"mailto:"+u.email}>{u.email}</a>
										</p>
										<a href="#!" className="secondary-content"><i className="material-icons" style={{color:'gold'}}>grade</i><i onClick={()=>_unassigned(u)} className="material-icons">close</i></a>
									</li>
									)}
								</ul>
							</div>
						</div>
						<div className="col s8">
							<AssignUser assign={_assignActivity}/>
						</div>
					</div>
					<div className="col s9">
						<Jerarquia actividad={data.actividad}/>
					</div>
				</div>
			</div>
			<div className="modal-footer">
				<a href="#!" onClick={()=>setData({...data,actividad:{}})}className="modal-close waves-effect waves-green btn-flat">OK</a>
			</div>
		</div>
	)
}
export default Unidad
