(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[56],{"5uRE":function(e,t,a){"use strict";var l=a("tAuX"),d=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=void 0;var u=l(a("q1tI"));a("14J3");var r=d(a("BMrR"));a("jCWc");var n=d(a("kPKH"));a("5NDa");var o=d(a("5rEg"));a("iQDF");var f=d(a("+eQT"));a("+L6B");var c=d(a("2/Rp"));a("sPJy");var i=d(a("bE4q"));a("miYZ");var m=d(a("tsqr")),s=d(a("p0pE")),p=d(a("2Taf")),h=d(a("vZ4D")),v=d(a("l4Ni")),y=d(a("ujKo")),E=d(a("MhPg"));a("y8nQ");var b,_,g,k=d(a("Vl3Y")),w=d(a("3a4m")),D=d(a("wY1l")),M=d(a("bKel")),C=d(a("nWMC")),I=d(a("wd/R")),N=a("AGDB"),Y=k["default"].Item,q=(b=k["default"].create(),(0,M["default"])(_=b((g=function(e){function t(){var e,a;(0,p["default"])(this,t);for(var l=arguments.length,d=new Array(l),u=0;u<l;u++)d[u]=arguments[u];return a=(0,v["default"])(this,(e=(0,y["default"])(t)).call.apply(e,[this].concat(d))),a.state={},a.handleSave=function(){var e=a.props.form.validateFields,t=a.props.location.query.id;e(function(e,a){if(!e){var l=(0,s["default"])({},a,{publicTime:(0,I["default"])(a.publicTime).format("YYYY-MM-DD hh:mm:ss")});void 0!==t&&(l["id"]=t),(0,N.saveData)(l).then(function(e){0===e.code?(m["default"].success("\u4fdd\u5b58\u56fd\u5185\u4e0a\u5e02\u4f01\u4e1a\u6210\u529f\uff01"),w["default"].goBack()):m["default"].error("\u4fdd\u5b58\u56fd\u5185\u4e0a\u5e02\u4f01\u4e1a\u5931\u8d25:"+e.msg)})}})},a}return(0,E["default"])(t,e),(0,h["default"])(t,[{key:"componentDidMount",value:function(){var e=this.props.location.query.id,t=this.props.form.setFieldsValue;void 0!==e&&(0,N.getDataById)(e).then(function(e){0===e.code?t({publicTime:(0,I["default"])(e.data.publicTime),companyName:e.data.companyName,companyId:e.data.companyId}):m["default"].error("\u67e5\u8be2\u56fd\u5185\u4e0a\u5e02\u4f01\u4e1a\u5931\u8d25\uff1a"+e.msg)})}},{key:"render",value:function(){var e=this.props.form.getFieldDecorator,t=this.props.location.query.id;return u["default"].createElement("div",{className:C["default"].container},u["default"].createElement("div",{className:C["default"].header},u["default"].createElement(i["default"],null,u["default"].createElement(i["default"].Item,null,u["default"].createElement(D["default"],{to:"/home"},"\u9996\u9875")),u["default"].createElement(i["default"].Item,null,u["default"].createElement(D["default"],{to:"/ods/macrofinance/MacroIndex"},"\u6570\u636e\u4ed3\u5e93")),u["default"].createElement(i["default"].Item,null,u["default"].createElement(D["default"],{to:"/ods/basePublicCompany/index"},"\u56fd\u5185\u4e0a\u5e02\u4f01\u4e1a\u540d\u5355")),u["default"].createElement(i["default"].Item,null,void 0===t?"\u6dfb\u52a0":"\u7f16\u8f91","\u4f01\u4e1a")),u["default"].createElement("h2",null,"\u56fd\u5185\u4e0a\u5e02\u4f01\u4e1a\u6570\u636e"),u["default"].createElement("div",null,"\u64cd\u4f5c\uff1a\u53ef\u7f16\u8f91\u3001\u6dfb\u52a0\u548c\u5220\u9664\u56fd\u5185\u4e0a\u5e02\u4f01\u4e1a\u6570\u636e\u3002",u["default"].createElement(c["default"],{onClick:function(){return w["default"].goBack()},className:C["default"].back,icon:"rollback",type:"primary"},"\u8fd4\u56de"))),u["default"].createElement("div",{className:C["default"].body},u["default"].createElement(k["default"],null,u["default"].createElement(Y,{label:"\u4e0a\u5e02\u65e5\u671f"},e("publicTime",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u7c7b\u578b\u9009\u62e9"}]})(u["default"].createElement(f["default"],{format:"YYYY-MM-DD hh:mm:ss",allowClear:!1,style:{width:240},placeholder:"\u8bf7\u9009\u62e9"}))),u["default"].createElement(Y,{label:"\u4f01\u4e1a\u540d\u79f0\uff08\u4e2d\u6587\uff09"},e("companyName",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u4f01\u4e1a\u4e2d\u6587\u5168\u540d"}]})(u["default"].createElement(o["default"],{allowClear:!1,style:{width:480},placeholder:"\u4f01\u4e1a\u4e2d\u6587\u5168\u540d\uff08\u5fc5\u586b\uff09"}))),u["default"].createElement(Y,{label:"\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801"},e("companyId",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801"}]})(u["default"].createElement(o["default"],{allowClear:!1,style:{width:480},placeholder:"\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801\uff08\u5fc5\u586b\uff09"}))))),u["default"].createElement(r["default"],{type:"flex",justify:"end",align:"middle",className:C["default"].footer},u["default"].createElement(n["default"],null,u["default"].createElement(c["default"],{onClick:function(){return w["default"].goBack()},style:{marginRight:24}},"\u53d6\u6d88"),u["default"].createElement(c["default"],{onClick:this.handleSave.bind(this),type:"primary"},"\u63d0\u4ea4"))))}}]),t}(u.Component),_=g))||_)||_);t["default"]=q},nWMC:function(e,t,a){e.exports={container:"container___DMmDi",header:"header___tXpix",back:"back___390ft",body:"body___o_nbs",footer:"footer___z0MGN"}}}]);