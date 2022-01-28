import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 */
// 校验用户是否拥有按钮权限
export default function checkHasPermission(value) {
  const roles = store.getters && store.getters.roles
  // 超级管理员拥有所有的按钮权限
  if (roles.includes('SUPER_ADMIN')) {
    return true
  }
  if (value && value instanceof Array && value.length > 0) {
    const perms = store.getters && store.getters.perms
    const requiredPerms = value

    const hasPermission = perms.some(perm => {
      return requiredPerms.includes(perm)
    })
    return hasPermission
  } else {
    console.error(`need perms! Like v-has-permission="['sys:user:add','sys:user:edit']"`)
    return false
  }
}
