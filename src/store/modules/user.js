import { login, logout } from '@/api/oauth'
import { getInfo } from '@/api/me'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const SUPER_ADMIN = 1
const COMPANY_ADMIN = 2
const COMPANY_MEMBER = 3

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_IS_SUPER_ADMIN: (state, isSuperAdmin) => {
    state.isSuperAdmin = isSuperAdmin
  },
  SET_IS_COMPANY_ADMIN: (state, isCompanyAdmin) => {
    state.isCompanyAdmin = isCompanyAdmin
  },
  SET_IS_COMPANY_MEMBER: (state, isCompanyMember) => {
    state.isCompanyMember = isCompanyMember
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, key, code } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, key: key, code: code }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, roles } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles.map(item => item.name))
        const roleIds = roles.map(item => parseInt(item.id))
        commit('SET_IS_SUPER_ADMIN', roleIds.indexOf(SUPER_ADMIN) >= 0)
        commit('SET_IS_COMPANY_ADMIN', roleIds.indexOf(COMPANY_ADMIN) >= 0)
        commit('SET_IS_COMPANY_MEMBER', roleIds.indexOf(COMPANY_MEMBER) >= 0)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

