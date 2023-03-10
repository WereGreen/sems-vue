<template>
  <div style="width: 100%;height: 82vh;display: flex;">

    <div class="left">

      <el-card shadow="always" style="margin: 10px">
        <div class="user">
          <img src="../assets/logo.png"/>
          <div class="userInfo">
            <p class="name">{{ userInfo.name }}</p>
            <p class="access">{{userRole}}</p>
          </div>
        </div>

        <div class="login-info">
          欢迎使用校园体育器材管理系统！~
        </div>

      </el-card>

      <el-card shadow="always" style="margin: 10px">
        <div class="time">
          <v-chart id="main" style="margin: -180px -140px;" :option="option"/>

          <div style="width: 330px;">
            <el-divider></el-divider>
          </div>
        </div>


        <div class="currentTime">

          <span style="margin-left: 40px;">当前日期：{{ currentDate.date }}</span>
          <span style="margin-left: 40px;">{{ currentDate.week }}</span>
        </div>
      </el-card>

    </div>
    <div class="right">

      <div class="rightCount">

        <div>
          <el-card shadow="always" class="rightCard">
            <div style="font-size: 16px;color: #606266;">
              累计使用器材
            </div>
            <div class="rightCountNum" style="color: #409EFF;">
              {{ countEquipmentApply }}
            </div>
            <div style="font-size: 18px;color: #909399;float: right;margin-top: 5px;">
              次
            </div>
          </el-card>
        </div>

        <div>
          <el-card shadow="always" class="rightCard">
            <div style="font-size: 16px;color: #606266;font-weight: bold;">
              当前未归还
            </div>
            <div class="rightCountNum" style="color: #67C23A;">
              {{ countEquipmentApply }}
            </div>
            <div style="font-size: 18px;color: #909399;float: right;margin-top: 5px;">
              项
            </div>
          </el-card>
        </div>

        <div>
          <el-card shadow="always" class="rightCard">
            <div style="font-size: 16px;color: #606266">
              当前归还超期
            </div>
            <div class="rightCountNum" style="color: #F56C6C;">
              {{ countEquipmentApply }}
            </div>
            <div style="font-size: 18px;color: #909399;float: right;margin-top: 5px;">
              项
            </div>
          </el-card>
        </div>


        <div style="width: 280px;margin-left: 20px;margin-top: 15px;">

          <el-card shadow="always" class="cardCount">
            <span >今日使用器材：</span>
            <span class="cardCountNum" style="line-height: 80px;">300</span>
            <span style="margin-left: 30px;">次</span>

          </el-card>

          <el-card shadow="always" class="cardCount">
            <span >今日使用器材：</span>
            <span class="cardCountNum" style="line-height: 80px;">300</span>
            <span style="margin-left: 30px;">次</span>

          </el-card>

          <el-card shadow="always" class="cardCount">
            <span >今日使用器材：</span>
            <span class="cardCountNum" style="line-height: 80px;">300</span>
            <span style="margin-left: 30px;">次</span>

          </el-card>

        </div>



      </div>

      <div style="display: flex;justify-content: center;align-items: center;">

        <el-card shadow="always" style="margin-right: 15px;margin-top: 15px;" >
          <span style="font-size: 16px;color: #606266;font-weight: bold;">近七日使用器材次数：</span>
          <div style="width: 350px;height: 290px;margin-right: -100px;margin-top: 20px;margin-bottom: -25px">
            <v-chart id="nightingale" />
          </div>
        </el-card>

          <el-card shadow="always" style="width: 65%;height: 345px;margin-top: 15px;">
            <span style="font-size: 16px;color: #606266;font-weight: bold;">近七日使用器材次数：</span>
            <div style="height: 320px;margin-top: -10px;">
              <v-chart id="bar"/>
            </div>

          </el-card>

      </div>



    </div>
  </div>
</template>

<script>

