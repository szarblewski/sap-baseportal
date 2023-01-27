import axios from "axios";
const config = require("../../_helpers/config.json");

async function getTabelas() {
    const { data } = await axios.get(`${config.urlApi}/userTables`);
    return data;
}

async function getNomeTabelaDescricao() {
    const { data } = await axios.get(`${config.urlApi}/userTables`, { headers: {'conditions': '$select=TableName'}});
    //console.log(data);
    return data;
}

async function addTabela(tabela) {
    const { data } = await axios.post(`${config.urlApi}/userTables`, tabela);
    return data;
}

async function nextPageCampos(nextPage) {
    const { data } = await axios.get(`${config.urlApi}/userTables`, { headers: {'conditions': '$skip=' + nextPage}});
    return data;
}

async function deleteTabela(id) {
    const { data } = await axios.delete(`${config.urlApi}/userTables/${id}`);
    return data;
}

async function updateTabela(tabela) {
    const { data } = await axios.patch(`${config.urlApi}/userTables/${tabela.TableName}`, tabela);
    return data;
}


const tabelasService ={
    getTabelas,
    getNomeTabelaDescricao,
    addTabela,
    nextPageCampos,
    deleteTabela,
    updateTabela
}

export default tabelasService;