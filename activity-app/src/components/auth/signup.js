import React,{useState} from 'react' 
import {axi} from '../../config'
import { Link } from "react-router-dom";


const Create=props=>{
	const [data,setData] = useState({})
	const _create=()=>{
		axi.post('/api/auth/signup',data).then(e=>{
			alert('usuario creado')
			props.history.push(`/`)
		}).catch(e=>{
			alert('el usuario no se pudo crear con exito por favor verifique sus datos')
		})
	}
	return (
		<div className="row center">
			<div className="col s6" style={{height: '100px',position: 'absolute',top: '20%',left: '40%',margin: '-70px 0 0 -170px'}}>
				<div className="card">
					<div className="card-content black-text">
						<span className="card-title">USUPSO</span>
						<span className="card-title">nueva cuenta</span>
						<div className="row">
							<form className="col s12">
								<div className="row">
									<div className="input-field col s12">
										<i className="material-icons prefix">account_circle</i>
										<input onChange={(e)=>setData({...data,name:e.target.value})} value={data.name} id="name" type="text" className="validate"/>
										<label htmlFor="name">Nombre</label>
									</div>
									<div className="input-field col s12">
										<i className="material-icons prefix">email</i>
										<input onChange={(e)=>setData({...data,email:e.target.value})} value={data.email} id="email" type="text" className="validate"/>
										<label htmlFor="email">Correo</label>
									</div>
									<div className="input-field col s12">
										<i className="material-icons prefix">lock</i>
										<input onChange={(e)=>setData({...data,password:e.target.value})} value={data.password} id="password" type="password" className="validate"/>
										<label htmlFor="password">Contraseña</label>
									</div>
									<div className="input-field col s12">
										<i className="material-icons prefix">lock</i>
										<input onChange={(e)=>setData({...data,password_confirmation:e.target.value})} value={data.password_confirmation} id="password_confirmation" type="password" className="validate"/>
										<label htmlFor="password_confirmation">Confirmar Contraseña</label>
									</div>
								</div>
							</form>
						<button onClick={_create} className="btn waves-effect waves-light grey lighten-1" type="submit" name="action">Crear Cuenta<i className="material-icons right">send</i></button>
						</div>
					</div>
					<div className="card-action">
						<Link to="/">Regresar</Link>
					</div>
				</div>
			</div>
		</div>
		)
}
export default Create
