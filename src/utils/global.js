import Vue from 'vue'

const SUPER_ADMIN = 'SUPER_ADMIN' // 超级管理员
const COMPANY_ADMIN = 'COMPANY_ADMIN' // 企业管理员
const COMPANY_MEMBER = 'COMPANY_MEMBER' // 企业员工

export default {
  install() {
    Vue.prototype.SUPER_ADMIN = SUPER_ADMIN
    Vue.prototype.COMPANY_ADMIN = COMPANY_ADMIN
    Vue.prototype.COMPANY_MEMBER = COMPANY_MEMBER
  }
}
