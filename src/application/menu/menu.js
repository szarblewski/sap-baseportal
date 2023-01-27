import React, { useContext } from "react";
import { Nav, Sidenav } from "rsuite";
import { Context } from "../../context";
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import './menu.css';
import { useNavigate } from "react-router-dom";

export default function Menu() {
    const { Menu } = useContext(Context);
    
    const navigate = useNavigate();

    return (
        <>      
        <Sidenav expanded={Menu.expanded} >
        <Sidenav.Body>
          <Nav activeKey={Menu.activeKey} onSelect={Menu.setActiveKey}>
            <Nav.Menu placement="rightStart" eventKey="1" title="Administração" icon={<GearCircleIcon />}>
              <Nav.Menu eventKey="1-1" title="Estrutura Dados">
                <Nav.Item eventKey="1-1-1" onClick={() => navigate("/adm/tabelas")}>Tabelas</Nav.Item>
                <Nav.Item eventKey="1-1-2" onClick={() => navigate("/adm/campos")}>Campos</Nav.Item>
                <Nav.Item eventKey="1-1-3">Reg. UDOs</Nav.Item>
              </Nav.Menu>
              <Nav.Item eventKey="1-2">Config. Sistema</Nav.Item>
              
            </Nav.Menu>
            
          </Nav>
        </Sidenav.Body>
        
      </Sidenav>
        </>

    );
}
