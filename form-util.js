(function (root) {
    function formUtil() {
        var util = {
            "mobile": /^1[3|4|5|7|8]\d{9}$/,
            "realName": "",
            "null": function (value) {
                if (this.trim(value).length === 0) {
                    return false;
                }
                return true;
            },
            "trim": function (value) {
                return value.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
            },
            "email": /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            "IDCard": function (idCard) {
                var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                if (regIdCard.test(idCard)) {
                    if (idCard.length == 18) {
                        var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
                        var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                        var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                        for (var i = 0; i < 17; i++) {
                            idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
                        }
                        var idCardMod = idCardWiSum % 11;
                        var idCardLast = idCard.substring(17);
                        if (idCardMod == 2) {
                            if (idCardLast == "X" || idCardLast == "x") {

                                return true;
                            } else {

                                return false;
                            }
                        } else {
                            if (idCardLast == idCardY[idCardMod]) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                } else {
                    return false;
                }
            },
            "bankID": /^(\d{16}|\d{19})$/,
            "password": /^[\da-zA-Z]{6,18}$/,
            "verify": function (pat, value, callback) {
                var _ = this;
                if (typeof _[pat] === "object" && _[pat].test) {
                    return typeof callback === "function" && callback(_[pat].test(value));
                } else if (typeof _[pat] === "function") {
                    return typeof callback === "function" && callback(_[pat]());
                }
            }
        };
        return {
            "verity": function (pat, value, callback) {
                return util.verify(pat, value, callback);
            }
        }
    };


    if (typeof define === 'function' && define.amd) {
        define(formUtil);
    } else if (typeof exports === 'object') {
        module.exports = formUtil();
    } else {
        root.formUtil = formUtil();
    }

})(window);
