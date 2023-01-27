import React, { useContext } from "react";
import { Nav, Navbar } from "rsuite";
import { Context } from "../../context";
import "./header.css";
import MenuIcon from '@rsuite/icons/Menu';
import { ImSun } from 'react-icons/im';
import { FaRegMoon } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";


export default function Header() {
    const { Menu, InfoSystem, Theme } = useContext(Context);
    const navigate = useNavigate();
    

    return (
        <>
            <Navbar>
                <Nav>
                    <Nav.Item className="portalName" onClick={() => navigate("/")}> <h2>{InfoSystem.name}</h2> </Nav.Item>
                    <Nav.Item className="versionHeader">{InfoSystem.version}</Nav.Item>
                    <Nav.Item onClick={() => Menu.toggleMenu()}><MenuIcon /></Nav.Item>
                    <Nav.Item> <h6>{InfoSystem.empName}</h6> </Nav.Item>
                    <Nav.Item> {"Base dados:  "} <div className="baseName"> {InfoSystem.dbName }</div></Nav.Item>
                </Nav>
                <Nav pullRight>
                
                    <Nav.Item onClick={() => Theme.switchTheme()}>
                        {Theme.name === 'dark' ? <ImSun size={"1.5em"} /> : <FaRegMoon size={"1.5em"}/>}
                        
                        
                    </Nav.Item>
                </Nav>
            </Navbar>
        </>
    );
}
