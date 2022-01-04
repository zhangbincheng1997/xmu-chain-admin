const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  role: state => state.user.role,
  address: state => state.user.address,
  companyId: state => state.user.companyId,
  permission_routes: state => state.permission.routes
}
export default getters
