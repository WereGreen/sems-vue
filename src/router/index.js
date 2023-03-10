import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import axios from "axios";
import store from "../store"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/index',
                name: 'Index',
                component: () => import('../views/Index.vue')
            },
            {
                path: '/sysUser/UserCenter',
                name: 'UserCenter',
                component: () => import('../views/sysUser/UserCenter.vue')
            },
            {
                path: '/sysUser/UserChangePassword',
                name: 'UserChangePassword',
                component: () => import('../views/sysUser/UserChangePassword.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {

    let hasRoute = store.state.menus.hasRoute

    if (!hasRoute) {
        axios.get("/tb/user/nav", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(res => {

            //拿到menulist
            store.commit("setMenuList", res.data.data.nav)

            console.log("res.data.data.nav")
            console.log(res.data.data.nav)

            //拿到用户权限
            store.commit("setPermList", res.data.data.authoritys)

            //动态绑定路由
            let newRoutes = router.options.routes

            res.data.data.nav.forEach(menu => {

                console.log("menu")
                console.log(menu)

                if (menu.children) {
                    menu.children.forEach(e => {

                        //转成路由
                        let route = menuToRoute(e)

                        //把路由添加到路由管理中
                        if (route) {
                            newRoutes[0].children.push(route)
                        }
                    })
                }
            })
            console.log("newRoutes")
            console.log(newRoutes)
            router.addRoutes(newRoutes)

            hasRoute = true
            store.commit("changeRouteStatus", hasRoute)

        })
    }

    next()
})

//导航转成路由
const menuToRoute = (menu) => {
    if (!menu.component) {
        return null
    }

    let route = {
        path: menu.path,
        name: menu.name,
        meta: {
            icon: menu.icon,
            title: menu.title
        }
    }

    route.component = () => import('../views/' + menu.component + '.vue')
    return route
}

export default router
