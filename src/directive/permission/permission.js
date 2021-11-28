import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const permissionRoles = value
  if (permissionRoles && permissionRoles instanceof Array && permissionRoles.length > 0) {
    const role = store.getters && store.getters.role
    const hasPermission = permissionRoles.includes(role)
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
  return false
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
