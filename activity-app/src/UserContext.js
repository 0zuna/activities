import React,{useState,createContext} from 'react';

export const UserContext = createContext();
export const UserProvider = props => {
	const [user,setUser] = useState({});
	const [auth, setAuth] = useState(false);
	const [arbol, setArbol]=useState([])
	return (
		<UserContext.Provider value={[user,setUser,auth,setAuth,arbol,setArbol]}>
			{props.children}
		</UserContext.Provider>
	)
}
