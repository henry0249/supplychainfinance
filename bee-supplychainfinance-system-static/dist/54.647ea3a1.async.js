(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[54],{"9fRq":function(e,t,a){e.exports={container:"container___17VMN",header:"header___1DpKJ",back:"back___3Kyc3",body:"body___3eVM9",footer:"footer___3Dr6K"}},UEjh:function(e,t,a){"use strict";var l=a("tAuX"),d=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=void 0;var r=l(a("q1tI"));a("14J3");var u=d(a("BMrR"));a("jCWc");var n=d(a("kPKH"));a("iQDF");var i=d(a("+eQT"));a("+L6B");var f=d(a("2/Rp"));a("sPJy");var o=d(a("bE4q"));a("miYZ");var c=d(a("tsqr")),s=d(a("p0pE")),m=d(a("2Taf")),p=d(a("vZ4D")),h=d(a("l4Ni")),v=d(a("ujKo")),E=d(a("MhPg"));a("5NDa");var y=d(a("5rEg"));a("OaEy");var g=d(a("2fM7"));a("y8nQ");var w,b,k,_=d(a("Vl3Y")),D=d(a("3a4m")),q=d(a("wY1l")),C=d(a("bKel")),I=d(a("9fRq")),M=d(a("wd/R")),N=a("XWIl"),Y=_["default"].Item,B=g["default"].Option,R=y["default"].TextArea,T=(w=_["default"].create(),(0,C["default"])(b=w((k=function(e){function t(){var e,a;(0,m["default"])(this,t);for(var l=arguments.length,d=new Array(l),r=0;r<l;r++)d[r]=arguments[r];return a=(0,h["default"])(this,(e=(0,v["default"])(t)).call.apply(e,[this].concat(d))),a.state={list:[]},a.handleSave=function(){var e=a.props.form.validateFields,t=a.props.location.query.id;e(function(e,a){if(!e){var l=(0,s["default"])({},a);a.issuedTime&&(l["issuedTime"]=(0,M["default"])(a.issuedTime).format("YYYY-MM-DD hh:mm:ss")),void 0!==t&&(l["id"]=t),(0,N.saveData)(l).then(function(e){0===e.code?(c["default"].success("\u4fdd\u5b58\u73af\u4fdd\u5931\u4fe1\u4f01\u4e1a\u6210\u529f\uff01"),D["default"].goBack()):c["default"].error("\u4fdd\u5b58\u73af\u4fdd\u5931\u4fe1\u4f01\u4e1a\u5931\u8d25:"+e.msg)})}})},a}return(0,E["default"])(t,e),(0,p["default"])(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.location.query.id,a=this.props.form.setFieldsValue;(0,N.getAllProvince)().then(function(t){0===t.code?e.setState({list:t.data}):c["default"].error("\u67e5\u8be2\u6240\u6709\u7701\u4efd\u5931\u8d25\uff1a"+t.msg)}),void 0!==t&&(0,N.getDataById)(t).then(function(e){0===e.code?a({province:e.data.province,illegalEnterpriseName:e.data.illegalEnterpriseName,creditId:e.data.creditId,legalRepresentative:e.data.legalRepresentative,unlawfulActive:e.data.unlawfulActive||null,punishmentBook:e.data.punishmentBook||null,issuedTime:(0,M["default"])(e.data.issuedTime)||null}):c["default"].error("\u67e5\u8be2\u73af\u4fdd\u5931\u4fe1\u4f01\u4e1a\u5931\u8d25\uff1a"+e.msg)})}},{key:"render",value:function(){var e=this.props.form.getFieldDecorator,t=this.props.location.query.id,a=this.state.list;return r["default"].createElement("div",{className:I["default"].container},r["default"].createElement("div",{className:I["default"].header},r["default"].createElement(o["default"],null,r["default"].createElement(o["default"].Item,null,r["default"].createElement(q["default"],{to:"/home"},"\u9996\u9875")),r["default"].createElement(o["default"].Item,null,r["default"].createElement(q["default"],{to:"/ods/macrofinance/MacroIndex"},"\u6570\u636e\u4ed3\u5e93")),r["default"].createElement(o["default"].Item,null,r["default"].createElement(q["default"],{to:"/ods/baseLoseCreditList/index"},"\u73af\u4fdd\u5931\u4fe1\u4f01\u4e1a\u540d\u5355")),r["default"].createElement(o["default"].Item,null,void 0===t?"\u6dfb\u52a0":"\u7f16\u8f91","\u4f01\u4e1a")),r["default"].createElement("h2",null,"\u73af\u4fdd\u5931\u4fe1\u4f01\u4e1a\u6570\u636e"),r["default"].createElement("div",null,"\u64cd\u4f5c\uff1a\u53ef\u7f16\u8f91\u3001\u6dfb\u52a0\u548c\u5220\u9664\u73af\u4fdd\u5931\u4fe1\u4f01\u4e1a\u6570\u636e\u3002",r["default"].createElement(f["default"],{onClick:function(){return D["default"].goBack()},className:I["default"].back,icon:"rollback",type:"primary"},"\u8fd4\u56de"))),r["default"].createElement("div",{className:I["default"].body},r["default"].createElement(_["default"],null,r["default"].createElement(Y,{label:"\u7701\u4efd"},e("province",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u7701\u4efd"}]})(r["default"].createElement(g["default"],{allowClear:!1,style:{width:240},placeholder:"\u8bf7\u9009\u62e9"},0!==a.length&&a.map(function(e){return r["default"].createElement(B,{value:e.district,key:e.id},e.district)})))),r["default"].createElement(Y,{label:"\u4f01\u4e1a\u540d\u79f0\uff08\u4e2d\u6587\uff09"},e("illegalEnterpriseName",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u4f01\u4e1a\u4e2d\u6587\u5168\u540d"}]})(r["default"].createElement(y["default"],{allowClear:!1,style:{width:480},placeholder:"\u4f01\u4e1a\u4e2d\u6587\u5168\u540d\uff08\u5fc5\u586b\uff09"}))),r["default"].createElement(Y,{label:"\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801"},e("creditId",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801"}]})(r["default"].createElement(y["default"],{allowClear:!1,style:{width:480},placeholder:"\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801\uff08\u5fc5\u586b\uff09"}))),r["default"].createElement(Y,{label:"\u4f01\u4e1a\u6cd5\u4eba"},e("legalRepresentative",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u4f01\u4e1a\u6cd5\u4eba"}]})(r["default"].createElement(y["default"],{allowClear:!1,style:{width:480},placeholder:"\u4f01\u4e1a\u6cd5\u4eba\uff08\u5fc5\u586b\uff09"}))),r["default"].createElement(Y,{label:"\u8fdd\u6cd5\u884c\u4e3a"},e("unlawfulActive")(r["default"].createElement(R,{rows:4,style:{width:480},placeholder:"\uff08\u9009\u586b\uff09"}))),r["default"].createElement(Y,{label:"\u884c\u653f\u5904\u7f5a\u51b3\u5b9a\u4e66\u6587\u53f7"},e("punishmentBook")(r["default"].createElement(y["default"],{allowClear:!1,style:{width:480},placeholder:"\u884c\u653f\u5904\u7f5a\u51b3\u5b9a\u4e66\u6587\u53f7\uff08\u9009\u586b\uff09"}))),r["default"].createElement(Y,{label:"\u4e0b\u8fbe\u65f6\u95f4"},e("issuedTime")(r["default"].createElement(i["default"],{format:"YYYY-MM-DD hh:mm:ss",allowClear:!1,style:{width:240},placeholder:"\u8bf7\u9009\u62e9\u4e0b\u8fbe\u65f6\u95f4"}))))),r["default"].createElement(u["default"],{type:"flex",justify:"end",align:"middle",className:I["default"].footer},r["default"].createElement(n["default"],null,r["default"].createElement(f["default"],{onClick:function(){return D["default"].goBack()},style:{marginRight:24}},"\u53d6\u6d88"),r["default"].createElement(f["default"],{onClick:this.handleSave.bind(this),type:"primary"},"\u63d0\u4ea4"))))}}]),t}(r.Component),b=k))||b)||b);t["default"]=T}}]);