import store from '@/store'

export default function checkPermission(permissionRoles) {
  if (permissionRoles && permissionRoles instanceof Array && permissionRoles.length > 0) {
    const role = store.getters && store.getters.role
    return permissionRoles.includes(role)
  }
  return false
}
