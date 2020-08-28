<template>
    <div class="timemanagementnew">
        <van-tabs v-model="active" @click="onClick">
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
                                <span v-for="(item, index) in topLists"
                                      :key="index"
                                      @click="mod(item)"
                                      :class="item.isFlag ? 'flag':''"
                                      :style="{background:item.time && item.flagArr.length == 2 ? '#6e98ef' : ''}">
                                    <b :style="{ width: (item.time/60)*100 + '%',background:!item.isFlag ? '#f68c98' : ''  }"
                                       v-if="item.time && item.flagArr.length < 2"></b>
                                    <b :style="{ left:(item.flagArr[0]/60)*100 + '%', width: ((parseInt(item.flagArr[1]) - parseInt (item.flagArr[0]))/60)*100 + '%',background:'#f68c98'  }"
                                       v-if="item.time && item.flagArr.length == 2"></b>
                                    <i> {{ item.text }}</i>
                                </span>
                                <!-- <van-checkbox-group v-model="topNum" @change="modify">
                                    <van-checkbox  v-for="(item, index) in topList" :key="index" :name="item"> {{item}}
                                    </van-checkbox>
                                </van-checkbox-group> -->
                            </div>
                        </div>
                    </div>
                    <div class="timeSlot">
                       <p class="fl">自由时间 : </p>
                       <div class="timelist fr">
                           <span v-for="(i,index) in currentFreeTime"
                                 :key="index">{{i.startTime}}-{{i.endTime}}</span>
                       </div>
                    </div>
                    <div class="timeSlot lock" >
                       <p class="fl">锁屏时间 : </p>
                       <div class="timelist fr">
                           <span v-for="(i,index) in lockScreenTime" :key="index" @click="edit(i,index)">{{i.startTime}}-{{i.endTime}}</span>
                       </div>
                    </div>
                </div>
                <section class="conserve-btn" @click="save">保存</section>
            </van-tab>
        </van-tabs>
        <div class="van-overlay lockTime" v-if="isLockTime">
            <div class="warp-lock">
                <div class="lockTimeSet">
                    <!-- <van-icon name="delete" class="delete" @click="deleteItem()"/> -->
                    <p>
                        <span @click="next('下一步',starTime)" :class="text == '下一步' ? 'active' : ''">{{starTime}}</span><b>至</b><span :class="text == '确定' ? 'active' : ''" @click="next('确定',endTime)">{{endTime}}</span>
                    </p>
                    <van-datetime-picker
                        v-model="currentTime"
                        type="time"
                        title="选择时间"
                        :min-hour="0"
                        :max-hour="23"
                        :show-toolbar="false"
                        :visible-item-count = '3'
                        @change = "onChange"
                        :filter="filter"
                    />
                    <div class="botton-cancel">
                        <button class="cancel-left" @click="isLockTime = false">取消</button>
                        <button v-if="text == '下一步'" @click="next('确定',endTime)">下一步</button>
                        <button @click="confirmLockTime('edit')" v-else>确定</button>
                    </div>
                </div>
            </div>
        </div>
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
                lockIndex:null,
                starTime:'',
                endTime:'',
                isLockTime:false,
                text:'下一步',
                currentTime: null,
                lockScreenTime:[],
                active:0,
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
                topLists:[
                  {
                      text:'0',
                      isFlag:false
                  },{
                      text:'1',
                      isFlag:false
                  },{
                      text:'2',
                      isFlag:false
                  },{
                      text:'3',
                      isFlag:false
                  },{
                      text:'4',
                      isFlag:false
                  },{
                      text:'5',
                      isFlag:false
                  },{
                      text:'6',
                      isFlag:false
                  },{
                      text:'7',
                      isFlag:false
                  },{
                      text:'8',
                      isFlag:false
                  },{
                      text:'9',
                      isFlag:false
                  },{
                      text:'10',
                      isFlag:false
                  },{
                      text:'11',
                      isFlag:false
                  },{
                      text:'12',
                      isFlag:false
                  },{
                      text:'13',
                      isFlag:false
                  },{
                      text:'14',
                      isFlag:false
                  },{
                      text:'15',
                      isFlag:false
                  },{
                      text:'16',
                      isFlag:false
                  },{
                      text:'17',
                      isFlag:false
                  },{
                      text:'18',
                      isFlag:false
                  },{
                      text:'19',
                      isFlag:false
                  },{
                      text:'20',
                      isFlag:false
                  },{
                      text:'21',
                      isFlag:false
                  },{
                      text:'22',
                      isFlag:false
                  },{
                      text:'23',
                      isFlag:false
                  }
                ],
                topNum:[],
                sunday:[
                  {
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
                  }
                ],
                sundayCutton:'日',
                currentFreeTime:[], // 自由时间段 list
                guardTimeArr:[], // 周一到周日的 锁屏时间 list
                sunValue : 'sun',
                id:'',
                flags : this.$route.query.flag,
                flagList:[],
                dataItem:{},
                chooseTimes: []
            };
        },
        mounted() {
            // if(this.flags == 2){  //自动锁屏
            //     this.getGuardTime();
            // }else{   //限制时间
            //     this.getMSG();
            // }
            this.getGuardTime();
        },
        methods: {
            //去掉0
            cutNum(num){
                let num_cn = num.substr(0,1) > 0 ? num.substr(0,2) :num.substr(1,1)
                return num_cn;
            },
            deleteItem(){
                this.confirmLockTime('delete')
                //this.lockScreenTime.splice(this.lockIndex,1)
            },
            mod(items){  //修改时间段
              console.log(items)
                // if(items.isFlag && (!items.time || items.time == '00')){
                //     console.log(343434)
                //     let dataTime = []
                //     let start = ''
                //     let end = ''
                //     let big = []
                //     this.lockScreenTime.forEach((o,index)=>{
                //         let newData = []
                //         start = o.startTime.substr(0,1) > 0 ? o.startTime.substr(0,2) :o.startTime.substr(1,1);
                //         end = o.endTime.substr(0,1) > 0 ? o.endTime.substr(0,2) : o.endTime.substr(1,1)
                //         for(var j=parseInt(start);j<parseInt(end);j++){
                //             newData.push(j)
                //         }
                //         big.push(newData)
                //     })
                //     big.forEach((p,index)=>{
                //         if(p.includes(items.text)){
                //             console.log(this.lockScreenTime[index])
                //             //console.log(this.lockScreenTime[index])
                //             //this.edit(this.lockScreenTime[index],index)
                //         }
                //     })
                //    return;
                // }

                items.isFlag = !items.isFlag;

                // if(items.isFlag && items.time){
                //     delete items.time
                // }
                // if(!items.isFlag && items.time){
                //     delete items.time
                //     items.isFlag = true;
                // }
                if(items.time && items.time!='00'){
                    delete items.time
                    items.isFlag = true;
                }
                items.flagArr.length = 0;
                items.time = '00'

                let newArrs = [] // 选择的小时List
                let timeL = []
                this.topLists.forEach((i)=>{
                    if(i.isFlag){
                        newArrs.push(i.text)
                    }
                })
                // let setList = this.topLists.filter((item) => {
                //     return (!item.isFlag && item.time) || item.isFlag
                // });


                // setList.forEach((item)=>{
                //     if(item.time && item.time!='00'){
                //         timeL.push(item.text < 10 ? '0'+item.text+':'+item.time : item.text + ':'+item.time)
                //     }
                // })
                // timeL = [...new Set(timeL)]
                let ItemObj = {
                  startTime:this.fill(parseInt(items.text)) + ':00',
                  endTime:this.fill(parseInt(items.text)+1) + ':00'
                }
                this.lockScreenTime.push(ItemObj)

                this.lockScreenTime.forEach((o,index)=>{
                  if(!items.isFlag){
                    if(o.startTime == ItemObj.startTime && o.endTime == ItemObj.endTime){
                      this.lockScreenTime.splice(index,1)
                    }
                  }
                })
                this.lockScreenTime.forEach((o,index)=>{
                  timeL.push(o.startTime)
                  timeL.push(o.endTime)
                })
                // console.log(this.lockScreenTime)
                // console.log(timeL)
                timeL = [...new Set(timeL)]
                this.modify(newArrs,timeL)

            },
            filter(type, options) { //过滤分钟段
                if (type === 'minute') {
                    return options.filter((option) => option % 5 === 0);
                }
                return options;
            },
            edit(item,ind){  //修改锁屏时段
                this.text = "下一步";
                this.starTime = item.startTime;
                this.currentTime = this.starTime;
                this.endTime = item.endTime;
                this.isLockTime = true;
                this.lockIndex = ind;
                this.dataItem = item;
            },
            onChange(){ //修改分钟
                if(this.text == "下一步"){
                    this.starTime = this.currentTime;
                }else{
                    this.endTime = this.currentTime;
                }
            },
            confirmLockTime(flags){ //确定
                if(this.starTime > this.endTime){
                    this.$toast('开始时间不能大于结束时间')
                    return;
                }
                Array.prototype.MySortLock = function() {
                    return this.sort((a, b) => a - b)  //箭头函数不加大括号时指向这个函数的返回值，可以不写return关键字
                }
                let startValueLock = '';
                let endValueLock = '';
                let freeTimeArrLock = [];
                let t = []
                this.lockScreenTime.splice(this.lockIndex,1)  //删除当前的时段
                if(flags == 'edit'){
                    this.lockScreenTime.splice(this.lockIndex,0,{'startTime':this.starTime,'endTime':this.endTime}) //修改赋值锁屏时间
                }

                this.lockScreenTime.forEach((i)=>{
                    startValueLock = i.startTime.substr(0,1) > 0 ? i.startTime.substr(0,2) :i.startTime.substr(1,1);
                    endValueLock = i.endTime.substr(0,1) > 0 ? i.endTime.substr(0,2) : i.endTime.substr(1,1)
                    if(parseInt(startValueLock) == parseInt(endValueLock)){
                        freeTimeArrLock.push(startValueLock.toString())
                    }else{
                        for(var j=parseInt(startValueLock);j<parseInt(endValueLock);j++){
                            freeTimeArrLock.push(j.toString())
                        }
                    }

                    t.push(i.startTime)
                    t.push(i.endTime)
                })
                freeTimeArrLock = Array.from(new Set(freeTimeArrLock)) //选中的数据
                //this.topLists =  this.selectTime(freeTimeArrLock,t);
                this.modify(freeTimeArrLock.MySortLock(),t)
                this.topLists = [...this.selectTime(freeTimeArrLock,this.flagList)]
                this.isLockTime = false;
            },
            next(txt,time){
                this.text = txt;
                this.currentTime = time;
            },
            //修改的时候（重点在这里）修改
            modify(value,timeL){
                Array.prototype.MySort = function() {
                    return this.sort((a, b) => a - b)  //箭头函数不加大括号时指向这个函数的返回值，可以不写return关键字
                }
                let temporaryNum=['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
                console.log(this.guardTimeArr)

              // dayCutton: (...)
              // lockScreenTime: []
              // sunTemporary: (...)
              // sunday: "tues"
              // topLists: (...)
              // tues: Array(1) // 每天对应的锁屏时间list
                    this.guardTimeArr.forEach((item,indexL)=>{
                        if(this.sunValue == item.sunday){ // 匹配 当前设置的星期
                            if(value.length == 0){  //全是自由时间的情况
                                this.guardTimeArr[indexL][this.sunValue].length = 0;
                                this.guardTimeArr[indexL][this.sunValue].push({
                                    startTime:'00:00',
                                    endTime:'24:00'
                                })
                                this.currentFreeTime.length = 0;
                                this.currentFreeTime.push({
                                    startTime:'00:00',
                                    endTime:'24:00'
                                })
                                this.lockScreenTime = []
                            }else{
                                var newArrList = []
                                item.sunTemporary = value;
                                item.sunTemporary.forEach((h,ind)=>{
                                    if(newArrList.indexOf(item.sunTemporary[ind]) === -1) {
                                        newArrList.push(item.sunTemporary[ind].toString());
                                    }

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
                                                    startTime:'00:00',
                                                    endTime:'00:00'
                                                })
                                            }else{
                                                this.guardTimeArr[indexL][this.sunValue] = [...this.publicFun(temporaryNum,timeL,'1')];
                                                this.guardTimeArr[indexL].lockScreenTime = [...this.publicFun(newArrList.MySort(),timeL)];
                                                this.currentFreeTime = [...this.guardTimeArr[indexL][this.sunValue]];
                                                this.lockScreenTime = [...this.guardTimeArr[indexL].lockScreenTime]
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
                this.guardTimeArr.forEach((i,index)=>{
                    if(value==i.sunday){
                        this.publicTime(i[i.sunday],index)
                    }
                })
            },
            publicFun(temporaryNum,array,flag){
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
                let arr = [];
                let filtArr = []
                let start = ''
                let end = '';
                let arr3 = []
                bigArr.forEach((items)=>{
                    start = items[0]<10?'0'+items[0]+':'+"00":items[0]+':'+"00";
                    end = (parseInt(items[items.length-1])+1) < 10 ? '0'+(parseInt(items[items.length-1])+1)+':'+"00":(parseInt(items[items.length-1])+1)+':'+"00"
                    arr3.push({
                        startTime:start,
                        endTime:end
                    })
                    filtArr.push(start)
                    filtArr.push(end)
                })
                array.forEach((k,ind) => {
                  filtArr.forEach((j,index)=>{
                    if(k.split(':')[0] == j.split(':')[0]){
                      filtArr.splice(index,1,k)
                    }
                  })
                })
                arr3.forEach((i)=>{
                    let arrK = ''
                    if(flag !=1){
                        arrK = i.startTime.substr(0,1) > 0 ? i.startTime.substr(0,2) :i.startTime.substr(1,1)
                    }else{
                        arrK = i.endTime.substr(0,1) > 0 ? i.endTime.substr(0,2) :i.endTime.substr(1,1)
                        array.forEach((o)=>{
                            if(o == '00:'+o.split(':')[1] && o != '00:00'){
                               filtArr.push(o)
                               filtArr.push('00:00')
                            }
                        })
                    }
                    this.topLists.forEach((k)=>{
                        if((parseInt(arrK)+1) == k.text && (k.time && k.time!='00') && k.isFlag){
                            if(k.text < 10){
                               filtArr.push('0'+k.text+':'+k.time)
                               filtArr.push('0'+k.text+':00')
                            }else{
                                filtArr.push(k.text+':'+k.time)
                                filtArr.push(k.text+':00')
                            }
                        }
                    })
                })
                if(flag != "查询"){
                let removeArr = []
                filtArr.filter((item)=>{
                    array.every((item1)=> {
                        if(item != item1){
                            if(item1 != '00:00'){
                                if(item1.split(':')[1]=='00'){
                                    filtArr.push(item1)
                                    if(filtArr.includes(this.fill(parseInt(this.cutNum(item1))+1)+':00')){
                                        removeArr.push(this.fill(parseInt(this.cutNum(item1))+1)+':00')
                                    }
                                    if(filtArr.includes(this.fill(parseInt(this.cutNum(item1))-1)+':00')){
                                       // console.log(item1)
                                        removeArr.push(item1)
                                    }
                                    //console.log(this.fill(parseInt(this.cutNum(item1))+1)+':00')
                                }
                            }
                            // console.log(item1.split(':')[0]!='00')
                            if(item1.split(':')[1]!='00'){
                                // console.log(item1)
                                filtArr.push(item1)
                                removeArr.push(this.fill(parseInt(this.cutNum(item1))+1)+':00')
                                // console.log(this.fill(parseInt(this.cutNum(item1))+2)+':00')
                                // console.log(filtArr.includes(this.fill(parseInt(this.cutNum(item1))+2)+':00'))
                                if(filtArr.includes(this.fill(parseInt(this.cutNum(item1))+2)+':00')){
                                    filtArr.push(this.fill(parseInt(this.cutNum(item1))+1)+':00')
                                    removeArr = [...new Set(removeArr)]
                                    removeArr.splice(removeArr.findIndex(item => item == this.fill(parseInt(this.cutNum(item1))+1)+':00'),1)
                                }

                            }

                        }
                    })
                });
                filtArr = [...new Set(filtArr)]
                removeArr = [...new Set(removeArr)]
                filtArr.forEach((i,index)=>{
                    removeArr.forEach((k)=>{
                        if(i == k){
                            filtArr.splice(index,1)
                        }
                    })
                })
                }


                filtArr = [...new Set(filtArr)]

                filtArr.sort(function(a, b) {
                    return b < a ? 1 : -1
                })
                //console.log(filtArr)
                //this.topLists =  this.selectTime(temporaryNum,filtArr);
               // console.log(this.topLists)
                let arr1=[]
                let obj = {}
                for (var i = 0; i< filtArr.length; i++) {
                    if (i % 2 !== 0) {
                        obj.endTime = filtArr[i]
                    } else {
                        obj.startTime = filtArr[i]
                    }

                    if (i % 2 !== 0 && i !== 0){
                        arr.push(obj)
                        obj = {}
                    }
                }
                // console.log(array)
                // console.log(filtArr)

                this.flagList = filtArr
                return arr;
            },
            fill(num_c){
                let num_cns = num_c < 10 ? '0'+num_c : num_c
                return num_cns
            },
            //公共函数（默认数据）查询
            publicTime(oneDay,indexs){
                let startValue = '';
                let endValue = '';
                let freeTimeArr = [];  //自由时间的选中状态
                //let freeTimeShow = [];  //自由时间的展示
                let lockTimeShow = []
                let topL = [];

                let timeList = []; //自由时间的时间段如 05：10
                this.guardTimeArr[indexs].sunTemporary = []
                oneDay.forEach((i)=>{
                    startValue = i.startTime.substr(0,1) > 0 ? i.startTime.substr(0,2) :i.startTime.substr(1,1);
                    endValue = i.endTime.substr(0,1) > 0 ? i.endTime.substr(0,2) : i.endTime.substr(1,1)
                    for(let j=parseInt(startValue);j<parseInt(endValue);j++){
                       freeTimeArr.push(j.toString())
                    }
                    timeList.push(i.startTime)
                    timeList.push(i.endTime)
                })

                for(let g=0; g<=23; g++){
                    this.guardTimeArr[indexs].sunTemporary.push(g.toString())
                }

                // 首先用ES6的set给数组去重：
                let set1 = new Set(freeTimeArr);
                let set2 = new Set(this.guardTimeArr[indexs].sunTemporary);
                let newArr1 = [...set1].filter((item) => {
                    return !set2.has(item);
                });
                let newArr2 = [...set2].filter(item => {
                    return !set1.has(item);
                });

                topL = [...newArr1,...newArr2];   // 再将得到的两个新数组合并，就能得到差集了
                this.topLists = this.selectTime(topL,timeList);  //上面展示的数据
                this.currentFreeTime = oneDay; //自由时间的展示

                this.lockScreenTime = this.publicFun(topL,timeList,'查询'); //锁屏时间
            },
            //
            selectTime(arrList,selectedList){
                let dataOrgin = []
                for(let i = 0; i<=23; i++){  //重置数据
                    dataOrgin.push({
                        text:i,
                        isFlag:false,
                        flagArr:[]
                    })
                }
                arrList.filter((l)=>{    //设置选中
                    dataOrgin.find((p)=>{
                        if(l == p.text){
                            p.isFlag = true;
                        }
                    })
                })
                let objTemp = {}

                selectedList.forEach((o)=>{
                    dataOrgin.forEach((p)=>{
                        if((o.substr(0,1) > 0 ? o.substr(0,2) :o.substr(1,1)) == p.text){   //分钟控制
                            p.flagArr.push(o.split(':')[1] == '05' ? '5' : o.split(':')[1])
                            p.time = o.split(':')[1]
                        }
                    })
                })
                return dataOrgin
            },
            //获取守护时间
            getGuardTime(){
                // this.axios.get('/screen/time/rule/parent', {
                //     params: {
                //         childrenId: this.childrenId
                //     },
                //     server: 'desktop'
                // }).then(res => {


                // })


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
                        let day =  new Date().getDay()
                        this.guardTimeArr.forEach((j,indexD)=>{
                            if(day==indexD){
                                this.publicTime(this.guardTimeArr[indexD][j.sunday],indexD); //当前的数据
                                //console.log(this.guardTimeArr[indexD][j.sunday])
                                this.sunValue = j.sunday; //当前的value值
                                this.sundayCutton = j.dayCutton;
                            }
                        })
                        //默认周日
                        //this.publicTime(this.guardTimeArr[0].sun,0)
                        //console.log(this.guardTimeArr)

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
                console.log(guardData)
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
<style lang="less">
    .timemanagementnew{
        font-size: 0.3rem;
        .lockTime{
            .warp-lock{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                .lockTimeSet{
                    text-align: center;
                    width: 5.6rem;
                    border-radius: .2rem;
                    background: #fff;
                    .delete{
                        font-size: 0.4rem;
                        padding-top: 0.4rem;
                    }
                    p{
                        text-align: center;
                        padding: 0.7rem 0.4rem;
                        span{
                            background: #e4eaff;
                            color: #4768f3;
                            display: inline-block;
                            width: 1.7rem;
                            height: 0.6rem;
                            text-align: center;
                            line-height: 0.6rem;
                            font-size: 0.26rem;
                            border-radius: 0.07rem;
                       }
                       .active{
                           background: #4768f3;
                           color: #fff;
                       }
                       b{
                           padding: 0 0.32rem;
                           font-weight: 400;
                       }
                    }
                }
            }
        }
    }
    /* 2019/1/17守护时间 */
    .timemanagementnew .guardTime{
        margin: 0.24rem;
        border-radius: 0.2rem;
    }
    .timemanagementnew .sunday{
        height: 0.77rem;
        background: #4768f3;
    }
    .timemanagementnew .freeTimeLegend{
        height:1rem;
        background: #fff;
        padding:0 0.26rem;
    }
    .timemanagementnew .apps-tip{
        width: 6.72rem;
        margin: 0.2rem auto 0.15rem;
        font-size: 0.22rem;
        line-height: 0.32rem;
        color: #666;
        letter-spacing: 0.01rem;
    }
    /* .timemanagementnew .freeTimeLegend:before{
        content:"";
        border:10px solid transparent;
        position:absolute;
        left:16px;
        top:0;
        margin-top:-20px;
    }
    .timemanagementnew .freeTimeLegend:after{
        content:"";
        border:10px solid transparent;
        border-bottom-color:white;
        position: absolute;
        top:0;
        left:16px;
        margin-top:-19px;
    } */
    .timemanagementnew .freeTimeLegend .sundayFreeTime{
        float: left;
        line-height: 1rem;
    }
    .timemanagementnew .freeTimeLegend .sundayFreeTime-right{
        float: right;
        line-height: 1rem;
    }
    .timemanagementnew .freeTimeLegend .sundayFreeTime-right b{
        display: inline-block;
        width:0.22rem;
        height:0.22rem;
        background: #6e98ef;
        vertical-align: middle;
    }
    .timemanagementnew .freeTimeLegend .sundayFreeTime-right span{
        display: inline-block;
        color: #999;
        font-size: 0.27rem;
    }
    .timemanagementnew .guardTime .dateList{
        height:3.25rem;
        background: #fff;
        border-top:0.01rem solid #dcdcdc;
        border-bottom: 0.01rem solid #dcdcdc;
    }
    .timemanagementnew .guardTime .dateList .morning{
        display: flex;
        height:3.25rem;
        /*border-bottom: 0.01rem solid #dcdcdc;*/
    }
    .timemanagementnew .guardTime .dateList .morning .morning-left{
        width: 3.8rem;
        line-height: 0.8rem;
        text-align: center;
        border-right: 0.01rem solid #dcdcdc;
    }
    .timemanagementnew .guardTime .dateList .morning .morning-right{
        display: flex;
        flex-wrap:wrap;
        span{
            display: inline-block;
            height:0.8rem;
            width: 0.93rem;
            text-align: center;
            line-height: 0.8rem;
            background: #6e98ef;
            color: #fff;
            border-right: 0.01rem solid #dcdcdc;
            border-bottom: 0.01rem solid #dcdcdc;
            position: relative;
        }
        b{
            display: inline-block;
            position: absolute;
            height: 0.8rem;
            background: #6e98ef;
            left:0;
        }
        i{
            width: 100%;
            position: absolute;
            font-style:normal;
            display: inline-block;
            left:0;
        }
        .flag{
            background: rgb(246, 140, 152);
        }
    }
    .timemanagementnew .guardTime .dateList .morning .morning-right .van-checkbox{
        position: relative;
        height:0.8rem;
        float: left;
    }
    .timemanagementnew .guardTime .dateList .morning .morning-right .van-checkbox .van-checkbox__label{
        position: absolute;
        top:0.2rem;
        left:0.15rem;
    }
    .timemanagementnew .guardTime .dateList .morning .morning-right .van-checkbox .van-checkbox__icon{
        width:0.94rem;
        height:0.8rem;
        background: #6e98ef;
        border-color:#6e98ef;
    }
    .timemanagementnew .guardTime .dateList .morning .morning-right .van-checkbox .van-checkbox__icon .van-icon{
        width:0.94rem;
        height:0.8rem;
        border-radius:0;
    }
    .timemanagementnew .guardTime .dateList .morning .morning-right .van-checkbox .van-checkbox__icon .van-icon-success:before{
        display: none;
    }
    .timemanagementnew .guardTime .dateList .morning .morning-right .van-checkbox .van-checkbox__icon--checked .van-icon{
        background: #f68c98;
        border-color:none;
        border: 1px solid #e5e5e5;
        cursor: pointer;
    }
    .timemanagementnew .sunday .sundaySpan{
        display: inline-block;
        color: #fff;
        font-size: 0.32rem;
        line-height: 0.77rem;
        width: 14%;
        text-align: center;
        position: relative;
    }
    .timemanagementnew .sunday .sundaySpan .triangle{
        position: absolute;
        top:0.41rem;
        left:0.29rem;
        width: 0;
        height: 0;
        border-width: 0.18rem;
        border-style: solid;
        border-color:  transparent transparent #fff transparent;
    }
    .timemanagementnew .guardTime{
        .lock{
            .timelist{
                span{
                    background: #e4eaff;
                    color: #4768f3;
                    padding: 0.15rem;
                    margin-right: 0.12rem;
                    line-height: 0.3rem;
                    margin-top: 0.12rem;
                }

            }

        }
    }
    .timemanagementnew .guardTime .timeSlot{
        /* height:1rem; */
        background: #fff;
        line-height: 0.43rem;
        padding: 0 0.16rem 0.1rem;
        overflow: hidden;
    }
    .timemanagementnew .guardTime .timeSlot .timelist{
        width:80%;
    }
    .timemanagementnew .guardTime .timeSlot p{
        font-size: 0.22rem;
        line-height: 0.68rem;
    }
    .timemanagementnew .guardTime .timeSlot span{
        display: inline-block;
        color: #a3a3a3;
        font-size: 0.24rem;
        padding-right: 0.25rem;
    }
    .timemanagementnew .conserve-btn{
        height: 0.96rem;
        line-height: 0.96rem;
        margin: 0.44rem;
        border-radius: 0.1rem;
        background: #4768f3;
        font-size: 0.32rem;
        color: #fff;
        text-align: center;
    }
    .timemanagementnew {
        /*background: #f5f6f8;*/
        /*height: 11.98rem;*/
        /*padding-bottom: 0.15rem;*/
    }
    .timemanagementnew .freetime,
    .duration {
        position: relative;
        margin: 0.24rem;
        border-radius: 0.2rem;
        background: #fff;
    }
    .timemanagementnew .limitapps {
        padding: 0.24rem 0 0.1rem;
    }
    .timemanagementnew .limitapps h2 {
        text-align: center;
        font-weight: 400;
        line-height: 1.5rem;
    }
    .timemanagementnew .head_border {
        display: block;
        width: 0.07rem;
        height: 0.28rem;
        background: #4768f3;
        position: absolute;
        top: 0.3rem;
        left: 0;
    }
    .timemanagementnew .freetime .time_title {
        display: flex;
        align-items: center;
        padding-left: 0.23rem;
        height: 0.9rem;
        border-bottom: 1px solid #f1f1f1;
        font-size: 0.28rem;
        color: #333333;
    }
    .timemanagementnew .duration .time_title {
        display: flex;
        align-items: center;
        padding-left: 0.23rem;
        height: 0.9rem;
        border-bottom: 1px solid #f1f1f1;
        font-size: 0.28rem;
        color: #333333;
    }
    .timemanagementnew ul li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0.3rem 0 0.3rem;
        height: 1.25rem;
        border-bottom: 1px solid #f1f1f1;
    }
    .timemanagementnew ul li img {
        width: 0.19rem;
        height: 0.28rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0.2rem;
    }
    .timemanagementnew ul li div div:nth-of-type(1) {
        font-size: 0.23rem;
        color: #323232;
    }
    .timemanagementnew ul li div div:nth-of-type(2) {
        font-size: 0.23rem;
        color: #9c9c9c;
    }
    .timemanagementnew .freetime .add_time {
        text-align: center;
        font-size: 0.26rem;
        color: #646464;
        height: 0.9rem;
        line-height: 0.9rem;
    }
    .timemanagementnew .cover {
        /* width: 100%;
        height: 100%; */
        background: rgba(0, 0, 0, 0.3);
        /* position: absolute;
        top: 0;
        left: 0;
        display: none; */
    }
    .timemanagementnew .cover .warp{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .timemanagementnew .botton-cancel{
        line-height: 1rem;
        display: flex;
    }
    .timemanagementnew .botton-cancel button{
        width: 49%;
        border-left:0.01rem solid #f1f1f1;
        color: #4768f3;
    }
    .timemanagementnew .botton-cancel .cancel-left{
        color: #000;
        border-left:none;
    }
    .timemanagementnew .cover_title {
        width: 6rem;
        /* height: 4.3rem; */
        border-radius: 0.2rem;
        background: #fff;
    }
    .timemanagementnew .cover_title p {
        width: 100%;
        height: 1.1rem;
        text-align: center;
        line-height: 1.1rem;
        color: #333333;
        font-size: 0.3rem;
    }
    .timemanagementnew .van-picker {
        width: 100%;
        /* height: 3.4rem; */
        position: relative;
        border-bottom-left-radius: 0.2rem;
        border-bottom-right-radius: 0.2rem;
    }
    .timemanagementnew .van-picker__columns {
        width: 100%;
        /* height: 3.4rem !important; */
        border-bottom: 1px solid #f1f1f1;
        padding-bottom: 0.3rem;
    }
    .timemanagementnew .van-picker-column {
        width: 100%;
        padding-left: 0.5rem;
    }
    .timemanagementnew .van-picker .van-picker-column__item {
        font-size: 0.4rem;
        color: #4768f3;
        border: 0;
    }
    .timemanagementnew .van-picker .van-picker-column__item--selected {
        font-size: 0.73rem;
        color: #4768f3;
        border: 0;
    }
    .timemanagementnew .van-picker__toolbar {
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
    .timemanagementnew .van-picker__toolbar .van-picker__cancel {
        margin-left: 1.15rem;
        color: #666666;
        font-size: 0.28rem;
    }
    .timemanagementnew .van-picker__toolbar .van-picker__confirm {
        margin-right: 1.15rem;
        font-size: 0.28rem;
        color: #4768f3;
    }
    .timemanagementnew .van-picker__frame {
        position: absolute;
        top: 1.25rem;
        left: 0;
    }
    .timemanagementnew .van-cell {
        border: none !important;
        padding: 0 0.24rem !important;
    }
    .timemanagementnew [class*="van-hairline"]::after {
        border: none !important;
    }
    .timemanagementnew .van-cell:not(:last-child)::after {
        border: none !important;
    }
    /* tab样式 */
    .timemanagementnew .van-tabs--line .van-tabs__wrap {
        width: 100%;
        height: 0.96rem;
        display: none;
    }

    .timemanagementnew .van-tabs--line .van-tabs__wrap .van-tabs__line {
        /*width: 2.24rem !important;*/
        height: 0.04rem;
        background-color: #4768f3;
        /*margin-left: -0.2rem;*/
        /* transform: translateX(0)!important; */
    }
    .timemanagementnew .van-tabs--line .van-tabs__wrap .van-tab {
        color: #b4b4b4;
        font-size: 0.28rem;
        line-height: 0.92rem;
        padding: 0;
    }
    .timemanagementnew .van-tabs--line .van-tabs__wrap .van-tab--active {
        color: #000;
    }
</style>
