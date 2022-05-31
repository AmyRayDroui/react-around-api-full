import {Link} from 'react-router-dom';

function Login({ handleLogin, changeEmail, changePassword, email, password }) {
    return(
        <section className="auth-component">
            <h2 className="auth-component__title">Log in</h2>
            <form className="auth-component__form" onSubmit={ handleLogin }>
                <input className="auth-component__input" type="email" value={email} onChange={changeEmail} placeholder="Email"></input>
                <input className="auth-component__input" type="password" value={password} onChange={changePassword} placeholder="Password"></input>
                <button className="auth-component__submit" type="submit">Log in</button>
            </form>
            <Link to="/signup" className='auth-component__link'>Not a member yet? Sign up here!</Link>
        </section>
    );
}

export default Login;