export default {

  name: "Index",
  data() {
    return {

      countEquipmentApply: '300',

      option: {},

      currentDate: {
        date: '',
        week: '',
      },

      userRole: '',

      userInfo: {},

    }
  },
  created() {
    this.getUserInfo()
  },
  mounted() {

    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/gauge');

    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      series: [
        {

          name: 'hour',
          type: 'gauge',
          radius: '40%',
          center: ['50%', '50%'],
          startAngle: 90,
          endAngle: -270,
          min: 0,
          max: 12,
          splitNumber: 12,
          clockwise: true,
          axisLine: {
            lineStyle: {
              width: 5,
              color: [[1, 'rgba(0,0,0,0.7)']],
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 8
            }
          },
          splitLine: {
            lineStyle: {
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 3,
              shadowOffsetX: 1,
              shadowOffsetY: 2
            }
          },
          axisLabel: {
            fontSize: 16,
            distance: 10,
            formatter: function (value) {
              if (value === 0) {
                return '';
              }
              return value + '';
            }
          },
          anchor: {
            show: true,
            icon: 'path://M532.8,70.8C532.8,70.8,532.8,70.8,532.8,70.8L532.8,70.8C532.7,70.8,532.8,70.8,532.8,70.8z M456.1,49.6c-2.2-6.2-8.1-10.6-15-10.6h-37.5v10.6h37.5l0,0c2.9,0,5.3,2.4,5.3,5.3c0,2.9-2.4,5.3-5.3,5.3v0h-22.5c-1.5,0.1-3,0.4-4.3,0.9c-4.5,1.6-8.1,5.2-9.7,9.8c-0.6,1.7-0.9,3.4-0.9,5.3v16h10.6v-16l0,0l0,0c0-2.7,2.1-5,4.7-5.3h10.3l10.4,21.2h11.8l-10.4-21.2h0c6.9,0,12.8-4.4,15-10.6c0.6-1.7,0.9-3.5,0.9-5.3C457,53,456.7,51.2,456.1,49.6z M388.9,92.1h11.3L381,39h-3.6h-11.3L346.8,92v0h11.3l3.9-10.7h7.3h7.7l3.9-10.6h-7.7h-7.3l7.7-21.2v0L388.9,92.1z M301,38.9h-10.6v53.1H301V70.8h28.4l3.7-10.6H301V38.9zM333.2,38.9v10.6v10.7v31.9h10.6V38.9H333.2z M249.5,81.4L249.5,81.4L249.5,81.4c-2.9,0-5.3-2.4-5.3-5.3h0V54.9h0l0,0c0-2.9,2.4-5.3,5.3-5.3l0,0l0,0h33.6l3.9-10.6h-37.5c-1.9,0-3.6,0.3-5.3,0.9c-4.5,1.6-8.1,5.2-9.7,9.7c-0.6,1.7-0.9,3.5-0.9,5.3l0,0v21.3c0,1.9,0.3,3.6,0.9,5.3c1.6,4.5,5.2,8.1,9.7,9.7c1.7,0.6,3.5,0.9,5.3,0.9h33.6l3.9-10.6H249.5z M176.8,38.9v10.6h49.6l3.9-10.6H176.8z M192.7,81.4L192.7,81.4L192.7,81.4c-2.9,0-5.3-2.4-5.3-5.3l0,0v-5.3h38.9l3.9-10.6h-53.4v10.6v5.3l0,0c0,1.9,0.3,3.6,0.9,5.3c1.6,4.5,5.2,8.1,9.7,9.7c1.7,0.6,3.4,0.9,5.3,0.9h23.4h10.2l3.9-10.6l0,0H192.7z M460.1,38.9v10.6h21.4v42.5h10.6V49.6h17.5l3.8-10.6H460.1z M541.6,68.2c-0.2,0.1-0.4,0.3-0.7,0.4C541.1,68.4,541.4,68.3,541.6,68.2L541.6,68.2z M554.3,60.2h-21.6v0l0,0c-2.9,0-5.3-2.4-5.3-5.3c0-2.9,2.4-5.3,5.3-5.3l0,0l0,0h33.6l3.8-10.6h-37.5l0,0c-6.9,0-12.8,4.4-15,10.6c-0.6,1.7-0.9,3.5-0.9,5.3c0,1.9,0.3,3.7,0.9,5.3c2.2,6.2,8.1,10.6,15,10.6h21.6l0,0c2.9,0,5.3,2.4,5.3,5.3c0,2.9-2.4,5.3-5.3,5.3l0,0h-37.5v10.6h37.5c6.9,0,12.8-4.4,15-10.6c0.6-1.7,0.9-3.5,0.9-5.3c0-1.9-0.3-3.7-0.9-5.3C567.2,64.6,561.3,60.2,554.3,60.2z',
            showAbove: false,
            offsetCenter: [0, '-35%'],
            size: 50,
            keepAspect: true,
            itemStyle: {
              color: '#707177'
            }
          },
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 4,
            length: '58%',
            offsetCenter: [0, '8%'],
            itemStyle: {
              color: '#C0911F',
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 8,
              shadowOffsetX: 2,
              shadowOffsetY: 4
            }
          },
          detail: {
            show: false
          },
          title: {
            offsetCenter: [0, '30%']
          },
          data: [
            {
              value: 0
            }
          ]
        },
        {
          name: 'minute',
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          min: 0,
          max: 60,
          clockwise: true,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 3,
            length: '40%',
            offsetCenter: [0, '8%'],
            itemStyle: {
              color: '#C0911F',
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 4
            }
          },
          anchor: {
            show: true,
            size: 20,
            showAbove: false,
            itemStyle: {
              borderWidth: 10,
              borderColor: '#C0911F',
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 8,
              shadowOffsetX: 2,
              shadowOffsetY: 4
            }
          },
          detail: {
            show: false
          },
          title: {
            offsetCenter: ['0%', '-40%']
          },
          data: [
            {
              value: 0
            }
          ]
        },
        {
          name: 'second',
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          min: 0,
          max: 60,
          animationEasingUpdate: 'bounceOut',
          clockwise: true,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 1.5,
            length: '54%',
            offsetCenter: [0, '8%'],
            itemStyle: {
              color: '#C0911F',
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 8,
              shadowOffsetX: 2,
              shadowOffsetY: 4
            }
          },
          anchor: {
            show: true,
            size: 10,
            showAbove: true,
            itemStyle: {
              color: '#C0911F',
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 5,
              shadowOffsetX: 2,
              shadowOffsetY: 4
            }
          },
          detail: {
            show: false
          },
          title: {
            offsetCenter: ['0%', '-40%']
          },
          data: [
            {
              value: 0
            }
          ]
        }
      ]
    };
    setInterval(function () {
      var date = new Date();
      var second = date.getSeconds();
      var minute = date.getMinutes() + second / 60;
      var hour = (date.getHours() % 12) + minute / 60;
      option.animationDurationUpdate = 300;
      myChart.setOption({
        series: [
          {
            name: 'hour',
            animation: hour !== 0,
            data: [{value: hour}]
          },
          {
            name: 'minute',
            animation: minute !== 0,
            data: [{value: minute}]
          },
          {
            animation: second !== 0,
            name: 'second',
            data: [{value: second}]
          }
        ]
      });
    }, 1000);

    option && myChart.setOption(option);

    var chartNightingale = document.getElementById('nightingale');
    var myNightingale = echarts.init(chartNightingale);
    var NightingaleOption;

    NightingaleOption = {

      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'center',
        top: 'bottom',
        data: [
          'rose1',
          'rose2',
          'rose3',
          'rose4',
          'rose5',
          'rose6',
          'rose7',
          'rose8'
        ]
      },
      series: [
        {
          name: 'Radius Mode',
          type: 'pie',
          radius: [20, 140],
          center: ['25%', '50%'],
          roseType: 'radius',
          itemStyle: {
            borderRadius: 5
          },
          label: {
            show: false
          },
          data: [
            { value: 40, name: 'rose 1' },
            { value: 33, name: 'rose 2' },
            { value: 28, name: 'rose 3' },
            { value: 22, name: 'rose 4' },
            { value: 20, name: 'rose 5' },
            { value: 15, name: 'rose 6' },
            { value: 12, name: 'rose 7' },
            { value: 10, name: 'rose 8' }
          ]
        },
      ]
    };

    NightingaleOption && myNightingale.setOption(NightingaleOption);

    var chartBar = document.getElementById('bar');
    var myBar = echarts.init(chartBar);
    var BarOption;

    BarOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '50%',
          data: [1, 5, 2, 3, 9, 3, 22]
        }
      ]
    };

    BarOption && myBar.setOption(BarOption);


  },

  methods: {

    getUserInfo() {
      this.$axios.get("/tb/userInfo").then(res => {

        this.userInfo = res.data.data;

        if (this.userInfo.userRole == "normal") {
          this.userRole = "管理员"
        } else {
          this.userRole = "超级管理员"
        }

        this.currentDate.date = this.$moment(this.getCurrentTime()).format('YYYY-MM-DD');

        let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        let wk = new Date().getDay();
        this.currentDate.week = weeks[wk];

      })
    },

    getCurrentTime() {
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();

      let dateValue = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;
      return dateValue
    },


  }
}
</script>

