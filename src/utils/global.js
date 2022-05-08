import Vue from 'vue'
import { gateway } from '@/api/service-evidence/ipfs'
import { getIpfsGateway, setIpfsGateway } from '@/utils/auth'

// IPFS 网关
// const IPFS_GATEWAY =  'https://cloudflare-ipfs.com/ipfs'
if (getIpfsGateway() == null) {
  gateway().then(res => {
    setIpfsGateway(res.data)
    location.reload()
  })
}

export default {
  install() {
    Vue.prototype.IPFS_GATEWAY = getIpfsGateway()
  }
}
