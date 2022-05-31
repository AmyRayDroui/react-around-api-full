import { Link, useLocation } from 'react-router-dom';

function NavBar({email, isLoggedIn, handleLogout}) {
    const currPath = useLocation().pathname;
    return (
        <div className="header__nav-bar">
            { isLoggedIn ?
                <>
                    <button className="header__nav-link" onClick={handleLogout}>Log out</button>
                    <h2 className="header__email">{email}</h2>
                </> :
                currPath==='/signup' ?
                    <Link to='/signin' className="header__nav-link">Log in</Link>
                    :
                    <Link to='/signup' className="header__nav-link">Sign up</Link>
            }
        </div>
    );
}

export default NavBar; 