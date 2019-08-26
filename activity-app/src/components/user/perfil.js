import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { axios } from '../../config';
import M from 'materialize-css'

const Perfil = () => {
	const [user, setUser, auth, setAuth, arbol, setArbol]=useContext(UserContext);
	const [perfil, setPerfil]=useState({name:'',
		unidades:[{division:{division:'',
				departamento:{departamento:''}}}]
	});

	useEffect(()=>{
		axios.post('/api/getUser',{ user_id:user.id })
		.then(r=>{
			console.log(r.data)
			if(r.data.unidades.length>0)
			setPerfil(r.data)
			else{
			const data={...r.data,unidades:[{division:{division:'',departamento:{departamento:''}}}]}
			console.log(data)
			setPerfil(data)
			}
			M.updateTextFields();
		})
		.catch(r=>alert(r))
	},[user])

	const _fileUpload=e=>{
		const name=e.target.files[0].name
		var reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = () => {
			console.log(reader.result)
			axios.post('/api/uploadImage',{img:reader.result})
			.then(r=>console.log(r.data))
			.catch(r=>alert(r))
		}
	}

	const _updatePerfil=()=>{
		axios.put('/api/setUser',perfil)
		.then(r=>console.log(r))
		.catch(r=>alert(r))
	}

	return (
		<div className="card-panel">
		{/*<h4 className="center">Mis Datos</h4>*/}
			<div className="row">
				<center style={{backgroundColor:''}}>
					<div style={{width:200}}>
						<div className="ratio img-responsive img-circle" style={{backgroundImage:"url("+axios.defaults.baseURL+'assets/img/users/'+user.id+'.jpeg'+")"}}>
						</div>
					</div>
				</center>
			</div>
			<div className="row" style={{backgroundColor:''}}>
				<div className="row">
					<div className="input-field col s4">
						<input disabled value={perfil.name||''} onChange={(e)=>setPerfil({...perfil,name:e.target.value})} id="nombre" type="text" />
						<label htmlFor="nombre">Nombre</label>
					</div>
					<div className="input-field col s4">
						<input disabled value={perfil.paterno||''} onChange={(e)=>setPerfil({...perfil,paterno:e.target.value})} id="apellidoP" type="text" />
						<label htmlFor="apellidoP">Apellido Paterno</label>
					</div>
					<div className="input-field col s4">
						<input disabled value={perfil.materno||''} onChange={(e)=>setPerfil({...perfil,materno:e.target.value})} id="apellidoM" type="text" />
						<label htmlFor="apellidoM">Apellido Materno</label>
					</div>
				</div>
				<div className="row">
					<div className="input-field col s6">
						<i className="material-icons prefix">email</i>
						<input disabled value={perfil.email||''} onChange={(e)=>setPerfil({...perfil,email:e.target.value})} id="email" type="email" />
						<label htmlFor="email">Email</label>
					</div>
					<div className="input-field col s6">
						<i className="material-icons prefix">call</i>
						<input disabled value={perfil.celular||''} onChange={(e)=>setPerfil({...perfil,celular:e.target.value})} id="telefono" type="text"/>
						<label htmlFor="telefono">Celular</label>
					</div>
				</div>
				{/*
				<div className="row">
					<div className="input-field col s3">
						<input value={perfil.unidades[0].division.departamento.departamento||''} id="departamento" type="text" disabled />
						<label htmlFor="departameno">Departamento</label>
					</div>
					<div className="input-field col s3">
						<input value={perfil.unidades[0].division.division||''} id="division" type="text" disabled />
						<label htmlFor="division">Division</label>
					</div>
					<div className="input-field col s3">
						<input value={perfil.unidades[0].unidad||''} id="unidad" type="text" disabled />
						<label htmlFor="unidad">Unidad</label>
					</div>
					<div className="input-field col s3">
						<input value={perfil.puesto||''} onChange={(e)=>setPerfil({...perfil,puesto:e.target.value})} id="puesto" type="text" />
						<label htmlFor="puesto">Puesto</label>
					</div>
				</div>*/
				}
				<div className="row">
					<div className="col s12">
						<div className="row">
							<div className="input-field col s12">
								<textarea value={perfil.sobremi||''} onChange={(e)=>setPerfil({...perfil,sobremi:e.target.value})} id="mi" className="materialize-textarea"></textarea>
								<label htmlFor="mi">Sobre Mí</label>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="input-field col s6">
						<i className="material-icons prefix">vpn_key</i>
						<input value={perfil.password||''} onChange={(e)=>setPerfil({...perfil,password:e.target.value})} id="password" type="password" className="validate" />
						<label htmlFor="password">Actualizar Contraseña</label>
					</div>
				</div>
				<a onClick={_updatePerfil} className="waves-effect waves-light btn-small right">Actualizar</a>
			</div>
		</div>
	)
}

export default Perfil
