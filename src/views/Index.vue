<template>
  <div style="width: 100%;height: 82vh;display: flex;">

    <div class="left">

      <el-card shadow="always" style="margin: 10px">
        <div class="user">
          <img src="../assets/logo.png"/>
          <div class="userInfo">
            <p class="name">{{ userInfo.name }}</p>
            <p class="access">{{ userRole }}</p>
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
              {{ countNowReturn }}
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
              {{ countNowDelay }}
            </div>
            <div style="font-size: 18px;color: #909399;float: right;margin-top: 5px;">
              项
            </div>
          </el-card>
        </div>


        <div style="width: 280px;margin-left: 16px;margin-top: 15px;">

          <el-card shadow="always" class="cardCount">
            <span>累计延迟归还次数：</span>
            <span style="color: #409EFF;font-size: 18px;">{{ countDelay }}</span>
          </el-card>

          <el-card shadow="always" class="cardCount">
            <span>累计造成差异次数：</span>
            <span style="color: #F56C6C;font-size: 18px;">{{ countDifference }}</span>

          </el-card>

          <el-card shadow="always" class="cardCount">
            <span>累计提交申请次数：</span>
            <span style="color: #67C23A;font-size: 18px;">{{ countApply }}</span>
          </el-card>

        </div>

      </div>

      <div style="display: flex;justify-content: center;align-items: center;">

        <el-card shadow="always" style="margin-right: 15px;margin-top: 15px;">
          <span style="font-size: 16px;color: #606266;font-weight: bold;">各类器材使用次数统计：</span>
          <div style="width: 350px;height: 290px;margin-right: -100px;margin-top: 20px;margin-bottom: -25px">
            <v-chart id="nightingale"/>
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

import moment from "moment";

