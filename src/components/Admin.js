import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { withRouter } from 'react-router-dom';

const Admin = (props) => {
	const [user, setUser] = useState(null);
	useEffect(() => {
		if (auth.currentUser) {
			console.log('existe usuario');
			setUser(auth.currentUser);
		} else {
			console.log('no existe usuario');
			props.history.push('/login');
		}
	}, [props.history]);
	return (
		<div>
			<h1>Rutas protegidas</h1>
			{user && <h3>{user.email}</h3>}
		</div>
	);
};

export default withRouter(Admin);
