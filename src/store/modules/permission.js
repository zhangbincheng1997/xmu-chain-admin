import { constantRoutes } from '@/router'
import { getMenu } from '@/api/user'
import Layout from '@/layout'

const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  getRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getMenu(state.token).then(response => {
        const { data } = response
        const routes = getRoutes(data)
        // NOTE: 刷新页面 跳转404
        routes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', routes)
        resolve(routes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

function getRoutes(data) {
  const routes = []
  data.forEach(item => {
    const route = {
      path: item.url,
      name: 'menu_' + item.id,
      meta: { title: item.name, icon: item.icon },
      hidden: item.hidden
    }
    if (item.children) {
      route.children = getRoutes(item.children)
      route.component = Layout
    } else {
      // menu.component = () => import('@/views' + item.url)
      route.component = (resolve) => require([`@/views${item.url}`], resolve)
    }
    routes.push(route)
  })
  return routes
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
