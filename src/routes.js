import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./modules/home";
import Tabelas from "./modules/administracao/tabelas/tabelas";
import Campos from "./modules/administracao/campos/campos";



export default function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                
                {/*ADMINISTRACAO */}
                <Route path="/adm/tabelas" element={<Tabelas />} />
                <Route path="/adm/campos" element={<Campos />} />


            </Routes>
        </BrowserRouter>
    );
}