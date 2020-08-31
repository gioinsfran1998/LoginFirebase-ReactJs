import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { withRouter } from 'react-router-dom';
import Firestore from './Firestore';

const Admin = (props) => {
	const [user, setUser] = useState(null);
	useEffect(() => {
		if (auth.currentUser) {
			// console.log('existe usuario');
			setUser(auth.currentUser);
		} else {
			// console.log('no existe usuario');
			props.history.push('/login');
		}
	}, [props.history]);
	return (
		<div className='mt-5'>{user && <Firestore user={user} />}</div>
	);
};

export default withRouter(Admin);
