import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/register";
import Login from "../views/login"
import Layout from '../components/layout.vue'
import Home from '../views/home'
import Player from '../views/player'
import Team from '../views/team'

Vue.use(VueRouter);

const routes = [
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect:'/home',
    children: [
      {
        path: '/home',
        component:Home,
        meta:{title:'ROOT'}
      },
    ]
  },
  {
    path:'/player',
    component:Layout,
    children:[
      {
        path:'/',
        component:Player,
        meta:{title:'Player'}
      }
    ]
  },
  {
    path:'/team',
    component:Layout,
    children:[
      {
        path:'/',
        component:Team, 
        meta:{title:'Team'}
      }
    ]
  }
  
  
];


const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
