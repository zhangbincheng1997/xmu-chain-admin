import Vue from 'vue'

const SUPER_ADMIN = 'SUPER_ADMIN' // 超级管理员
const COMPANY_ADMIN = 'COMPANY_ADMIN' // 企业管理员
const COMPANY_MEMBER = 'COMPANY_MEMBER' // 企业员工

// IPFS 网关
// const IPFS_GATEWAY =  'https://cloudflare-ipfs.com/ipfs'
const IPFS_GATEWAY = 'http://www.littleredhat1997.com:8090/ipfs'

export default {
  install() {
    Vue.prototype.SUPER_ADMIN = SUPER_ADMIN
    Vue.prototype.COMPANY_ADMIN = COMPANY_ADMIN
    Vue.prototype.COMPANY_MEMBER = COMPANY_MEMBER
    Vue.prototype.IPFS_GATEWAY = IPFS_GATEWAY
  }
}