export default {

  name: "Index",
  data() {
    return {

      countEquipmentApply: 0,
      countNowReturn: 0,
      countNowDelay: 0,
      countDelay: 0,
      countDifference: 0,
      countApply: 0,
      xDataArr: [],
      yDataArr: [],
      dataTime: [],

      option: {},

      currentDate: {
        date: '',
        week: '',
      },

      useList: [],

      userRole: '',

      userInfo: {},

      BarOption: {
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
            data: this.xDataArr,
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
            name: '次数',
            type: 'bar',
            data: [],
            barWidth: '50%',

          }
        ]
      },

      NightingaleOption: {

        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: []
        },
        series: [
          {
            name: '使用次数',
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
            data: []
          },
        ]
      },

      equipmentInfo: [{}],

    }
  },
  created() {
    this.getUserInfo();
    this.getUseInfo();
    this.getCountDelay();
    this.getCountDifference();
    this.getCountApply();

  },

  methods: {

    getUseInfo() {
      this.$axios.get("/tb/use/info").then(res => {
        this.countEquipmentApply = 0;
        this.countNowDelay = 0;
        this.countNowReturn = 0;
        let use = res.data.data.useList;
        this.useList = res.data.data.useList;

        this.countEquipmentApply = use.length;

        for (let i = 0; i < use.length; i++) {
          if (use[i].state == 0) {
            this.countNowReturn++;

            let returnDate = use[i].returnDate;

            let yy = new Date(returnDate).getFullYear();

            let mm = new Date(returnDate).getMonth() + 1 < 10 ?
                '0' + (new Date(returnDate).getMonth() + 1) : (new Date(returnDate).getMonth() + 1);

            let dd = new Date(returnDate).getDate() < 10 ?
                '0' + new Date(returnDate).getDate() : new Date(returnDate).getDate();

            let hh = new Date(returnDate).getHours() < 10 ?
                '0' + new Date(returnDate).getHours() : new Date(returnDate).getHours();

            let mf = new Date(returnDate).getMinutes() + 10;

            if (mf >= 60) {
              mf = '0' + (mf - 60);
              hh = hh + 1;
              if (hh >= 24) {
                hh = '0' + (hh - 24);
                dd = dd + 1;
                let testYYMM = yy + '-' + mm
                let thisMd = moment(testYYMM, "YYYY-MM").daysInMonth()

                if (dd > thisMd) {
                  dd = '0' + (dd - thisMd)
                  mm = new Date(returnDate).getMonth() + 2 < 10 ?
                      '0' + (new Date(returnDate).getMonth() + 2) : (new Date(returnDate).getMonth() + 2);
                  ;
                  if (mm > 12) {
                    mm = '0' + (mm - 12);
                    yy = new Date(returnDate).getFullYear() + 1;
                  }
                }
              }
            }

            let dateValue = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;


            if (this.compareDate(this.getCurrentTime(), dateValue)) {
              this.countNowDelay++;
            }
          }

        }
        this.getXDataArr();
        this.getYdataArr();
        this.getEquipmentInfo();

      })
    },

    getEquipmentInfo() {
      this.$axios.get("/tb/equipment/info").then(res => {

        let equipments = res.data.data.equipments;
        this.equipmentInfo = equipments;
        let legendData = [];
        let seriesData = [];
        let pieData = {};
        let count;


        for (let i = 0; i < equipments.length; i++) {
          count = 0;
          pieData = {};
          for (let j = 0; j < this.useList.length; j++) {
            if (this.useList[j].equipment == equipments[i].equipment) {
              count ++;
            }
          }
          if (count != 0) {
            pieData.name = equipments[i].equipment;
            pieData.value = count;
            seriesData.push(pieData);
          }
        }

        seriesData.sort(function (a, b) {
          return b.value - a.value;
        });

        const echarts = require('echarts/lib/echarts');
        require('echarts/lib/chart/gauge');

        var chartNightingale = document.getElementById('nightingale');
        var myNightingale = echarts.init(chartNightingale);



        // if (seriesData.length > 8) {
        //
        //   this.NightingaleOption.series[0].data = seriesData.slice(0,8)
        //
        //   seriesData.slice(0,8)
        //   console.log("----seriesData----")
        //   console.log(seriesData.slice(0,8))
        // } else {
        //   this.NightingaleOption.series[0].data = seriesData;
        // }

        this.NightingaleOption.series[0].data = seriesData;

        myNightingale.setOption(this.NightingaleOption)


      })
    },

    getXDataArr() {

      let nowData = this.getCurrentTime();
      console.log("nowData")
      console.log(nowData)
      this.xDataArr = [];
      this.dataTime = [];

      for (let i = 0; i < 7; i++) {
        var subtract = moment(nowData).subtract(i, 'd');

        let yy = new Date(subtract).getFullYear();
        let mm = new Date(subtract).getMonth() + 1 < 10 ? '0' + (new Date(subtract).getMonth() + 1) : new Date(subtract).getMonth() + 1;
        let dd = new Date(subtract).getDate() < 10 ? '0' + new Date(subtract).getDate() : new Date(subtract).getDate();
        let hh = 23;
        let mf = 59;

        let Data = mm + '-' + dd;
        let DataTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;

        console.log("Data")
        console.log(Data)
        this.xDataArr.unshift(Data);
        this.dataTime.unshift(DataTime);

        if (i == 6) {
          let minDataTime = yy + '-' + mm + '-' + dd + ' ' + '00:00';
          this.dataTime.unshift(minDataTime);
        }

      }

      console.log("this.xDataArr")
      console.log(this.xDataArr)

      console.log("this.dataTime")
      console.log(this.dataTime)

      const echarts = require('echarts/lib/echarts');
      require('echarts/lib/chart/gauge');

      this.BarOption.xAxis[0].data = this.xDataArr;

      var chartBar = document.getElementById('bar');
      var myBar = echarts.init(chartBar);

      myBar.setOption(this.BarOption);

    },

    getYdataArr() {

      const echarts = require('echarts/lib/echarts');
      require('echarts/lib/chart/gauge');

      let count;
      let useList = this.useList;
      this.yDataArr = [];

      for (let i = 0; i < this.dataTime.length - 1; i++) {
        count = 0;
        for (let j = 0; j < this.useList.length; j++) {

          if (this.compareDate(this.useList[j].applyDate, this.dataTime[i])
              && this.compareDate(this.dataTime[i + 1], this.useList[j].applyDate)) {
            count++;
          }
        }
        this.yDataArr.push(count)
      }

      this.BarOption.series[0].data = this.yDataArr;

      var chartBar = document.getElementById('bar');
      var myBar = echarts.init(chartBar);

      myBar.setOption(this.BarOption);

      console.log("this.yDataArr")
      console.log(this.yDataArr)
    },

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
      let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
      let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();

      let dateValue = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;
      return dateValue
    },

    compareDate(d1, d2) {
      let date1 = new Date(Date.parse(d1))
      let date2 = new Date(Date.parse(d2))
      return date1 > date2
    },

    getCountApply() {
      this.$axios.get("/tb/apply/countInfo").then(res => {
        this.countApply = res.data.data.applyList.length;
      })
    },

    getCountDelay() {
      this.$axios.get("/tb/delay/countInfo").then(res => {
        this.countDelay = res.data.data.delayList.length;
      })
    },

    getCountDifference() {
      this.$axios.get("/tb/difference/info").then(res => {
        this.countDifference = res.data.data.differenceList.length;
      })
    },

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

    // var chartNightingale = document.getElementById('nightingale');
    // var myNightingale = echarts.init(chartNightingale);
    // var NightingaleOption = this.NightingaleOption;
    //
    // NightingaleOption && myNightingale.setOption(NightingaleOption);


    // var chartBar = document.getElementById('bar');
    // var myBar = echarts.init(chartBar);
    // var BarOption = this.BarOption;
    //
    // BarOption && myBar.setOption(BarOption);


  },


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
  font-size: 16px;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0px;
}


.right {
  width: 70%;
  height: 100%;

  margin-left: 1%;
}

.rightCard {
  width: 165px;
  height: 215px;
  margin: 15px 15px 0px;
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
