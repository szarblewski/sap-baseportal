import axios from "axios";
const config = require("../../_helpers/config.json");

async function getCampos() {
    const { data } = await axios.get(`${config.urlApi}/userFields`);
    return data;
}

async function nextPageCampos(nextPage, tableName) {
    const { data } = await axios.get(`${config.urlApi}/userFields`, { headers: {'conditions': `$filter=TableName eq '${tableName}'&$skip=${nextPage}` }});
    return data;
}

async function getCamposByTable(tableName) {
    //console.log(`$filter=TableName eq '${tableName}'`);
    const { data } = await axios.get(`${config.urlApi}/userFields`, { headers: {'conditions': `$filter=TableName eq '${tableName}'`}});
    return data;
}

const camposService ={
    getCampos,
    nextPageCampos,
    getCamposByTable
}

export default camposService;