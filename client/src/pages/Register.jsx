import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
	const [ errors, setErrors ] = useState({});

	const handleErrors = (errors) => {
		console.log(errors.extensions);
		if (errors.extensions && errors.extensions.errors.length > 0) {
			const errorsObject = errors.extensions.errors.reduce((acc, item) => {
				acc[item.field] = item.message;
				return acc;
			}, {});

			console.log(errorsObject);
			return setErrors(errorsObject);
		}

		return setErrors({"general": errors.message});
	};

	const handleSubmit = async (e) => {
        e.preventDefault();
		const REGISTER_QUERY = {
			query: `
				mutation {
					register(name: "${name}", email: "${email}", password: "${password}") {
						_id, name, token
					}
				}
			`
		}

		try {
			const response = await fetch('http://localhost:3000/graphql', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(REGISTER_QUERY)
			});
			const data = await response.json();
			console.log(data);
			if (data.errors && data.errors.length > 0) {
				handleErrors(data.errors[0]);
			}

		} catch (error) {
			console.log(error);
		}
    }

	return (
		<div className='flex items-center justify-center min-h-screen bg-blue-50'>
			<div className='w-full max-w-md p-10 bg-white rounded-3xl shadow-lg border border-blue-100'>
				<h2 className='text-3xl font-serif mb-6 text-center text-blue-600'>Rejestracja</h2>
				<form className='space-y-5' onSubmit={handleSubmit}>
					<input type='text' name='name' placeholder='Imię' className={`w-full p-4 border  ${errors.name ? 'border-pink-400 focus:ring-pink-300 placeholder-pink-400': 'border-blue-200 focus:ring-blue-300 placeholder-blue-400'} rounded-xl focus:outline-none focus:ring-2`} onChange={(e) => setName(e.target.value)}/>
					<input type='email' name='email' placeholder='Email' className={`w-full p-4 border  ${errors.email ? 'border-pink-400 focus:ring-pink-300 placeholder-pink-400': 'border-blue-200 focus:ring-blue-300 placeholder-blue-400'} rounded-xl focus:outline-none focus:ring-2`} onChange={(e) => setEmail(e.target.value)}/>
					<input type='password' name='password' placeholder='Hasło' className={`w-full p-4 border  ${errors.password ? 'border-pink-400 focus:ring-pink-300 placeholder-pink-400': 'border-blue-200 focus:ring-blue-300 placeholder-blue-400'} rounded-xl focus:outline-none focus:ring-2`} onChange={(e) => setPassword(e.target.value)}/>
					<button type='submit' className='w-full py-3 bg-blue-200 text-blue-800 font-semibold rounded-xl shadow hover:bg-blue-300 transition'>
						Zarejestruj się
					</button>
				</form>
				<p className='mt-6 text-center text-blue-500'>
					Masz już konto?{' '}
					<Link to='/login' className='underline font-medium hover:text-blue-600'>
						Zaloguj się
					</Link>
				</p>
			</div>
		</div>
	);
}
