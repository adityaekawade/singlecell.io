import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Article from './components/Article.vue'
import CreatePost from './components/CreatePost.vue'
import Account from './components/Account.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/article/:id/:title',
      name: 'Article',
      component: Article
    },
    {
      path: '/create',
      name: 'Create',
      component: CreatePost
    },
    {
      path: '/account',
      name: 'Account',
      component: Account
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
