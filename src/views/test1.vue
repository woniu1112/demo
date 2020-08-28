<template>
    <div class="timemanagement">
        <van-tabs>
            <!-- <van-tab title="自动锁控时间管理"> -->
            <van-tab class="showFlag">
                <div class="guardTime">
                    <ol class="sunday">
                        <li v-for="(item,index) in sunday" :key="index" @click="sundayTime(item.name,item.value)"  class="sundaySpan">{{item.name}}
                            <b class="triangle" v-if="sunValue == item.value"></b>
                        </li>
                    </ol>
                    <div class="freeTimeLegend">
                        <p class="sundayFreeTime">周{{sundayCutton}}自由时间</p>
                        <div class="sundayFreeTime-right">
                            <b></b>
                            <span style="padding-right:0.2rem">自由时间</span>
                            <b style="background:#f68c98"></b>
                            <span v-if="deviceType == 'iOS'">锁控时间</span>
                            <span v-else>锁屏时间</span>
                        </div>
                    </div>
                    <div class="dateList">
                        <div class="morning">
                            <div class="morning-left">
                                <p>上<br/>午</p>
                                <p>下<br/>午</p>
                            </div>
                            <div class="morning-right">
                                <van-checkbox-group v-model="topNum" @change="modify">
                                    <van-checkbox  v-for="(item, index) in topList" :key="index" :name="item"> {{item}}
                                    </van-checkbox>
                                </van-checkbox-group>
                            </div>
                        </div>
                    </div>
                    <div class="timeSlot">
                       <p class="fl">自由时间 : </p> 
                       <div class="timelist fr">
                           <span v-for="(i,index) in currentFreeTime" :key="index">{{i.time}}</span>
                       </div>
                       
                    </div>
                </div>
                <section class="conserve-btn" @click="save">保存</section>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
    import {
        SwipeCell,
        Dialog,
        Toast
    } from "vant";
    export default {
        data() {
            return {
                active:0,
               
                childrenId: localStorage.getItem("currentChildId"),
                
                currentDate: "00:10",
                currentId: "",
                currentName: "",
                timeType: "",
                time_length: [],
                time_user: [],
                timeList: [],
                currentSlideId: "",
                settingShow: false,
                limitappsArr: [], //限制
                topList:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
                topNum:[],
                sunday:[{
                    value:'sun',
                    name:'日'
                },{
                    value:'mon',
                    name:'一'
                },{
                    value:'tues',
                    name:'二'
                },{
                    value:'wed',
                    name:'三'
                },{
                    value:'thurs',
                    name:'四'
                },{
                    value:'fri',
                    name:'五'
                },{
                    value:'sat',
                    name:'六'
                }],
                sundayCutton:'日',
                currentFreeTime:[],
                guardTimeArr:[],
                sunValue : 'sun',
                id:'',
                flags : this.$route.query.flag
            };
        },
        mounted() {
            this.getGuardTime();
        },
        methods: {
            //修改的时候（重点在这里）修改
            modify(value){
                let temporaryNum=['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
                    this.guardTimeArr.forEach((item,indexL)=>{
                        if(this.sunValue == item.sunday){
                            if(value.length == 0){  //全是自由时间的情况
                                this.guardTimeArr[indexL][this.sunValue].length = 0;
                                this.guardTimeArr[indexL][this.sunValue].push({
                                    startTime:'00:00',
                                    endTime:'24:00'
                                })
                                this.currentFreeTime.length = 0;
                                this.currentFreeTime.push({
                                    time:"00:00"+'-'+'24:00'
                                })
                            }else{

                                item.sunTemporary = value;
                                //console.log(item.sunTemporary)
                                item.sunTemporary.forEach((h)=>{
                                    temporaryNum.forEach((l,index)=>{
                                        if(h==l){
                                            temporaryNum.splice(index,1)
                                            if(temporaryNum.length==0){ //全是守护时间的情况
                                                this.guardTimeArr[indexL][this.sunValue].length = 0;
                                                this.guardTimeArr[indexL][this.sunValue].push({
                                                    startTime:'00:00',
                                                    endTime:'00:00'
                                                })
                                                this.currentFreeTime.length = 0;
                                                this.currentFreeTime.push({
                                                    time:"00:00"+'-'+'00:00'
                                                })
                                            }else{
                                                var bigArr = []  //大数组
                                                var smallArr = [] //拆开的小数组
                                                //这里需要拆分数组
                                                for (var i = 0; i < temporaryNum.length; i++) {
                                                    if (temporaryNum[i+1] - temporaryNum[i] === 1) {
                                                    smallArr.push(temporaryNum[i])
                                                    } else {
                                                    smallArr.push(temporaryNum[i])
                                                    bigArr.push(smallArr)
                                                    smallArr = []
                                                    }
                                                }
                                                //console.log(bigArr)
                                                let arr = [];
                                                bigArr.forEach((items)=>{
                                                    arr.push({
                                                        startTime:items[0]<10?'0'+items[0]+':'+"00":items[0]+':'+"00",
                                                        endTime:(parseInt(items[items.length-1])+1) < 10? '0'+(parseInt(items[items.length-1])+1)+':'+"00":(parseInt(items[items.length-1])+1)+':'+"00"
                                                    })
                                                })
                                                this.guardTimeArr[indexL][this.sunValue] = arr;
                                                this.currentFreeTime.length=0;
                                                arr.forEach((k)=>{
                                                    this.currentFreeTime.push({
                                                        time:k.startTime+'-'+k.endTime
                                                    })
                                                })
                                            }
                                        }
                                    })
                                })
                            }
                        }
                    })
            },
            //切换星期
            sundayTime(content,value){
                this.sundayCutton = content;
                this.sunValue = value;
                //console.log(this.guardTimeArr)
                this.guardTimeArr.forEach((i,index)=>{
                    if(value==i.sunday){
                        this.publicTime(i[i.sunday],index)
                    }
                })
            },
            //公共函数（默认数据）查询
            publicTime(oneDay,indexs){
                let startValue = '';
                let endValue = '';
                let freeTimeArr = [];
                let freeTimeShow = [];  //自由时间的展示
                oneDay.forEach((i)=>{
                    freeTimeShow.push({
                        time:i.startTime+'-'+i.endTime
                    })
                    startValue = i.startTime.substr(0,1) > 0 ? i.startTime.substr(0,2) :i.startTime.substr(1,1);
                    endValue = i.endTime.substr(0,1) > 0 ? i.endTime.substr(0,2) : i.endTime.substr(1,1)
                    for(var j=parseInt(startValue);j<parseInt(endValue);j++){
                       freeTimeArr.push(j.toString())
                    }
                })
                this.guardTimeArr[indexs].sunTemporary= ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
                freeTimeArr.forEach((k)=>{
                     this.guardTimeArr[indexs].sunTemporary.forEach((item,index)=>{
                         if(k==item){
                            this.guardTimeArr[indexs].sunTemporary.splice(index,1)
                         }
                    })
                })
                this.topNum = this.guardTimeArr[indexs].sunTemporary;
                this.currentFreeTime = freeTimeShow; //自由时间的展示
            },
            //获取守护时间
            getGuardTime(){
                this.guardTimeArr.push({
                            sunday:"sun",
                            sun:[{"startTime":"00:00","endTime":"03:00"},{"startTime":"04:00","endTime":"05:00"}],
                            sunTemporary:[],
                            topLists:[],
                            dayCutton:'日'
                        },{
                            sunday:"mon",
                            mon:[{"startTime":"00:00","endTime":"24:00"}],
                            sunTemporary:[],
                            topLists:[],
                            dayCutton:'一'
                        },{
                            sunday:"tues",
                            tues:[{"startTime":"00:00","endTime":"24:00"}],
                            sunTemporary:[],
                            topLists:[],
                            dayCutton:'二'
                        },{
                            sunday:"wed",
                            wed:[{"startTime":"00:00","endTime":"24:00"}],
                            sunTemporary:[],
                            topLists:[],
                            dayCutton:'三'
                        },{
                            sunday:"thurs",
                            thurs:[{"startTime":"00:00","endTime":"24:00"}],
                            sunTemporary:[],
                            topLists:[],
                            dayCutton:'四'
                        },{
                            sunday:"fri",
                            fri:[{"startTime":"00:00","endTime":"24:00"}],
                            sunTemporary:[],
                            topLists:[],
                            dayCutton:'五'
                        },{
                            sunday:"sat",
                            sat:[{"startTime":"00:00","endTime":"24:00"}],
                            sunTemporary:[],
                            topLists:[],
                            dayCutton:'六'
                        })
            },
            save(){
                let guardData = {};
                guardData={
                    id:this.id,
                    mon: JSON.stringify(this.guardTimeArr[1].mon),
                    tues:JSON.stringify(this.guardTimeArr[2].tues),
                    wed:JSON.stringify(this.guardTimeArr[3].wed),
                    thurs:JSON.stringify(this.guardTimeArr[4].thurs),
                    fri:JSON.stringify(this.guardTimeArr[5].fri),
                    sat:JSON.stringify(this.guardTimeArr[6].sat),
                    sun:JSON.stringify(this.guardTimeArr[0].sun),
                    "children.id":this.childrenId
                }
                this.axios.put('/screen/time/rule',
                    guardData,
                {
                    server: 'desktop'
                }).then((res)=>{
                   if(res){
                       Toast("保存成功");
                   }else{
                       Toast("保存失败");
                   }
                })
            },
            onClick(index, title) {
                if (title == '限制时间') {
                    //this.getMSG();
                } else if (title == '受限应用') {
                    //this.getLimitApps();
                }
            },
            //根据孩子ID获取当前应用列表信息
            getLimitApps: function() {
                this.axios.get('/application', {
                    params: {
                        childrenId: this.childrenId,
                        applicationStatus: 'BE_LIMITED'
                    },
                    server: 'desktop'
                }).then(res => {
                    this.limitappsArr = res.resultData;
                })
            },
            //禁用使用app
            forbidItx: function(app) {
                Dialog.confirm({
                    title: "禁用",
                    message: "是否禁止当前应用的使用？"
                }).then(() => {
                    this.axios.put('/application/set/status', {
                        id: app.id,
                        applicationStatus: 'BLACK_LIST'
                    }, {
                        server: 'desktop'
                    }).then(res => {
                        if (res) {
                            Toast('已成功禁止该应用！');
                            this.getLimitApps();
                        } else {
                            Toast('禁止失败！')
                        }
                        this.getLimitApps();
                    })
                }).catch(() => {
                    Dialog.close();
                })
            },
            //自由使用app
            freeItx: function(app) {
                Dialog.confirm({
                    title: "解除限制",
                    message: "是否解除对当前应用的限制？"
                }).then(() => {
                    this.axios.put('/application/set/status', {
                        id: app.id,
                        applicationStatus: 'WHITE_LIST'
                    }, {
                        server: 'desktop'
                    }).then(res => {
                        if (res) {
                            Toast('已成功解除限制！');
                            this.getLimitApps();
                        } else {
                            Toast('解除限制失败！')
                        }
                        this.getLimitApps();
                    })
                }).catch(() => {
                    Dialog.close();
                })
            },
            liMove: function(id) {
                this.currentSlideId = id;
            },
            onClose: function(clickPosition, instance) {
                switch (clickPosition) {
                    case "right":
                        Dialog.confirm({
                            message: "确定删除吗？"
                        })
                        .then(() => {
                            this.axios
                                .delete("/day/rule/" + this.currentSlideId, {
                                    server: "desktop"
                                })
                                .then(res => {
                                    if (res) {
                                        this.getMSG();
                                    }
                                });
                        })
                        .catch(() => {
                            instance.close();
                        });
                    break;
                }
            },
            set_time(item) {
                this.$router.push({
                    path: "timemanagement/settime",
                    name: "SetTime",
                    query: {
                        item: JSON.stringify(item)
                    }
                });
            },
            time_pop(item) {
                this.currentId = item.id;
                this.currentName = item.name;
                let currentDate =
                    Math.floor(item.usableTime / 60) + ":" + (item.usableTime % 60);
                this.currentDate = currentDate;
                this.settingShow = true;
                //let _this = this;
                // setTimeout(function() {
                //     _this.$refs.cover.style.display = "block";
                // }, 100)
            },
            confirm() {
                let pickCurrentDate = this.currentDate;
                let pickCurrentDateArr = pickCurrentDate.split(":");
                let sendDate =
                    parseInt(pickCurrentDateArr[0]) * 60 + parseInt(pickCurrentDateArr[1]);
                this.axios
                    .put(
                        "/day/rule", {
                            id: this.currentId,
                            name: this.currentName,
                            usableTime: sendDate,
                            "children.id": this.childrenId,
                            type: "1"
                        }, {
                            server: "desktop"
                        }
                    )
                    .then(res => {
                        //this.$refs.cover.style.display = "none";
                        this.settingShow = false;
                        this.getMSG();
                        Toast('您设置的每日使用时长将会立即生效');
                    });
            },
            cancel() {
                //this.$refs.cover.style.display = "none";
                this.settingShow = false;
            },
            time_back() {
                history.go(-1);
                // this.$router.push({
                //     path: "/index/guard"
                    // name:'Guard',
                    // params: {
                    //     lockId: this.$route.query.id,
                    //     childId:this.$route.query.ChildId,
                    //     childType:this.$route.query.childType
                    // }
                // });
            },
            getMSG() {
                //判断是时间管理进入还是自动守护管理
                if(JSON.stringify(this.$route.query)!="{}"){
                    if(this.$route.query.flag == 2){
                        this.active = 1;
                    }
                }else{
                    document.getElementsByClassName('van-tabs__wrap')[0].style.display = 'none'
                    this.active = 0;
                }
                this.axios
                    .get("/day/rule/parent", {
                        params: {
                            childrenId: this.childrenId
                        },
                        server: "desktop"
                    })
                    .then(res => {
                        this.timeList = res.resultData;
                        this.time_length = this.timeList.filter(el => {
                            return el.usableTime >= 0;
                        });
                        this.time_user = this.timeList.filter(el => {
                            return el.startTime;
                        });
                        this.time_user.forEach(function(item, index) {
                            let enArr = item.week.split(',');
                            let cnArr = [];
                            let numArr = [];
                            for (let i = 0; i < enArr.length; i++) {
                                if (enArr[i] == 'MON') {
                                    cnArr.push('周一');
                                    numArr.push(1);
                                } else if (enArr[i] == 'TUES') {
                                    cnArr.push('周二');
                                    numArr.push(2);
                                } else if (enArr[i] == 'WED') {
                                    cnArr.push('周三');
                                    numArr.push(3);
                                } else if (enArr[i] == 'THURS') {
                                    cnArr.push('周四');
                                    numArr.push(4);
                                } else if (enArr[i] == 'FRI') {
                                    cnArr.push('周五');
                                    numArr.push(5);
                                } else if (enArr[i] == 'SAT') {
                                    cnArr.push('周六');
                                    numArr.push(6);
                                } else if (enArr[i] == 'SUN') {
                                    cnArr.push('周日');
                                    numArr.push(7);
                                }
                            }
                            item.weekStr = cnArr.join(',');
                            item.numArr = numArr;
                        })
                        this.time_user.map(item => {
                            this.timeType = item.name;
                        });
                    });
            }
        }
    };
</script>
<style>
/* 2019/1/17守护时间 */
.timemanagement {
    font-size: 0.3rem;
}
    .timemanagement .guardTime{
        margin: 0.24rem;
        border-radius: 0.2rem;
    }
    .timemanagement .sunday{
        height: 0.77rem;
        background: #4768f3;
    }
    .timemanagement .freeTimeLegend{
        height:1rem;
        background: #fff;
        padding:0 0.26rem;
    }
    .timemanagement .apps-tip{
        width: 6.72rem;
        margin: 0.2rem auto 0.15rem;
        font-size: 0.22rem;
        line-height: 0.32rem;
        color: #666;
        letter-spacing: 0.01rem;
    }
    /* .timemanagement .freeTimeLegend:before{
        content:"";
        border:10px solid transparent;
        position:absolute;
        left:16px;
        top:0;
        margin-top:-20px;
    }
    .timemanagement .freeTimeLegend:after{
        content:"";
        border:10px solid transparent;
        border-bottom-color:white;
        position: absolute;
        top:0;
        left:16px;
        margin-top:-19px;
    } */
    .timemanagement .freeTimeLegend .sundayFreeTime{
        float: left;
        line-height: 1rem;
    }
    .timemanagement .freeTimeLegend .sundayFreeTime-right{
        float: right;
        line-height: 1rem;
    }
    .timemanagement .freeTimeLegend .sundayFreeTime-right b{
        display: inline-block;
        width:0.22rem;
        height:0.22rem;
        background: #6e98ef;
        vertical-align: middle;
    }
    .timemanagement .freeTimeLegend .sundayFreeTime-right span{
        display: inline-block;
        color: #999;
        font-size: 0.27rem;
    }
    .timemanagement .guardTime .dateList{
        height:3.2rem;
        background: #fff;
        border-top:0.01rem solid #dcdcdc;
        border-bottom: 0.01rem solid #dcdcdc;
    }
    .timemanagement .guardTime .dateList .morning{
        /* height:1.6rem; */
        border-bottom: 0.01rem solid #dcdcdc;
    }
    .timemanagement .guardTime .dateList .morning .morning-left{
        width:15%;
        line-height: 0.8rem;
        text-align: center;
        height:1.6rem;
        border-right: 0.01rem solid #dcdcdc;
        float: left;
    }
    .timemanagement .guardTime .dateList .morning .morning-right{
        float: right;
        width:84.7%;
        height:1.6rem;
    }
    .timemanagement .guardTime .dateList .morning .morning-right .van-checkbox{
        position: relative;
        height:0.8rem;
        float: left;
    }
    .timemanagement .guardTime .dateList .morning .morning-right .van-checkbox .van-checkbox__label{
        position: absolute;
        top:0.2rem;
        left:0.15rem;
    }
    .timemanagement .guardTime .dateList .morning .morning-right .van-checkbox .van-checkbox__icon{
        width:0.94rem;
        height:0.8rem;
        background: #6e98ef;
        border-color:#6e98ef;
    }
    .timemanagement .guardTime .dateList .morning .morning-right .van-checkbox .van-checkbox__icon .van-icon{
        width:0.94rem;
        height:0.8rem;
        border-radius:0;
    }
    .timemanagement .guardTime .dateList .morning .morning-right .van-checkbox .van-checkbox__icon .van-icon-success:before{
        display: none;
    }
    .timemanagement .guardTime .dateList .morning .morning-right .van-checkbox .van-checkbox__icon--checked .van-icon{
        background: #f68c98;
        border-color:none;
        border: 1px solid #e5e5e5;
        cursor: pointer;
    }
    .timemanagement .sunday .sundaySpan{
        display: inline-block;
        color: #fff;
        font-size: 0.32rem;
        line-height: 0.77rem;
        width: 14%;
        text-align: center;
        position: relative;
    }
    .timemanagement .sunday .sundaySpan .triangle{
        position: absolute;
        top:0.41rem;
        left:0.29rem;
        width: 0;
        height: 0;
        border-width: 0.18rem;
        border-style: solid;
        border-color:  transparent transparent #fff transparent;
    }
    .timemanagement .guardTime .timeSlot{
        /* height:1rem; */
        background: #fff;
        line-height: 0.43rem;
        padding: 0.08rem 0 0.08rem 0.25rem;
        overflow: hidden;
    }
    .timemanagement .guardTime .timeSlot .timelist{
        width:80%;
    }
    .timemanagement .guardTime .timeSlot p{
        font-size: 0.24rem;
    }
    .timemanagement .guardTime .timeSlot span{
        display: inline-block;
        color: #a3a3a3;
        font-size: 0.24rem;
        padding-right: 0.25rem;
    }
    .timemanagement .conserve-btn{
        height: 0.96rem;
        line-height: 0.96rem;
        margin: 0.44rem;
        border-radius: 0.1rem;
        background: #4768f3;
        font-size: 0.32rem;
        color: #fff;
        text-align: center;
    }
    .timemanagement {
        /*background: #f5f6f8;*/
        /*height: 11.98rem;*/
        /*padding-bottom: 0.15rem;*/
    }
    .timemanagement .freetime,
    .duration {
        position: relative;
        margin: 0.24rem;
        border-radius: 0.2rem;
        background: #fff;
    }
    .timemanagement .limitapps {
        padding: 0.24rem 0 0.1rem;
    }
    .timemanagement .limitapps h2 {
        text-align: center;
        font-weight: 400;
        line-height: 1.5rem;
    }
    .timemanagement .head_border {
        display: block;
        width: 0.07rem;
        height: 0.28rem;
        background: #4768f3;
        position: absolute;
        top: 0.3rem;
        left: 0;
    }
    .timemanagement .freetime .time_title {
        display: flex;
        align-items: center;
        padding-left: 0.23rem;
        height: 0.9rem;
        border-bottom: 1px solid #f1f1f1;
        font-size: 0.28rem;
        color: #333333;
    }
    .timemanagement .duration .time_title {
        display: flex;
        align-items: center;
        padding-left: 0.23rem;
        height: 0.9rem;
        border-bottom: 1px solid #f1f1f1;
        font-size: 0.28rem;
        color: #333333;
    }
    .timemanagement ul li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0.3rem 0 0.3rem;
        height: 1.25rem;
        border-bottom: 1px solid #f1f1f1;
    }
    .timemanagement ul li img {
        width: 0.19rem;
        height: 0.28rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0.2rem;
    }
    .timemanagement ul li div div:nth-of-type(1) {
        font-size: 0.23rem;
        color: #323232;
    }
    .timemanagement ul li div div:nth-of-type(2) {
        font-size: 0.23rem;
        color: #9c9c9c;
    }
    .timemanagement .freetime .add_time {
        text-align: center;
        font-size: 0.26rem;
        color: #646464;
        height: 0.9rem;
        line-height: 0.9rem;
    }
    .timemanagement .cover {
        /* width: 100%;
        height: 100%; */
        background: rgba(0, 0, 0, 0.3);
        /* position: absolute;
        top: 0;
        left: 0;
        display: none; */
    }
    .timemanagement .cover .warp{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .timemanagement .cover .botton-cancel{
        line-height: 1rem;
        display: flex;
    }
    .timemanagement .cover .botton-cancel button{
        width: 49%;
        border-left:0.01rem solid #f1f1f1;
        color: #4768f3;
    }
    .timemanagement .cover .botton-cancel .cancel-left{
        color: #000;
        border-left:none;
    }
    .timemanagement .cover_title {
        width: 6rem;
        /* height: 4.3rem; */
        border-radius: 0.2rem;
        background: #fff;
    }
    .timemanagement .cover_title p {
        width: 100%;
        height: 1.1rem;
        text-align: center;
        line-height: 1.1rem;
        color: #333333;
        font-size: 0.3rem;
    }
    .timemanagement .van-picker {
        width: 100%;
        /* height: 3.4rem; */
        position: relative;
        border-bottom-left-radius: 0.2rem;
        border-bottom-right-radius: 0.2rem;
    }
    .timemanagement .van-picker__columns {
        width: 100%;
        /* height: 3.4rem !important; */
        border-bottom: 1px solid #f1f1f1;
        padding-bottom: 0.3rem;
    }
    .timemanagement .van-picker-column {
        width: 100%;
        padding-left: 0.5rem;
    }
    .timemanagement .van-picker .van-picker-column__item {
        font-size: 0.4rem;
        color: #4768f3;
        border: 0;
    }
    .timemanagement .van-picker .van-picker-column__item--selected {
        font-size: 0.73rem;
        color: #4768f3;
        border: 0;
    }
    .timemanagement .van-picker__toolbar {
        position: absolute;
        width: 100%;
        height: 0.9rem;
        bottom: 0;
        left: 0;
        background: #fff;
        z-index: 1;
        border-top: 1px solid #f1f1f1;
        border-bottom-left-radius: 0.2rem;
        border-bottom-right-radius: 0.2rem;
    }
    .timemanagement .van-picker__toolbar .van-picker__cancel {
        margin-left: 1.15rem;
        color: #666666;
        font-size: 0.28rem;
    }
    .timemanagement .van-picker__toolbar .van-picker__confirm {
        margin-right: 1.15rem;
        font-size: 0.28rem;
        color: #4768f3;
    }
    .timemanagement .van-picker__frame {
        position: absolute;
        top: 1.25rem;
        left: 0;
    }
    .timemanagement .van-cell {
        border: none !important;
        padding: 0 0.24rem !important;
    }
    .timemanagement [class*="van-hairline"]::after {
        border: none !important;
    }
    .timemanagement .van-cell:not(:last-child)::after {
        border: none !important;
    }
    /* tab样式 */
    .timemanagement .van-tabs--line .van-tabs__wrap {
        width: 100%;
        height: 0.96rem;
        display: none;
    }
    
    .timemanagement .van-tabs--line .van-tabs__wrap .van-tabs__line {
        /*width: 2.24rem !important;*/
        height: 0.04rem;
        background-color: #4768f3;
        /*margin-left: -0.2rem;*/
        /* transform: translateX(0)!important; */
    }
    .timemanagement .van-tabs--line .van-tabs__wrap .van-tab {
        color: #b4b4b4;
        font-size: 0.28rem;
        line-height: 0.92rem;
        padding: 0;
    }
    .timemanagement .van-tabs--line .van-tabs__wrap .van-tab--active {
        color: #000;
    }
</style>
