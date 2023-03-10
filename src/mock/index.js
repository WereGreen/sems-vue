// src/mock/index.js
const Mock = require('mockjs')
const Random = Mock.Random
let Result = {
    code: 200,
    msg: '操作成功',
    data: null
}
Mock.mock('/captcha', 'get', () => {

    Result.data = {
        token: Random.string(32),
        captchaImg: Random.dataImage('120x40', 'p7n5w')
    }
    return Result
})
Mock.mock('/login', 'post', () => {
    //无法在header中传入数jwt

    // Result.code = 400
    // Result.msg = "验证码错误"
    return Result
})
Mock.mock('/sysUser/UserInfo', 'get', () => {

    Result.data = {
        id: "1",
        username: "wsz",
        userRole: '超级管理员',
        userImg: '',
        avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
    }

    return Result
})
Mock.mock('/logout', 'post', () => {
    return Result
})
Mock.mock('/sys/menu/nav', 'get',() => {
    let nav= [
        {
            name: 'SysFun',
            title: '系统功能',
            icon: 'el-icon-s-operation',
            component: '',
            path:'',
            children: [
                {
                    name: 'EquipmentApply',
                    title: '体育器材使用',
                    icon: 'el-icon-edit-outline',
                    path:'/sysFun/EquipmentApply',
                    component: 'sysFun/EquipmentApply',
                    children: []
                },
                {
                    name: 'EquipmentReturn',
                    title: '体育器材归还',
                    icon: 'el-icon-s-claim',
                    path:'/sysFun/EquipmentReturn',
                    component: 'sysFun/EquipmentReturn',
                    children: []
                },
                {
                    name: 'AddEquipment',
                    title: '器材添加申请',
                    icon: 'el-icon-document-add',
                    path:'/sysFun/AddEquipment',
                    component: 'sysFun/AddEquipment',
                    children: []
                },
                {
                    name: 'ScrapEquipment',
                    title: '器材报废申请',
                    icon: 'el-icon-document-remove',
                    path:'/sysFun/ScrapEquipment',
                    component: 'sysFun/ScrapEquipment',
                    children: []
                },
                {
                    name: 'RepairEquipment',
                    title: '器材维修申请',
                    icon: 'el-icon-s-cooperation',
                    path:'/sysFun/RepairEquipment',
                    component: 'sysFun/RepairEquipment',
                    children: []
                }
            ]
        },
        {
            name: 'SysMg',
            title: '系统管理',
            icon: 'el-icon-s-tools',
            component: '',
            path:'',
            children: [
                {
                    name: 'EquipmentManagement',
                    title: '器材申请管理',
                    icon: 'el-icon-s-check',
                    path: '/sysMg/EquipmentManagement',
                    component: 'sysMg/EquipmentManagement',
                    children: []
                },
                {
                    name: 'EquipmentClassification',
                    title: '器材管理 / 分类',
                    icon: 'el-icon-s-grid',
                    path: '/sysMg/EquipmentClassification',
                    component: 'sysMg/EquipmentClassification',
                    children: []
                },
                {
                    name: 'EquipmentWarehouse',
                    title: '器材仓库管理',
                    icon: 'el-icon-school',
                    path: '/sysMg/EquipmentWarehouse',
                    component: 'sysMg/EquipmentWarehouse',
                    children: []
                },
                {
                    name: 'UserManagement',
                    title: '用户管理',
                    component: 'sysUser/UserManagement',
                    icon: 'el-icon-user-solid',
                    path:'/sysUser/UserManagement',
                    children: []
                }
            ]
        }
    ]
    let authoritys = []

    Result.data = {
        nav: nav,
        authoritys: authoritys
    }

    return Result
})