import React, { useEffect, useState, useContext } from 'react'
import { axios } from '../../config';
import { UserContext } from '../../UserContext';
import M from 'materialize-css'

const DayActivities = () => {
	const [user,setUser,auth,setAuth,arbol,setArbol]=useContext(UserContext);
	const [users, setUsers]=useState([])
	const [dateInit, setDateInit]=useState()
	const [dateFin, setDateFin]=useState()
	const [userSelect, setUserSelect]=useState(0)

	useEffect(()=>{

		var elems = document.querySelectorAll('select');
		var datei = document.querySelectorAll('.datepicker-dateInit');
		var datef = document.querySelectorAll('.datepicker-dateFin');

		const data={
			cancel: 'cancelar',
			months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
			weekdays: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
			weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
			weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
		}

		M.Datepicker.init(datei, {format:'yyyy-mm-dd',i18n:data,onSelect:(d)=>setDateInit(d.toISOString().substr(0,10))});
		M.Datepicker.init(datef, {format:'yyyy-mm-dd',i18n:data,onSelect:(d)=>{setDateFin(d.toISOString().substr(0,10))}});
		
		axios.get('/api/users')
		.then(r=>{
			setUsers(r.data)
			M.FormSelect.init(elems, {});
		})
		.catch(r=>alert(r))
	},[])

	const _export=()=>{
	}

	return (
		<div className="card-panel">
			<h2 className="center">Reporte</h2>
			<div className="row">
				<div className="input-field col s12 m6">
					<select value={userSelect} onChange={(e)=>setUserSelect(e.target.value)}className="icons">
						<option value="" disabled>User</option>
						<option value="0">todos</option>
						{users.map(u=>
						<option key={u.id} value={u.id} data-icon={axios.defaults.baseURL+'assets/img/users/'+u.id+'.jpeg'}>{u.name}</option>
						)}
					</select>
					<label>User</label>
				</div>
				<div className="col s3">
					<span>Fecha Inicial</span>
					<input type="text" className="datepicker-dateInit" />
				</div>
				<div className="col s3">
					<span>Fecha Final</span>
					<input type="text" className="datepicker-dateFin" />
				</div>
			</div>
			{(dateInit&&dateFin)&&
			<a href={axios.defaults.baseURL+'api/usersReports/'+userSelect+'/'+dateInit+'/'+dateFin} target='_blank' className="btn btn-large waves-effect waves-yellow">Exportar documento</a>
			}
		</div>
	)
}

export default DayActivities
