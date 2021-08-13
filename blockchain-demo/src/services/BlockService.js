import axios from 'axios';

const BLOCK_API_BASE_URL = "http://localhost:8080/blocks";

class BlockService {
    postBlock(block) {
        return axios.post(BLOCK_API_BASE_URL, block);
    }
    getSpecificBlock(blockId) {
        return axios.get(BLOCK_API_BASE_URL + "/" + blockId);
    }
    getByBlockIdAndPeer(blockId, Peer) {
        return axios.get("/byBlockIdAndPeer/" + blockId + "/" + Peer)
    }
    getAllBlocks() {
        return axios.get(BLOCK_API_BASE_URL);
    }
    getAllBlocksByPeerAndType(peer, type) {
        return axios.get(BLOCK_API_BASE_URL + "/byPeerAndType/" + peer + "/" + type);
    }
    removeBlockById(blockId) {
        return axios.delete(BLOCK_API_BASE_URL + "/" + blockId)
    }
    updateBlockByIdAndPeer(blockId, peer, newBlock) {
        return axios.put(BLOCK_API_BASE_URL + "/" + blockId + "/" + peer, newBlock)
    }
}

export default new BlockService()