/* eslint-disable */
let _vue = new Vue();
export const notNullVali = function(value) {
	if (!value || ('' + value).trim().length <= 0) {
		return false;
	}
	return true;
}

//校验手机号码
export const phoneNumberVali = function(phoneNumber) {
	if (!phoneNumber) {
        _vue.$toast('请输入正确手机号!');
		return false;
	} else {
		phoneNumber = phoneNumber.replace(/(^\s*)|(\s*$)/g, "");
		if (!phoneNumber.match(/^0?1[3|4|5|7|8][0-9]\d{8}$/)) {
            _vue.$toast('手机号码格式有误!');
			return false;
		}
	}
	return true;
};
//校验手机号码
export const valiPhoneNo = function(num) {
    var sureNum = /^[1][0-9]{10}$/;
    if(!sureNum.test(num)){
        _vue.$toast('手机号码格式有误！');
    }
    return sureNum.test(num);
}
//校验验证码
export const valiCode = function(n) {
	if (!n || n == ' '||n.length !=6 ) {
        _vue.$toast('验证码有误！')
		return false;
	}
	return true;
};
//校验电子邮箱
export const emailVali = function(email) {
	if (!email) {
		return false;
	} else {
		email = email.replace(/(^\s*)|(\s*$)/g, "");
		if (!email.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)) {
			return false;
		}
	}
	return true;
};
/**校验ip */
export const ipVali = function(value) {
	var re =
		/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
	return re.test(value);
};

/**校验域名 */
export const domainVali = function(value) {
	var reg = /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
	// var reg=/^([a-zA-Z\d][a-zA-Z\d-_]+\.)+[a-zA-Z\d-_][^ ]*$/;
	return reg.test(value);
};

/*****校验URL*****/
export const urlVali = function(value) {
	var reg = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
	return reg.test(value);
}
export const portVali = function(value) {
	const port = parseInt(value);
	if (port > 0 && port < 65535) {
		return true;
	}
	return false;
};

export const pureNumVali = function(n) {
	if (!n || n == ' ') {
		return false;
	} else {
		n = n.replace(/(^\s*)|(\s*$)/g, "");
		if (!n.match(/^[0-9]*$/)) {
			return false;
		}
	}
	return true;
};
//校验邮编
export const checkPostVali = function(code) {
	if (!code) {
		return false;
	} else {
		if (!code.match(/^[1-9][0-9]{5}$/)) {
			return false;
		}
		return true;
	}
};

//校验密码  密码为6位以及以上数字,英文,符号至少两种组合的字符
export const userPassWordVali = function(value) {
	var reg =
		/^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/;
	return reg.test(value);
};
//校验密码  验证数字，大写字母，小写字母，特殊字符四选三组成的密码强度，且长度在6到30个数之间
export const userPassWordVali2 = function(value) {
	var reg = new RegExp(
		'^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,30}$'
	);
	return reg.test(value);
};

//非数字开头 数字 字母 下划线 中文 组成  昵称校验
export const nickNameVal = function(value) {
	var reg = /^[a-zA-Z_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*$/;
	return reg.test(value)
}
/* eslint-enable */
