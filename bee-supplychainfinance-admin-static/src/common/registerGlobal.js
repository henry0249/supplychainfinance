// const imgPath = `http://cba360.cn/vpayFile`;

//注册全局变量
const regGlobalVars = () => {
    if (window) {
        String.prototype.replaceAll = function (s1, s2) {
            return this.replace(new RegExp(s1, "gm"), s2);
        }

        // Number.prototype.toFixed = function (s1) {
        //     return this.replace(new RegExp(s1, "gm"), s2);
        // }
        // window.jyGlobal = true;
        // window.imgPath = imgPath;
    }
}

export default regGlobalVars;