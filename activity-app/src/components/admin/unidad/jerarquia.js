import React,{ useEffect, useContext, useState } from 'react'
import {UserContext} from '../../../UserContext';
import AssignJerarquia from './assignJerarquia'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { axios } from '../../../config';


const Jerarquia = ({actividad}) =>{
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [items,setItems]=useState([])
	useEffect(()=>{
		if(actividad.users){
		setItems([actividad])
		axios.post('/api/actividadJerarquia',{act_referencia:actividad.id})
		.then(r=>{
			r.data.length>0&&setItems(r.data)
		})
		.catch(r=>alert(r))
		}
	},[actividad])
	const getItems = count =>
		Array.from({ length: count }, (v, k) => k).map(k => ({
			id: `item-${k}`,
			content: `item ${k}`
		}));

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	const grid = 8;

	const getItemStyle = (isDragging, draggableStyle) => ({
		userSelect: "none",
		//padding: grid * 2,
		padding: 0,
		margin: `0 0 1px 0`,
		//background: isDragging ? "lightgreen" : "white",
		...draggableStyle
	});

	const getListStyle = isDraggingOver => ({
		//background: isDraggingOver ? "lightblue" : "lightgrey",
		padding: grid,
		//width: 250
	});
	const  onDragEnd=(result)=> {
		if (!result.destination) {
			return;
		}
		const ite = reorder(
			items,
			result.source.index,
			result.destination.index
		);
		setItems(ite);
		console.log(ite);
		axios.put('/api/updateJerarquia',{actividad_id:actividad.id,actividades:ite})
		.then(r=>console.log(r.data))
		.catch(r=>alert(r))
	}
	const _assignJerarquia=(acti)=>{
		const ite=[...items,acti]
		console.log(ite)
		setItems(ite)
		axios.post('/api/pushJerarquia',{act_referencia:acti.id,actividad_id:actividad.id})
		//.then(r=>console.log(r))
		.catch(r=>alert(r))
	}
	const _deleteFase=(f)=>{
		const fases=items.filter(fa=>f.id!==fa.id)
		axios.post('/api/deleteJerarquia',{act_referencia:f.id,actividad_id:actividad.id})
		.then(r=>{
			setItems(fases)
		})
		.catch(r=>alert(r))
	}

	return (
		<div className="row">
			<div className="col s12">
				<div className="card blue-grey darken-1">
					<div className="card-content white-text">
						<span className="card-title">Proceso</span>
						<div className="row">
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId="droppable">
							{(provided, snapshot) => (
								<div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
								{items.map((item, index) => (
									<Draggable key={item.id} draggableId={item.id} index={index}>
									{(provided, snapshot) => (
										<div className="row" ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging,provided.draggableProps.style)}>
											<div className="col s12">
												<div className="card white">
													<div className="card-content black-text">
														<span className="card-title">{item.actividad}</span>
														<div className="row">
														<div className="col s6">
														<p>Descripción: {item.descripcion}</p>
														<p>Departamento: {item.departamento}</p>
														<p>Division: {item.division}</p>
														<p>Unidad: {item.unidad}</p>
														</div>
														<div className="col s3">
															<div style={{overflowY: 'scroll', height: '150px'}}>
																<ul className="collection">
																{item.users.map(u=>
																	<li key={u.id} className="collection-item avatar">
																		<img src={axios.defaults.baseURL+'/assets/img/users/'+u.id+'.jpeg'} alt="" className="circle"/>
																		<span className="title">{u.name}</span>
																		<p>{u.celular}<br />
																		<a href={"mailto:"+u.email}>{u.email}</a>
																		</p><a href="#!" className="secondary-content">
																		<i className="material-icons" style={{color: 'gold'}}>grade</i>
																		<i className="material-icons">close</i>
																		</a>
																	</li>
																		)
																}
																</ul>
															</div>
														</div>
														<div className="col s3">
														  <i className="large material-icons right" style={{color:'green'}}>check</i>
														  <h4>FASE {index+1}</h4>
														</div>
														</div>
													</div>
													<div className="card-action">
														<a href="#" onClick={()=>_deleteFase(item)}>eliminar del proceso</a>
													</div>
												</div>
											</div>
										</div>
									)}
									</Draggable>
								))}
								{provided.placeholder}
								</div>
							)}
							</Droppable>
						</DragDropContext>
						</div>
						<AssignJerarquia assign={_assignJerarquia}/>
					</div>
					<div className="card-action">
						<a href="#">Agregar actividad</a>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Jerarquia
