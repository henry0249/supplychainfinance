(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[71],{FwzO:function(e,o,t){e.exports={wrap:"wrap___6SVI5"}},"lS/k":function(e,o,t){"use strict";(function(e){var l=t("g09b"),a=t("tAuX");Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=void 0,t("miYZ");var i,n,s=l(t("tsqr")),r=l(t("2Taf")),c=l(t("vZ4D")),p=l(t("l4Ni")),u=l(t("ujKo")),f=l(t("MhPg")),d=a(t("q1tI")),g=(l(t("17x9")),t("Hg0r")),h=t("dtw8"),b=t("7Qib"),k=t("Kvkj"),y=l(t("FwzO")),v=l(t("3a4m")),m=(i=(0,g.connect)(function(o){var t=o.global,l=t.role,a=t.roleList;return{global:e,role:l,roleList:a}}),i(n=(0,h.withRouter)(n=function(e){function o(){return(0,r["default"])(this,o),(0,p["default"])(this,(0,u["default"])(o).apply(this,arguments))}return(0,f["default"])(o,e),(0,c["default"])(o,[{key:"componentDidMount",value:function(){var e=this,o=this.props,t=o.dispatch,l=o.global;if(b.utils.getUrlParam("sysToken")&&"null"!==b.utils.getUrlParam("sysToken")&&l&&!l.login){var a=b.utils.getUrlParam("sysToken");t({type:"global/login",payload:{sysToken:a},callback:function(o){t({type:"global/getRoleList",payload:{},callback:function(o,t){o&&e.pickRole(t,function(){e.go()})}})}})}else localStorage.financeToken?t({type:"global/getUserInfo",payload:{financeToken:localStorage.financeToken},callback:function(e){t({type:"global/getRoleList",payload:{}})}}):(localStorage.clear(),s["default"].info("\u767b\u5f55\u4fe1\u606f\u9a8c\u8bc1\u5931\u8d25\uff0c\u8bf7\u5148\u767b\u5f55\uff01"),setTimeout(function(){window.location.href="".concat(b.baseUrls.beesrvUrls,"/perLogin")},2e3))}},{key:"pickRole",value:function(e,o){var t=this.props.dispatch;t({type:"global/pickRole",payload:e,callback:function(){o&&o()}})}},{key:"go",value:function(){this.props.roleList&&this.props.roleList.length?this.props.role.permissionId?this.props.dispatch({type:"global/getMenus",payload:{},callback:function(e){e&&e.length>0?v["default"].push(e[0].path||"/home"):v["default"].push("/home")}}):s["default"].info("\u8bf7\u5148\u9009\u62e9\u89d2\u8272!"):window.location.href="".concat(b.baseUrls.beesrvUrls,"/perLogin")}},{key:"render",value:function(){var e=this.props,o=e.role,t=void 0===o?{}:o,l=e.roleList,a=void 0===l?[]:l;return d["default"].createElement("div",{className:y["default"].wrap},d["default"].createElement(k.ChangeAuthority,{permissionId:t.permissionId,permissionList:a,pickRole:this.pickRole.bind(this),go:this.go.bind(this)}))}}]),o}(d.Component))||n)||n);o["default"]=m}).call(this,t("yLpj"))}}]);