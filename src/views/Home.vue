<template>
  <el-container>
    <el-aside width="201px">
      <SideMenu></SideMenu>
    </el-aside>

    <el-container>
      <el-header>
<!--        <strong class="strong">校园体育器材管理系统</strong>-->
        <div style="height: 30px;">
          <v-chart style="margin-top: 15px;" id="banner"/>
        </div>
        <div class="header-avatar">
          <el-avatar size="medium" :src="avatar"></el-avatar>
          <el-dropdown>
          <span class="el-dropdown-link">
            {{ userInfo.name }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  @click.native="selectMenu({name: 'UserChangePassword', title: '修改密码'})">
                  修改密码
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <Tabs></Tabs>
        <div style="margin: 0 15px">
          <router-view></router-view>
        </div>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "@/views/inc/SideMenu";
import Tabs from "@/views/inc/Tabs";


export default {
  name: "Home",
  components: {
    SideMenu,
    Tabs
  },
  data() {
    return {
      userInfo: {
      },
      avatar:'',
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/tb/userInfo").then(res => {

        this.userInfo = res.data.data

        if (this.userInfo.userRole == "normal") {
          this.avatar = "https://img.zcool.cn/community/016a2e5f110b9fa801215aa097202c.png?x-oss-process=image/format,webp/quality,q_100"
        } else {
          this.avatar = "https://img.zcool.cn/community/0143d06096496c11013e3b7d68df00.png?x-oss-process=image/format,webp/quality,q_100"
        }
      })
    },
    logout() {
      this.$axios.post("/logout").then(res => {
        localStorage.clear()
        sessionStorage. clear()
        this.$store.commit ("resetState")
        var storage = window.localStorage;
        storage.clear();
        this.$router.push("/login")
      })
    },
    selectMenu(item) {
      this.$router.push('/sysUser/UserChangePassword');
      this.$store.commit("addTab", item)
    }
  },
  mounted() {
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/gauge');

    var chartDom = document.getElementById('banner');
    var myChart = echarts.init(chartDom);

    var option;

    option = {
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: 'Campus Sports Equipment Management System',
              fontSize: 28,
              fontWeight: 'bold',
              lineDash: [0, 200],
              lineDashOffset: 0,
              fill: 'transparent',
              stroke: '#409EFF',
              lineWidth: 1
            },
            keyframeAnimation: {
              duration: 4000,
              loop: true,
              keyframes: [
                {
                  percent: 0.7,
                  style: {
                    fill: 'transparent',
                    lineDashOffset: 200,
                    lineDash: [200, 0]
                  }
                },
                {
                  // Stop for a while.
                  percent: 1.1,
                  style: {
                    fill: 'transparent'
                  }
                },
                {
                  percent: 1,
                  style: {
                    fill: '#409EFF'
                  }
                }
              ]
            }
          }
        ]
      }
    };

    option && myChart.setOption(option);


  },
}
</script>

<style scoped>
@import url(../assets/fonts/fons.css);


/*.strong {*/
/*  font-family: ljdxk;*/
/*  font-size: 24px;*/
/*  */
/*}*/

.example-showcase {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
}

.header-avatar {
  float: right;
  width: 150px;
  height: 100%;
  padding-right: 30px;
  margin-top: -45px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-container {
  padding: 0;
  margin: 0;
  height: 100vh;
}

.el-header {
  background-color: #d9ecff;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  line-height: 200px;
}

.el-main {
  color: #333;
  padding: 0px;
}
a {
  text-decoration: none;
}

</style>
