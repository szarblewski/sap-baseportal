import { useState, createContext, useEffect } from "react";
import authService from "./services/auth.service";

export const Context = createContext();

export const NewProvider = (props) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [infoUser, setInfoUser] = useState({ name: "teste", email: "teste@test" });
    const [infoSystem, setInfoSystem] = useState({
        name: "Portal SAP",
        version: "1.0.0",
        empName: "",
        dbName: ""
    });
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('1');

    const switchTheme = () => {
        if (theme === "dark") {
            setTheme("light");
            localStorage.setItem("theme", "light");
        } else {
            setTheme("dark");
            localStorage.setItem("theme", "dark");
        }
    };
    const toggleMenu = () => {
        setExpanded(!expanded);
    };

    

    useEffect(() => {

        authService.systemInfo().then((response) => {
            setInfoSystem({
                name: "Portal SAP",
                version: "1.0.0",
                empName: response.companyName,
                dbName: response.companyDB
            });
        });
    }, []);


    const InfoSystem = {
        name: infoSystem.name,
        version: infoSystem.version,
        empName: infoSystem.empName,
        dbName: infoSystem.dbName,
        setInfoSystem
    };
    const InfoUser = { infoUser, setInfoUser };
    const Theme = { name: theme, switchTheme };
    const Menu = { expanded, toggleMenu, activeKey, setActiveKey };

    const values = {
        InfoUser,
        InfoSystem,
        Theme,
        Menu
        
    };

    return (
        <Context.Provider value={values}>
            {props.children}
        </Context.Provider>
    );
}