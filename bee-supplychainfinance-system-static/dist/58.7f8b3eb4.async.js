(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[58],{"7kGo":function(e,a,t){"use strict";var l=t("tAuX"),n=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a["default"]=void 0;var r=l(t("q1tI"));t("14J3");var d=n(t("BMrR"));t("jCWc");var u=n(t("kPKH"));t("5NDa");var o=n(t("5rEg"));t("+L6B");var f=n(t("2/Rp"));t("sPJy");var c=n(t("bE4q"));t("miYZ");var i=n(t("tsqr")),s=n(t("p0pE")),m=n(t("2Taf")),p=n(t("vZ4D")),y=n(t("l4Ni")),h=n(t("ujKo")),E=n(t("MhPg"));t("OaEy");var v=n(t("2fM7"));t("y8nQ");var k,g,b,w=n(t("Vl3Y")),C=n(t("3a4m")),_=n(t("wY1l")),q=n(t("bKel")),I=n(t("k93i")),S=t("DuBG"),B=w["default"].Item,D=v["default"].Option,N=(k=w["default"].create(),(0,q["default"])(g=k((b=function(e){function a(){var e,t;(0,m["default"])(this,a);for(var l=arguments.length,n=new Array(l),r=0;r<l;r++)n[r]=arguments[r];return t=(0,y["default"])(this,(e=(0,h["default"])(a)).call.apply(e,[this].concat(n))),t.state={years:[],ranks:[],inputValue:""},t.handleSave=function(){var e=t.props.form.validateFields,a=t.props.location.query.id;e(function(e,t){if(!e){var l=(0,s["default"])({},t);void 0!==a&&(l["id"]=a),(0,S.saveData)(l).then(function(e){0===e.code?(i["default"].success("\u4fdd\u5b58\u4e16\u754c500\u5f3a\u4f01\u4e1a\u6210\u529f\uff01"),C["default"].goBack()):i["default"].error("\u4fdd\u5b58\u4e16\u754c500\u5f3a\u4f01\u4e1a\u5931\u8d25:"+e.msg)})}})},t}return(0,E["default"])(a,e),(0,p["default"])(a,[{key:"componentDidMount",value:function(){var e=this,a=this.props.location.query.id,t=this.props.form.setFieldsValue;(0,S.getConstant)().then(function(a){0===a.code?e.setState({years:a.data.years,ranks:a.data.ranks}):i["default"].error("\u67e5\u8be2\u6240\u6709\u5e74\u4efd\u5931\u8d25\uff1a"+a.msg)}),void 0!==a&&(0,S.getDataById)(a).then(function(e){0===e.code?t({years:e.data.years,rank:e.data.rank,companyCname:e.data.companyCname,companyEname:e.data.companyEname||null,companyCode:e.data.companyCode||null}):i["default"].error("\u67e5\u8be2\u4e16\u754c500\u5f3a\u4f01\u4e1a\u5931\u8d25\uff1a"+e.msg)})}},{key:"render",value:function(){var e=this,a=this.props.form.getFieldDecorator,t=this.props.location.query.id,l=this.state,n=l.years,i=l.ranks,s=l.inputValue;return r["default"].createElement("div",{className:I["default"].container},r["default"].createElement("div",{className:I["default"].header},r["default"].createElement(c["default"],null,r["default"].createElement(c["default"].Item,null,r["default"].createElement(_["default"],{to:"/home"},"\u9996\u9875")),r["default"].createElement(c["default"].Item,null,r["default"].createElement(_["default"],{to:"/ods/macrofinance/MacroIndex"},"\u6570\u636e\u4ed3\u5e93")),r["default"].createElement(c["default"].Item,null,r["default"].createElement(_["default"],{to:"/ods/baseTopCompany/index"},"\u4e16\u754c500\u5f3a\u4f01\u4e1a\u540d\u5355")),r["default"].createElement(c["default"].Item,null,void 0===t?"\u6dfb\u52a0":"\u7f16\u8f91","\u4f01\u4e1a")),r["default"].createElement("h2",null,"\u4e16\u754c500\u5f3a\u4f01\u4e1a\u6570\u636e"),r["default"].createElement("div",null,"\u64cd\u4f5c\uff1a\u53ef\u7f16\u8f91\u3001\u6dfb\u52a0\u548c\u5220\u9664\u4e16\u754c500\u5f3a\u4f01\u4e1a\u6570\u636e\u3002",r["default"].createElement(f["default"],{onClick:function(){return C["default"].goBack()},className:I["default"].back,icon:"rollback",type:"primary"},"\u8fd4\u56de"))),r["default"].createElement("div",{className:I["default"].body},r["default"].createElement(w["default"],null,r["default"].createElement(B,{label:"\u5e74\u4efd"},a("years",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u5e74\u4efd"}]})(r["default"].createElement(v["default"],{allowClear:!1,style:{width:240},placeholder:"\u8bf7\u9009\u62e9"},0!==n.length&&n.map(function(e,a){return r["default"].createElement(D,{value:e},e)})))),r["default"].createElement(B,{label:"\u6392\u540d"},a("rank",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u6392\u540d"}]})(r["default"].createElement(v["default"],{allowClear:!1,style:{width:240},showSearch:!0,placeholder:"\u8bf7\u9009\u62e9",filterOption:!1,onSearch:function(a){return e.setState({inputValue:a})}},0!==i.length&&i.map(function(e,a){if(String(e).indexOf(String(s))>-1)return r["default"].createElement(D,{value:e},e)})))),r["default"].createElement(B,{label:"\u4f01\u4e1a\u540d\u79f0\uff08\u4e2d\u6587\uff09"},a("companyCname",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u4f01\u4e1a\u4e2d\u6587\u5168\u540d"}]})(r["default"].createElement(o["default"],{allowClear:!1,style:{width:480},placeholder:"\u4f01\u4e1a\u4e2d\u6587\u5168\u540d\uff08\u5fc5\u586b\uff09"}))),r["default"].createElement(B,{label:"\u4f01\u4e1a\u540d\u79f0\uff08\u82f1\u6587\uff09"},a("companyEname")(r["default"].createElement(o["default"],{allowClear:!1,style:{width:480},placeholder:"\u4f01\u4e1a\u82f1\u6587\u5168\u540d\uff08\u9009\u586b\uff09"}))),r["default"].createElement(B,{label:"\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801"},a("companyCode")(r["default"].createElement(o["default"],{allowClear:!1,style:{width:480},placeholder:"\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801\uff08\u975e\u5185\u5730\u4f01\u4e1a\u53ef\u4e0d\u586b\uff09"}))))),r["default"].createElement(d["default"],{type:"flex",justify:"end",align:"middle",className:I["default"].footer},r["default"].createElement(u["default"],null,r["default"].createElement(f["default"],{onClick:function(){return C["default"].goBack()},style:{marginRight:24}},"\u53d6\u6d88"),r["default"].createElement(f["default"],{onClick:this.handleSave.bind(this),type:"primary"},"\u63d0\u4ea4"))))}}]),a}(r.Component),g=b))||g)||g);a["default"]=N},k93i:function(e,a,t){e.exports={container:"container___3v8Qm",header:"header___2WKlZ",back:"back___2pwKp",body:"body___kbq0O",footer:"footer___2kQLJ"}}}]);