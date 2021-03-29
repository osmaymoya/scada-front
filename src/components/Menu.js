import React from 'react';
import {Navbar, Nav, NavbarBrand} from 'react-bootstrap';
import { Link } from 'react-router-dom';


function Menu() {
  return (
    <Navbar bg="dark" variant="dark" className="mb-4">
        <Nav className="mr-auto">
                <NavbarBrand><Link to="/graficos" style={{color:'white'}}>Graficos</Link></NavbarBrand>
                <NavbarBrand><Link to="/datos" style={{color:'white'}}>Datos</Link></NavbarBrand>
        </Nav>
    </Navbar>
  );
}

export default Menu;
