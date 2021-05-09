import { useState } from 'react';
import { Navbar, Form, FormControl, Button } from 'react-bootstrap';
import Logout from '../logout/logout';
import logo from '../../assets/logo.png';

function MenuBar(props) {
  const {
    logout = () => {},
    enableSearch = false,
    searchFor = () => {},
  } = props;
  const [searchParam, setSearchParam] = useState('');

  const onChange = (e) => {
    const { value } = e.target;
    if (value) {
      setSearchParam(value);
    }
  };
  return (
    <div className='menu-content'>
      <Navbar fixed='top'>
        <Navbar.Brand href='/'>
          <img className='menu-content-logo' src={logo} alt='toplink logo' />
          <h2>TopLinks</h2>
        </Navbar.Brand>
        {enableSearch && (
          <Form inline>
            <FormControl type='text' placeholder='Search' onChange={onChange} />
            <Button onClick={() => searchFor(searchParam)}>Search</Button>
          </Form>
        )}
        <Logout logout={logout} />
      </Navbar>
    </div>
  );
}

export default MenuBar;
