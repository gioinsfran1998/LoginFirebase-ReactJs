import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Admin from './components/Admin';
import { auth } from './firebase';

function App() {
	const [firebaseUser, setFirebaseUser] = useState(false);
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			console.log(user);
			if (user) {
				setFirebaseUser(user);
			} else {
				setFirebaseUser(null);
			}
		});
	}, []);
	return firebaseUser !== false ? (
		<Router>
			<div className='container'>
				<Navbar firebaseUser={firebaseUser} />
				<Switch>
					<Route path='/login'>
						<Login />
					</Route>
				</Switch>
				<Switch>
					<Route path='/admin'>
						<Admin />
					</Route>
				</Switch>
				<Switch>
					<Route path='/' exact>
						Inicio...
					</Route>
				</Switch>
			</div>
		</Router>
	) : (
		<p>Loading...</p>
	);
}

export default App;
