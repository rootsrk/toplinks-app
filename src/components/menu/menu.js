import { Navbar } from 'react-bootstrap';
import logo from '../../assets/logo.png';
import './menu.scss';

function MenuBar() {
  return (
    <div className='menu-content'>
      <Navbar fixed='top'>
        <Navbar.Brand href='/'>
          <img className='menu-content-logo' src={logo} alt='toplink logo' />
          <span className='menu-content-title'>Toplinks</span>
        </Navbar.Brand>
      </Navbar>
      {/* TODO add icon */}
    </div>
  );
}

export default MenuBar;
