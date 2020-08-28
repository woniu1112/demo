//将时间戳转换为yy-mm-dd hh:mm:ss
export function dateFormat(time) {
  if(time == '' || time == undefined || time == null) {
    return '';
  }
  if(time < 10000000000)time *= 1000;
	let date = new Date(time);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
}

//将时间戳转换为mm-dd hh:mm
export function dateFormat1(time) {
  if (time == '' || time == undefined || time == null) {
    return '';
  }
  let date = new Date(time);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return MM + '-' + d + ' ' + h + ':' + m;
}

//将时间戳转换为hh:mm
export function dateFormat2(time) {
  if (time == '' || time == undefined || time == null) {
    return '';
  }
  let date = new Date(time);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return h + ':' + m;
}

//将时间戳转换为yy-mm-dd
export function dateFormat3(time) {
  if (time == '' || time == undefined || time == null) {
    return '';
  }
  let date = new Date(time);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return y + '-' + MM + '-' + d;
}

//将时间戳转换为yy-mm-dd hh:mm
export function dateFormat4(time) {
  if(time == '' || time == undefined || time == null) {
    return '';
  }
  if(time < 10000000000)time *= 1000;
	let date = new Date(time);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m;
}

//将毫秒值转化**小时+**分钟+**秒
export function millisecondsFilter(time) {
  if (time == '' || time == undefined || time == null) {
    return '';
  }
  time = time / 1000;
  return time >= 3600 ? Math.floor(time / 3600) + "小时" + Math.floor((time % 3600) / 60) + "分钟" : time / 60 >= 1 ? Math.floor(time / 60) + '分钟' + parseInt(time % 60) + '秒' : Math.ceil(time) + '秒';
}

// 将秒值转换成 **天**小时**分**秒
export function secondToDate(msd) {
	let time;
	if (msd > 60 && msd < 60 * 60) {
		time = (msd % 60) > 29 ? (parseInt(msd / 60) + 1) + '分钟' : parseInt(msd / 60) + '分钟';

	} else if (msd >= 60 * 60 && msd < 60 * 60 * 24) {
		time = (msd % 60) > 29 ?
			parseInt(msd / 3600) + '小时' + (parseInt(msd / 60 % 60) + 1) + '分钟' :
			parseInt(msd / 3600) + '小时' + (parseInt(msd / 60 % 60) ? parseInt(msd / 60 % 60) + '分钟' : '');

	} else if (msd >= 60 * 60 * 24) {
		time = (msd % 60) > 29 ?
			parseInt(msd / 3600 / 24) + '天' + (parseInt(msd / 60 / 60 % 24) ? parseInt(msd / 60 / 60 % 24) + '小时' : '') + (parseInt(msd / 60 % 60) + 1) + '分钟' :
			parseInt(msd / 3600 / 24) + '天' + (parseInt(msd / 60 / 60 % 24) ? parseInt(msd / 60 / 60 % 24) + '小时' : '') + (parseInt(msd / 60 % 60) ? parseInt(msd / 60 % 60) + '分钟' : '');
	} else {
		time = msd == 60 ? '一分钟' : '小于1分钟';
	}
	return time;
}


// 将时间戳转换成 **天**小时**分**秒
export function timeFormat(timestamp) {
  var mistiming = Date.parse(new Date())/1000 - timestamp;
  var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
  var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
  for (var i = 0; i < arrn.length; i++) {
      var inm = Math.floor(mistiming / arrn[i]);
      if (inm != 0) {
          return inm + arrr[i] + '前';
      }
  }
}
