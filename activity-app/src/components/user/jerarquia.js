import React, { useEffect, useState, useContext } from 'react'
import { axios } from '../../config'
import M from 'materialize-css';
import {UserContext} from '../../UserContext';

const Jerarquia = ({jerarquia}) => {

	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [contactar, setContactar] = useState({})

	useEffect(()=>{
		M.AutoInit();
	},[])

	const _contactar = () =>{
		if(contactar.jerarquia.users.length>0)
		axios.post('/api/mensajera',{from: user.id,to: contactar.jerarquia.users[0].id, mensaje:contactar.mensaje})
		.then(r=>{
			setContactar({...contactar,mensaje:''})
		})
		.catch(r=>alert(r))
		else{
			alert ('Consulte al administrador para que asigne esta actividad a un usuario')
		}
	}

	const _styleJerarquia=()=>{
		const color=jerarquia.reduce((a,i)=>{
			if(a.confirmacions)
			if((a.confirmacions.length&&a.confirmacions[0].realizada)>0&&(i.confirmacions.length>0&&a.confirmacions[0].realizada))
				return true
			else return false
		})
		return color?{border:'2px solid green'}:{border:'2px solid yellow'}
	}

	const _reportar=(acto)=>{
		axios.post('/api/reportar',{actividad_id:acto.id,users:acto.users})
		.then(r=>{
			console.log(r.data)
			alert('se ha reportado')
		})
		.catch(r=>alert(r))
	}

	return (
			<div>
				<div id="modal1" className="modal bottom-sheet">
					<div className="modal-content">
						<h4>Mensaje</h4>
						<textarea  onChange={e=>setContactar({...contactar,mensaje:e.target.value})} value={contactar.mensaje||''} className="materialize-textarea"></textarea>
					</div>
					<div className="modal-footer">
						<a onClick={_contactar} href="#!" className="modal-close waves-effect waves-green btn-flat">enviar</a>
					</div>
				</div>
		<div className="col s6">
			<h5>Procesos</h5>
			<ul className="collection">
			{jerarquia.map((j,i)=>
				<li key={i} className="collection-item avatar" style={_styleJerarquia()}>
					<img src={j.users.length>0?axios.defaults.baseURL+'/assets/img/users/'+j.users[0].id+'.jpeg':''} alt="" className="circle" />
					<span className="title">{j.actividad}</span>
					<p>
					{j.users.length>0?j.users[0].name:''} <br />
					{j.users.length>0&&
						<a href={'mailto:'+j.users[0].email}>{j.users[0].email}</a>
					}
					<br />
					<i className="material-icons">call</i>{j.users.length>0?j.users[0].celular:''}
					</p>
					{j.files.map(f=>
					<p key={f.id}>
						<i className="material-icons">file_download</i>
						<a href={axios.defaults.baseURL+f.name}>{f.name.split('/')[3]}</a>
					</p>
					)}

					<div className="secondary-content">
						<div className="row">
							<div className="col">
								proceso {i+1}
							</div>
							<div className="col">
								<a href="#!" onClick={()=>_reportar(j)}><i className="material-icons" style={{color:'red'}}>hearing</i></a>
							{(j.confirmacions.length>0&&j.confirmacions[0].realizada)&&
								<a href="#!"><i className="material-icons" style={{color:'green'}}>check</i></a>
							}
							{(!j.confirmacions.length>0||!j.confirmacions[0].realizada)&&
								<a href="#!"><i className="material-icons" style={{color: 'red'}}>sentiment_very_dissatisfied</i>no ralizada</a>
							}
							</div>
						</div>
						<div className="row">
						<div className="col">
						  <a onClick={()=>setContactar({...contactar,jerarquia:j})} className="modal-trigger" href="#modal1">Contactar</a>
						  </div>
						{j.users.length>0&&
						<div className="col">
						  <a target="_blank" href={"https://wa.me/52"+j.users[0].celular}>
						  <img style={{width:20}} src={axios.defaults.baseURL+'/assets/img/Whatsapp.png'} />
						  </a>
						</div>
						}
						</div>
					</div>
				</li>
			)}
			</ul>
		</div>
		</div>
		
	)
}

export default Jerarquia
