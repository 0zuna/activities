import React, { useEffect, useState } from 'react'
import { axios } from '../../config'
import M from 'materialize-css'

const Users = () => {
	const [users, setUsers]=useState([])
	const [user, setUser]=useState({})
	const [newUser, setNewUser]=useState({})

	useEffect(()=>{
		axios.get('/api/users')
		.then(r=>setUsers(r.data))
		.catch(r=>alert(r))
		    var elems = document.querySelectorAll('.modal');
    		M.Modal.init(elems, {});

	},[])

	const _up=(u)=>{
		setUser(u);
		setTimeout(()=>M.updateTextFields(),1000)
	}

	const _updatePerfil=()=>{
		axios.put('/api/setUser',user)
		.then(r=>{
			console.log(r)
			const us=users.map(u=>{
				if(u.id==user.id)
				return user
				return u
			})
			setUsers(us)
		})
		.catch(r=>alert(r))
	}

	const _fileUpload=e=>{
		const name=e.target.files[0].name
		var reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = () => {
			axios.post('/api/uploadImage',{user_id:user.id,img:reader.result})
			.then(r=>console.log(r.data))
			.catch(r=>alert(r))
		}
	}

	const _foto=e=>{
		const name=e.target.files[0].name
		var reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = () => {
			setNewUser({...newUser,img:reader.result})
		}
	}

	const _newUser=()=>{
		axios.post('/api/newUser',newUser)
		.then(r=>{
			setUsers([...users,r.data])
		})
		.catch(r=>alert(r))
	}
	return (
			<div>
		<div id="modal2" className="modal">
    <div className="modal-content">
			<div className="row" style={{backgroundColor:''}}>
				<div className="row">
					<div className="input-field col s4">
						<input value={newUser.name||''} onChange={(e)=>setNewUser({...newUser,name:e.target.value})} id="nombre2" type="text" />
						<label htmlFor="nombre2">Nombre</label>
					</div>
					<div className="input-field col s4">
						<input value={newUser.paterno||''} onChange={(e)=>setNewUser({...newUser,paterno:e.target.value})} id="apellidoP2" type="text" />
						<label htmlFor="apellidoP2">Apellido Paterno</label>
					</div>
					<div className="input-field col s4">
						<input value={newUser.materno||''} onChange={(e)=>setNewUser({...newUser,materno:e.target.value})} id="apellidoM2" type="text" />
						<label htmlFor="apellidoM2">Apellido Materno</label>
					</div>
				</div>
				<div className="row">
					<div className="input-field col s6">
						<i className="material-icons prefix">email</i>
						<input value={newUser.email||''} onChange={(e)=>setNewUser({...newUser,email:e.target.value})} id="email2" type="email" />
						<label htmlFor="email2">Email</label>
					</div>
					<div className="input-field col s6">
						<i className="material-icons prefix">call</i>
						<input value={newUser.celular||''} onChange={(e)=>setNewUser({...newUser,celular:e.target.value})} id="telefono2" type="text"/>
						<label htmlFor="telefono2">Celular</label>
					</div>
				</div>
				<div className="row">
				 <div className="file-field input-field">
      <div className="btn">
        <span>Foto</span>
        <input onChange={_foto} type="file"/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
    </div>
				</div>
				<div className="row">
					<div className="input-field col s6">
						<i className="material-icons prefix">vpn_key</i>
						<input value={newUser.password||''} onChange={(e)=>setNewUser({...newUser,password:e.target.value})} id="password2" type="password" className="validate" />
						<label htmlFor="password2">Actualizar Contraseña</label>
					</div>
				</div>

			</div>
    </div>
    <div className="modal-footer">
	<a onClick={_newUser} className="waves-effect waves-light btn-small right modal-close">Crear</a>
    </div>
  </div>
		<div id="modal1" className="modal">
    <div className="modal-content">
      <h4>{user.name} {user.paterno} {user.materno}</h4>
			<div className="row">
				<center style={{backgroundColor:''}}>
					<div style={{width:200}}>
						 <div className="file-field input-field">
						<div className="ratio img-responsive img-circle" style={{backgroundImage:"url("+axios.defaults.baseURL+'assets/img/users/'+user.id+'.jpeg'+")"}}>
        <input type="file" onChange={_fileUpload}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" style={{visibility:'hidden'}}/>
      </div>
					</div>
					</div>
				</center>
			</div>
			<div className="row" style={{backgroundColor:''}}>
				<div className="row">
					<div className="input-field col s4">
						<input value={user.name||''} onChange={(e)=>setUser({...user,name:e.target.value})} id="nombre" type="text" />
						<label htmlFor="nombre">Nombre</label>
					</div>
					<div className="input-field col s4">
						<input value={user.paterno||''} onChange={(e)=>setUser({...user,paterno:e.target.value})} id="apellidoP" type="text" />
						<label htmlFor="apellidoP">Apellido Paterno</label>
					</div>
					<div className="input-field col s4">
						<input value={user.materno||''} onChange={(e)=>setUser({...user,materno:e.target.value})} id="apellidoM" type="text" />
						<label htmlFor="apellidoM">Apellido Materno</label>
					</div>
				</div>
				<div className="row">
					<div className="input-field col s6">
						<i className="material-icons prefix">email</i>
						<input value={user.email||''} onChange={(e)=>setUser({...user,email:e.target.value})} id="email" type="email" />
						<label htmlFor="email">Email</label>
					</div>
					<div className="input-field col s6">
						<i className="material-icons prefix">call</i>
						<input value={user.celular||''} onChange={(e)=>setUser({...user,celular:e.target.value})} id="telefono" type="text"/>
						<label htmlFor="telefono">Celular</label>
					</div>
				</div>
				{/*
				<div className="row">
					<div className="input-field col s3">
						<input value={user.unidades[0].division.departamento.departamento||''} id="departamento" type="text" disabled />
						<label htmlFor="departameno">Departamento</label>
					</div>
					<div className="input-field col s3">
						<input value={user.unidades[0].division.division||''} id="division" type="text" disabled />
						<label htmlFor="division">Division</label>
					</div>
					<div className="input-field col s3">
						<input value={user.unidades[0].unidad||''} id="unidad" type="text" disabled />
						<label htmlFor="unidad">Unidad</label>
					</div>
					<div className="input-field col s3">
						<input value={user.puesto||''} onChange={(e)=>setUser({...user,puesto:e.target.value})} id="puesto" type="text" />
						<label htmlFor="puesto">Puesto</label>
					</div>
				</div>*/}
				<div className="row">
					<div className="col s12">
						<div className="row">
							<div className="input-field col s12">
								<textarea value={user.sobremi||''} onChange={(e)=>setUser({...user,sobremi:e.target.value})} id="mi" className="materialize-textarea"></textarea>
								<label htmlFor="mi">Sobre Mí</label>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="input-field col s6">
						<i className="material-icons prefix">vpn_key</i>
						<input value={user.password||''} onChange={(e)=>setUser({...user,password:e.target.value})} id="password" type="password" className="validate" />
						<label htmlFor="password">Actualizar Contraseña</label>
					</div>
				</div>
			</div>
    </div>
    <div className="modal-footer">
	<a onClick={_updatePerfil} className="waves-effect waves-light btn-small right modal-close">Actualizar</a>
    </div>
  </div>
		<div className="card-panel">
		<div className="row">
			<h2 className="center">Usuarios</h2>
			<a className="waves-effect waves-light btn right modal-trigger" data-target="modal2">Nuevo User</a>
		</div>
			<div className="row">
			{users.map((u,i)=>
				<div key={i} className="col s3">
					<div className="card horizontal">
						<div className="card-image" style={{padding:20}}>
							<div style={{width:100}}>
							<div className="ratio img-responsive img-circle" style={{backgroundImage:"url("+axios.defaults.baseURL+'assets/img/users/'+u.id+'.jpeg'+")"}}></div>
							</div>
						</div>
						<div className="card-stacked">
							<div className="card-content">
								<p>{u.name} {u.paterno} {u.materno}</p>
								<p>{u.celular}</p>
							</div>
							<div className="card-action">
								<a href="#" onClick={()=>_up(u)} className="modal-trigger" data-target="modal1">ver</a>
							</div>
						</div>
					</div>
				</div>
			)}
			</div>
		</div>
		</div>
	)
}

export default Users
