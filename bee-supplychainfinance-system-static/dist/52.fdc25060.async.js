(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[52],{GFCO:function(e,a,t){e.exports={container:"container___ObTTV",header:"header___1NNQj",back:"back___UfjhN",body:"body___ldZvU",footer:"footer___2TTHE"}},voTp:function(e,a,t){"use strict";var l=t("tAuX"),d=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a["default"]=void 0;var r=l(t("q1tI"));t("14J3");var n=d(t("BMrR"));t("jCWc");var u=d(t("kPKH"));t("5NDa");var o=d(t("5rEg"));t("+L6B");var f=d(t("2/Rp"));t("sPJy");var c=d(t("bE4q"));t("miYZ");var i=d(t("tsqr")),m=d(t("p0pE")),s=d(t("2Taf")),p=d(t("vZ4D")),y=d(t("l4Ni")),v=d(t("ujKo")),E=d(t("MhPg"));t("OaEy");var h=d(t("2fM7"));t("y8nQ");var b,g,_,k=d(t("Vl3Y")),w=d(t("3a4m")),C=d(t("wY1l")),N=d(t("bKel")),q=d(t("GFCO")),I=t("8ocg"),T=k["default"].Item,j=h["default"].Option,B=(b=k["default"].create(),(0,N["default"])(g=b((_=function(e){function a(){var e,t;(0,s["default"])(this,a);for(var l=arguments.length,d=new Array(l),r=0;r<l;r++)d[r]=arguments[r];return t=(0,y["default"])(this,(e=(0,v["default"])(a)).call.apply(e,[this].concat(d))),t.state={},t.handleSave=function(){var e=t.props.form.validateFields,a=t.props.location.query.id;e(function(e,t){if(!e){var l=(0,m["default"])({},t);void 0!==a&&(l["id"]=a),(0,I.saveData)(l).then(function(e){0===e.code?(i["default"].success("\u4fdd\u5b58\u56fd\u4f01/\u592e\u4f01\u6210\u529f\uff01"),w["default"].goBack()):i["default"].error("\u4fdd\u5b58\u56fd\u4f01/\u592e\u4f01\u5931\u8d25:"+e.msg)})}})},t}return(0,E["default"])(a,e),(0,p["default"])(a,[{key:"componentDidMount",value:function(){var e=this.props.location.query.id,a=this.props.form.setFieldsValue;void 0!==e&&(0,I.getDataById)(e).then(function(e){0===e.code?a({companyType:e.data.companyType,companyName:e.data.companyName,companyCode:e.data.companyCode}):i["default"].error("\u67e5\u8be2\u56fd\u4f01/\u592e\u4f01\u5931\u8d25\uff1a"+e.msg)})}},{key:"render",value:function(){var e=this.props.form.getFieldDecorator,a=this.props.location.query.id;return r["default"].createElement("div",{className:q["default"].container},r["default"].createElement("div",{className:q["default"].header},r["default"].createElement(c["default"],null,r["default"].createElement(c["default"].Item,null,r["default"].createElement(C["default"],{to:"/home"},"\u9996\u9875")),r["default"].createElement(c["default"].Item,null,r["default"].createElement(C["default"],{to:"/ods/macrofinance/MacroIndex"},"\u6570\u636e\u4ed3\u5e93")),r["default"].createElement(c["default"].Item,null,r["default"].createElement(C["default"],{to:"/ods/baseImportCompany/index"}),"\u56fd\u4f01/\u592e\u4f01\u540d\u5355"),r["default"].createElement(c["default"].Item,null,void 0===a?"\u6dfb\u52a0":"\u7f16\u8f91","\u4f01\u4e1a")),r["default"].createElement("h2",null,"\u56fd\u4f01/\u592e\u4f01\u6570\u636e"),r["default"].createElement("div",null,"\u64cd\u4f5c\uff1a\u53ef\u7f16\u8f91\u3001\u6dfb\u52a0\u548c\u5220\u9664\u56fd\u4f01/\u592e\u4f01\u6570\u636e\u3002",r["default"].createElement(f["default"],{onClick:function(){return w["default"].goBack()},className:q["default"].back,icon:"rollback",type:"primary"},"\u8fd4\u56de"))),r["default"].createElement("div",{className:q["default"].body},r["default"].createElement(k["default"],null,r["default"].createElement(T,{label:"\u7c7b\u578b\u9009\u62e9"},e("companyType",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u7c7b\u578b\u9009\u62e9"}]})(r["default"].createElement(h["default"],{allowClear:!1,style:{width:240},placeholder:"\u8bf7\u9009\u62e9"},r["default"].createElement(j,{value:"\u592e\u4f01"},"\u592e\u4f01"),r["default"].createElement(j,{value:"\u56fd\u4f01"},"\u56fd\u4f01")))),r["default"].createElement(T,{label:"\u4f01\u4e1a\u540d\u79f0\uff08\u4e2d\u6587\uff09"},e("companyName",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u4f01\u4e1a\u4e2d\u6587\u5168\u540d"}]})(r["default"].createElement(o["default"],{allowClear:!1,style:{width:480},placeholder:"\u4f01\u4e1a\u4e2d\u6587\u5168\u540d\uff08\u5fc5\u586b\uff09"}))),r["default"].createElement(T,{label:"\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801"},e("companyCode",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801"}]})(r["default"].createElement(o["default"],{allowClear:!1,style:{width:480},placeholder:"\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801\uff08\u5fc5\u586b\uff09"}))))),r["default"].createElement(n["default"],{type:"flex",justify:"end",align:"middle",className:q["default"].footer},r["default"].createElement(u["default"],null,r["default"].createElement(f["default"],{onClick:function(){return w["default"].goBack()},style:{marginRight:24}},"\u53d6\u6d88"),r["default"].createElement(f["default"],{onClick:this.handleSave.bind(this),type:"primary"},"\u63d0\u4ea4"))))}}]),a}(r.Component),g=_))||g)||g);a["default"]=B}}]);