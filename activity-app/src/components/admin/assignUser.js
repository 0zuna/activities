import React, { useEffect, useState } from 'react'
//import M from 'materialize-css';
import { axi } from '../../config'

const AssignUser=({assign})=>{
	const [users, setUsers]=useState([])
	const [search, setSearch]=useState('')
	useEffect(()=>{
		const AUTH_TOKEN = localStorage.getItem('access_token');
		axi.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN;
		axi.get('/api/users').then(r=>{
			setUsers(r.data)
		}).catch(r=>alert('se ha producido un error'))
	},[])

	return (
		<div className="row">
			<nav className="yellow lighten-5">
				<div className="nav-wrapper">
					<form>
					<div className="input-field">
						<input onChange={(e)=>setSearch(e.target.value)} id="search" type="search" required/>
						<label className="label-icon" htmlFor="search"><i className="material-icons black-text">search</i></label>
						<i className="material-icons">close</i>
					</div>
					</form>
				</div>
			</nav>
		{users.filter(u=>u.name.toLowerCase().includes(search.toLowerCase())).map(u=>
		<div key={u.id} className="col s4 m8 offset-m2 l4">
			<div className="card-panel grey lighten-5 z-depth-1">
				<div className="row valign-wrapper">
					<div className="col s4">
						<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Bae_Suzy_at_%27Vagabond%27_show_party_in_Seoul_on_May_24%2C_2019.png/245px-Bae_Suzy_at_%27Vagabond%27_show_party_in_Seoul_on_May_24%2C_2019.png" alt="" className="circle responsive-img"/>
					</div>
					<div className="col s10">
						<span className="black-text">
							{u.name}
						</span>
						<div className="card-action">
							<a onClick={()=>assign(u)} href="#">Asignar</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	).slice(0,6)
      }


  </div>
	)
}
export default AssignUser
