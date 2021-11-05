Array.prototype.sum = function (prop) {
    var total = 0
    for (var i = 0, _len = this.length; i < _len; i++) {
        total += parseFloat(this[i][prop])
    }
    return total
}

Array.prototype.average = function (prop) {
    var total = this.sum(prop);
    var len = this.length;
    var avg = total / len
    return avg.toFixed(2);
}
Array.prototype.min = function (prop) {
    if (!this.length) return ''
    return Math.min.apply(null, this.map(function (item) {
        return item[prop];
    }));
}

Array.prototype.max = function (prop) {
    if (!this.length) return ''
    return Math.max.apply(null, this.map(function (item) {
        return item[prop]
    }));
}
String.prototype.trimLeft = function (charlist) {
    if (charlist === undefined)
        charlist = "\s";
    return this.replace(new RegExp("^[" + charlist + "]+"), "");
}
String.prototype.trimRight = function (charlist) {
    if (charlist === undefined)
        charlist = "\s";
    return this.replace(new RegExp("[" + charlist + "]+$"), "");
}

String.prototype.trimChar = function (charlist) {
    if (typeof charlist == 'undefined') {
        charlist = '\\s';
    }
    let pattern = '^[' + charlist + ']*(.*?)[' + charlist + ']*$';
    return this.replace(new RegExp(pattern), '$1')
}


export const utils = {
    percentValue (val, max) {
        let num = parseFloat(val) / parseFloat(max)
        return num.toFixed(2);
    },
    toPercent(val, max) {
        let num = this.percentValue(val, max) * 100;
        return num.toFixed(2);
    },
    getPagePath(path) {
        if(path){
            path = path.trimChar("/");
            let arrPath = path.split("/")
            let page =  arrPath[0];
            return  "/" + page;
        }
        return "/";
    },
    getRoutePath(path) {
        if(path){
            path = path.trimChar("/");
            let arrPath = path.split("/");
            let page =  arrPath[0];
            let action =  arrPath[1];
            if(!action || action == "index"){
                action = "list"
            }
            return  page + "/" + action;
        }
        return "/";
    },
    debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    },
    extend(obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    },
    setApiPath(path, queryObj) {
        if (queryObj) {
            var str = [];
            for (var key in queryObj) {
                var value = queryObj[key]
                if (queryObj.hasOwnProperty(key) && value !== '') {
                    str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
                }
            }
            var qs = str.join("&");
            if (path.indexOf('?') > 0) {
                path = path + '&' + qs;
            }
            else {
                path = path + '?' + qs;
            }
        }
        return this.joinPaths([process.env.API_PATH, path]);
    },
    getImageSize(src, imgSize){ //still available for backward compatibility
        return this.setImgUrl(src, imgSize);
    },
    setImgUrl(src, imgSize){
        if(src){
            let isExternalFile = this.isExternalFile(src);
            if(imgSize && !isExternalFile){
                let paths = src.toString().split('/');
                paths.splice(-1, 0, imgSize);
                src = paths.join('/');
            }
            return this.getFileFullPath(src);
        }
        return require("assets/images/no-image-available.png");
    },
    randomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    randomChars(length, characters) {
        length = length || 10;
        var result = [];
        var characters = characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return result.join('');
    },
    randomStr(length, characters) {
        length = length || 10;
        var result = [];
        var characters = characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return result.join('');
    },
    randomNum(length) {
        length = length || 10;
        return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    },
    //Convert javascript to date object to mysql date format (YYYY-MM-DD HH:mm:ss)
    dateNow() {
        return new Date().toISOString().split('T')[0];
    },
    dateTimeNow() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    },
    timeNow() {
        return new Date().toLocaleTimeString();
    },
    toArray(val) {
        if (val) {
            if (Array.isArray(val)) {
                return val;
            }
            else {
                return val.split(",");
            }
        }
        else {
            return [];
        }
    },
    serializeQuery(params, prefix) {
        const query = Object.keys(params).map((key) => {
            const value = params[key];

            if (params.constructor === Array)
                key = `${prefix}[]`;
            else if (params.constructor === Object)
                key = (prefix ? `${prefix}[${key}]` : key);

            if (typeof value === 'object')
                return this.serializeQuery(value, key);
            else
                return `${key}=${encodeURIComponent(value)}`;
        });

        return [].concat.apply([], query).join('&');
    },
    trim(str, charlist) {
        if (typeof charlist == 'undefined') {
            charlist = '\\s';
        }
        let pattern = '^[' + charlist + ']*(.*?)[' + charlist + ']*$';
        return str.replace(new RegExp(pattern), '$1')
    },
    /**
     * Joins 2 paths together without duplicate separators
     * @param parts the parts of the url to join. eg: ['http://google.com/', '/path/']
     * @returns {string} The combined path
     */
    joinPaths(parts) {
        let separator =  '/';
        return parts.map(function(part) { return part.trim().replace(/(^[\/]*|[\/]*$)/g, ''); }).join(separator);
    },
    getFileFullPath(path) {
        let isFullPath = path.startsWith("https://") || path.startsWith("http://");
        if(isFullPath){
            return path;
        }
        return this.joinPaths([process.env.API_URL,  path]);
    },
    isExternalFile(path) {
        let fullPath = this.getFileFullPath(path);
        let baseUrl = process.env.API_URL; //app base url
        let isLocalFile = fullPath.startsWith(baseUrl);
        return !isLocalFile;
    }
}