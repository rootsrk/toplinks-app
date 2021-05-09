import { useState } from 'react';
import { Navbar, Form, FormControl, Button } from 'react-bootstrap';
import logo from '../../assets/logo.png';

function MenuBar(props) {
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
        {props.enableSearch && (
          <Form inline>
            <FormControl type='text' placeholder='Search' onChange={onChange} />
            <Button onClick={() => props.searchFor(searchParam)}>Search</Button>
          </Form>
        )}
      </Navbar>
      {/* TODO add icon */}
    </div>
  );
}

export default MenuBar;
