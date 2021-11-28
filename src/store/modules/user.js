import { token, logout } from '@/api/oauth'
import { getInfo } from '@/api/service-admin/me'
import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken, setRole, removeRole } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    role: '',
    address: ''
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
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_ADDRESS: (state, address) => {
    state.address = address
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, key, code } = userInfo
    return new Promise((resolve, reject) => {
      token({
        grant_type: 'password', // captcha
        username: username.trim(),
        password: password,
        key: key,
        code: code
      }).then(response => {
        const { access_token, refresh_token, token_type } = response.data
        const token = token_type + ' ' + access_token
        commit('SET_TOKEN', token)
        setToken(token)
        setRefreshToken(refresh_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // refresh token
  refreshToken({ commit }, refreshToken) {
    commit('SET_TOKEN', undefined) // yes!!!
    return new Promise((resolve, reject) => {
      token({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }).then(response => {
        const { access_token, refresh_token, token_type } = response.data
        const token = token_type + ' ' + access_token
        commit('SET_TOKEN', token)
        setToken(token)
        setRefreshToken(refresh_token)
        resolve(token)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, roles, role, address } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        commit('SET_ROLE', role)
        commit('SET_ADDRESS', address)
        setRole(role)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        removeRefreshToken()
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
      removeRefreshToken()
      removeRole()
      commit('RESET_STATE')
      resolve()
    })
  },

  // exchange
  exchange({ commit }, key) {
    removeToken() // must remove  token  first
    removeRefreshToken()
    removeRole()
    commit('RESET_STATE')
    return new Promise((resolve, reject) => {
      token({
        grant_type: 'exchange',
        key: key
      }).then(response => {
        const { access_token, refresh_token, token_type } = response.data
        const token = token_type + ' ' + access_token
        commit('SET_TOKEN', token)
        setToken(token)
        setRefreshToken(refresh_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

