import React,{ useState, useContext, useEffect } from 'react' 
import { axi } from '../../config'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { UserContext } from '../../UserContext';
import Dashboard from '../dashboard'


const Login=props=>{
	const [data,setData] = useState({})
	const [user,setUser,auth,setAuth]=useContext(UserContext);
	const [loader, setLoader]=useState(true)
	const [log, setLog] = useState(false);
	useEffect(()=>{
		const AUTH_TOKEN = localStorage.getItem('access_token');
		axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
		axi.get('/api/user').then(response=>{
			setUser(response.data)
			setLoader(false)
			setAuth(true)
		}).catch(e=>{
			setLoader(false)
		})
	},[])

	const _logan=()=>{
		axi.post('/api/auth/login',data).then(r=>{
			setUser(r.data)
			localStorage.setItem('access_token', r.data.access_token);
			axi.defaults.headers.common['Authorization'] = 'Bearer '+r.data.access_token
			setAuth(true)
			setData({})
		})
	}
	if(loader)return(
			<div style={{position: 'absolute',top: '50%',left: '50%'}}>
			Loading Game...
			</div>
			)
	if(auth)return <Dashboard />
	return (
		<div className="row center">
			<div className="col s6 m3" style={{width: '300px',height: '100px',padding: '20px',position: 'absolute',top: '30%',left: '50%',margin: '-70px 0 0 -170px'}}>
				<div className="card">
					<div className="card-content black-text">
						<span className="card-title">USUPSO</span>
						<div className="row">
							<form className="col s12">
								<div className="row">
									<div className="input-field col s12">
										<i className="material-icons prefix">account_circle</i>
										<input onChange={(e)=>setData({...data,email:e.target.value})} value={data.email||''} id="icon_prefix" type="text" className="validate"/>
										<label htmlFor="icon_prefix">Correo</label>
									</div>
									<div className="input-field col s12">
										<i className="material-icons prefix">lock</i>
										<input onChange={(e)=>setData({...data,password:e.target.value})} value={data.password||''} id="password" type="password" className="validate"/>
										<label htmlFor="password">Contraseña</label>
									</div>
								</div>
							</form>
						<button onClick={_logan} className="btn waves-effect waves-light grey lighten-1" type="submit" name="action">Entrar<i className="material-icons right">send</i></button>
						</div>
					</div>
					<div className="card-action">
						<Link to="/create/">Crear Cuenta</Link>
					</div>
				</div>
			</div>
		</div>
		)
}
export default Login
