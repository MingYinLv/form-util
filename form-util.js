(function (root) {
    function formUtil() {
        //表单验证
        var validate = {
            'mobile': /^1[3|4|5|7|8]\d{9}$/,
            'realName': '',
            'null': function (value) {
                if (trim(value).length === 0) {
                    return false;
                }
                return true;
            },
            'email': /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            'IDCard': function (idCard) {
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
                            if (idCardLast == 'X' || idCardLast == 'x') {

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
            'bankID': /^(\d{16}|\d{19})$/,
            'password': /^[\da-zA-Z]{6,18}$/,
            'verify': function (rule, value, callback) {
                var _ = this, _verifyResult = false;
                if (typeof _[rule] === 'object' && _[rule].test) {
                    _verifyResult = _[rule].test(value);
                } else if (typeof _[rule] === 'function') {
                    _verifyResult = _[rule]();
                }
                typeof callback === 'function' && callback(_verifyResult);
                return _verifyResult;
            }
        };
        //去除空格
        var trim = function (value) {
            return value.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
        };
        //获得form中带有name属性得表单
        var getAllName = function (formDom) {
            var _arr = [];
            _arr = _arr.concat(Array.prototype.slice.apply(formDom.getElementsByTagName('input')));
            _arr = _arr.concat(Array.prototype.slice.apply(formDom.getElementsByTagName('select')));
            _arr = _arr.concat(Array.prototype.slice.apply(formDom.getElementsByTagName('textarea')));
            return _arr;
        };

        /**
         * 将form转换为JSON对象
         * @param formDom form的dom对象
         */
        var formToJSON = function (formDom) {
            var _arr = getAllName(formDom), _obj = {}, _name, _temp, _value;
            for (var i = 0, len = _arr.length; i < len; i++) {
                _temp = _arr[i];
                _name = _temp.name;
                _value = _temp.value;
                if (_name && !_obj[_name]) {
                    if (_temp.checked || (_temp.getAttribute('type') !== 'checkbox' && _temp.getAttribute('type') !== 'radio')) {
                        _obj[_name] = _value;
                    }
                } else if (_name) {
                    if (_temp.checked || (_temp.getAttribute('type') !== 'checkbox' && _temp.getAttribute('type') !== 'radio')) {
                        if (typeof _obj[_name] === 'string') {
                            _obj[_name] = [_obj[_name]];
                        }
                        _obj[_name].push(_value);
                    }
                }
            }
            return _obj;
        };
        /**
         * 将form转换为参数格式(name=xx&&pass=xxx)
         * @param formDom
         */
        var formToQuery = function (formDom) {
            var _arr = getAllName(formDom), _name, _temp, _value, _str = '';
            for (var i = 0, len = _arr.length; i < len; i++) {
                _temp = _arr[i];
                _name = _temp.name;
                _value = _temp.value;
                if (_name && (_temp.checked || (_temp.getAttribute('type') !== 'checkbox' && _temp.getAttribute('type') !== 'radio'))) {
                    _str += _name + "=" + _value + "&"
                }
            }
            if (len > 0) {
                _str = _str.substr(0, _str.length - 1);
            }
            return _str;
        };
        return {
            /**
             *
             * @param rule 验证规则
             * @param value 验证值
             * @param callback 回调函数
             * @returns Boolean
             */
            'verity': function (rule, value, callback) {
                return validate.verify(rule, value, callback);
            },
            /**
             * 修改（添加）验证规则
             * @param ruleName 名称
             * @param rule 规则
             */
            'modifyVerity': function (ruleName, rule) {
                validate[ruleName] = rule;
            },
            'formToJSON': formToJSON,
            'formToQuery': formToQuery
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
