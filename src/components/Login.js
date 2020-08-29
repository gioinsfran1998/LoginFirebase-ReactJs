import React, { useState, useCallback } from 'react';
import { auth, db } from '../firebase';
import { withRouter } from 'react-router-dom';

const Login = (props) => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [error, setError] = useState(null);
	const [esRegistro, setEsRegistro] = useState(false);
	const procesarDatos = (e) => {
		e.preventDefault();
		if (!email.trim()) {
			setError('Ingrese Email');
			return;
		}
		if (!pass.trim()) {
			setError('Ingrese Password');
			return;
		}

		if (pass.length < 6) {
			setError('Password de 6 caracteres o mas');

			return;
		}

		setError(null);
		if (esRegistro) {
			registrar();
		} else {
			login();
		}
	};
	const login = useCallback(async () => {
		try {
			const res = await auth.signInWithEmailAndPassword(email, pass);
			console.log(res.user);
			setEmail('');
			setPass('');
			setError(null);
			props.history.push('/admin');
		} catch (error) {
			console.log(error);
			if (error.code === 'auth/invalid-email') {
				setError('Email no valido');
			}
			if (error.code === 'auth/user-not-found') {
				setError('Email no registrado');
			}
			if (error.code === 'auth/wrong-password') {
				setError('Contrasenha incorrecta');
			}
			setError(null);
		}
	}, [email, pass, props.history]);
	const registrar = useCallback(async () => {
		try {
			const res = await auth.createUserWithEmailAndPassword(
				email,
				pass
			);
			console.log(res.user);
			await db.collection('usuarios').doc(res.user.email).set({
				email: res.user.email,
				uid: res.user.uid,
			});
			setEmail('');
			setPass('');
			setError(null);
			props.history.push('/admin');
		} catch (error) {
			console.log(error);
			if (error.code === 'auth/invalid-email') {
				setError('Email no valido');
			}
			if (error.code === 'auth/email-already-in-use') {
				setError('Email ya existente');
			}
		}
	}, [email, pass, props.history]);

	return (
		<div className='mt-5'>
			<h3 className='text-center'>
				{esRegistro ? 'Registro de usuarios' : 'Login de acceso'}
			</h3>
			<hr />
			<div className='row justify-content-center'>
				<div className='col-12 col-sm-8 col-md-6 col-xl-4'>
					<form onSubmit={procesarDatos}>
						{error && (
							<div className='alert alert-danger'>{error}</div>
						)}
						<input
							className='form-control mb-2'
							type='email'
							placeholder='Ingrese Email'
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						/>
						<input
							className='form-control mb-2'
							type='password'
							placeholder='Ingrese una contrasenha'
							onChange={(e) => setPass(e.target.value)}
							value={pass}
						/>
						<button
							className='btn btn-dark btn-lg btn-block'
							type='submit'
						>
							{esRegistro ? 'Registrarse' : 'Acceder'}
						</button>
						<button
							className='btn btn-info btn-sm btn-block'
							onClick={() => setEsRegistro(!esRegistro)}
							type='button'
						>
							{esRegistro
								? 'Ya estas registrado?'
								: 'No tienes cuenta?'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default withRouter(Login);
