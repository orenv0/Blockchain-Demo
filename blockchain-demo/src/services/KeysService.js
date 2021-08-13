import axios from 'axios';

const KEYS_API_BASE_URL = "http://localhost:8080/keys";

class KeysService {
    postKeys(key) {
        return axios.post(KEYS_API_BASE_URL, key);
    }
    getKeys(keysId) {
        return axios.get(KEYS_API_BASE_URL + "/byKeysId/" + keysId);
    }
    updateKeys(keysId, newKeys) {
        return axios.put(KEYS_API_BASE_URL + "/" + keysId, newKeys)
    }
}

export default new KeysService()