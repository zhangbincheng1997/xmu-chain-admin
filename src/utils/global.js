import Vue from 'vue'

// IPFS 网关
// const IPFS_GATEWAY =  'https://cloudflare-ipfs.com/ipfs'
const IPFS_GATEWAY = 'http://www.littleredhat1997.com:8090/ipfs'

export default {
  install() {
    Vue.prototype.IPFS_GATEWAY = IPFS_GATEWAY
  }
}
