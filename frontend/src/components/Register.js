import {Link} from 'react-router-dom';

function Register({ handleRegister, changeEmail, changePassword, email, password }) {
    return(
        <section className="auth-component">
            <h2 className="auth-component__title">Sign up</h2>
            <form className="auth-component__form" onSubmit={ handleRegister }>
                <input className="auth-component__input" type="email" value={email} onChange={changeEmail} placeholder="Email"></input>
                <input className="auth-component__input" type="password" value={password} onChange={changePassword} placeholder="Password"></input>
                <button className="auth-component__submit" type="submit">Sign up</button>
            </form>
            <Link to="/signin" className='auth-component__link'>Already a member? Log in here!</Link>
        </section>
    );
}

export default Register;