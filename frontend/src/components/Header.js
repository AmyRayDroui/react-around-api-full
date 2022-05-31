import logo from '../images/logos/page_logo.svg';
import NavBar from './NavBar';

function Header({...props}) {
  return (
    <header className="header">
        <img id="page-logo" src={logo} alt="site logo" className="header__logo"/>
        <NavBar {...props}/>
    </header>
  );
}

export default Header;