<style scoped>

.rightCount {
  display: flex;
  align-items: center;
  margin-left: -17px;
  justify-content: center;
  height: 225px;
  width: 100%;
  font-weight: bold;
}

.rightCountNum {
  font-size: 80px;
  text-align: center;
  line-height: 120px;
  width: 165px;
  margin-left: -20px;
  margin-top: 10px;
}

.cardCount {
  height: 60px;
  width: 295px;
  line-height: 5px;
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0px;
}

.cardCountNum {
  font-size: 30px;
  margin-left: 20px;
  color: coral;
  font-weight: bold;
}


.right {
  width: 70%;
  height: 100%;

  margin-left: 1%;
}

.rightCard {
  width: 165px;
  height: 215px;
  margin: 15px 15px 0px ;
}

.left {
  width: 30%;
  height: 100%;
  font-weight: bold;
}

.user {
  height: 150px;
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid rgb(224, 224, 224);
}

img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid rgb(224, 224, 224);
  margin: 20px 0;
}

.userInfo {
  margin: auto;
}

p {
  margin: 0;
}

.name {
  font-size: 24px;
}

.access {
  font-size: 10px;
  color: gray;
}

.login-info {
  font-size: 12px;
  color: gray;
  margin: 15px 0 -5px 0;
}

.currentTime {
  margin-top: -135px;
  font-size: 16px;
  color: #606266;
}

.time {
  height: 600px;
  width: 600px;
  margin-bottom: -120px;
}


</style>
