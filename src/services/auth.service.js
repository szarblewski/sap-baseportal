
import axios from 'axios';
const config = require('../_helpers/config.json');


async function systemInfo() {
       
    const { data } = await axios.get(`${config.urlApi}/infoConnection`);
    return data;

}


const authService = {
    systemInfo
};

export default authService;