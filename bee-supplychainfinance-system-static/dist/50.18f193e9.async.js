(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[50],{BBXg:function(e,t,a){e.exports={container:"container___z3dTy",header:"header___218Vf",back:"back___3N78_",body:"body___1G4--",footer:"footer___wmBHG"}},Hcbr:function(e,t,a){"use strict";var l=a("tAuX"),r=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=void 0;var u=l(a("q1tI"));a("14J3");var n=r(a("BMrR"));a("jCWc");var o=r(a("kPKH"));a("5NDa");var d=r(a("5rEg"));a("giR+");var f=r(a("fyUT"));a("+L6B");var s=r(a("2/Rp"));a("sPJy");var c=r(a("bE4q"));a("miYZ");var i=r(a("tsqr")),m=r(a("2Taf")),y=r(a("vZ4D")),h=r(a("l4Ni")),v=r(a("ujKo")),p=r(a("MhPg"));a("OaEy");var g=r(a("2fM7"));a("y8nQ");var E,k,b,R=r(a("Vl3Y")),q=r(a("3a4m")),N=r(a("wY1l")),_=r(a("bKel")),w=r(a("BBXg")),B=a("TZ/o"),P=R["default"].Item,C=g["default"].Option,I=(E=R["default"].create(),(0,_["default"])(k=E((b=function(e){function t(){var e,a;(0,m["default"])(this,t);for(var l=arguments.length,r=new Array(l),u=0;u<l;u++)r[u]=arguments[u];return a=(0,h["default"])(this,(e=(0,v["default"])(t)).call.apply(e,[this].concat(r))),a.state={list:[]},a.query=function(e){var t=a.props.form,l=t.setFieldsValue,r=t.resetFields;(0,B.queryBySourceName)(e).then(function(e){0===e.code?0!==Object.keys(e.data).length?l({sourceName:e.data.sourceName||null,grossProfitRate:e.data.grossProfitRate||null,equationRemark:e.data.equationRemark||null}):r(["grossProfitRate","equationRemark"]):i["default"].error("\u67e5\u8be2\u6807\u7684\u7269\u8be6\u7ec6\u4fe1\u606f\u5931\u8d25\uff1a"+e.msg)})},a.handleSave=function(){var e=a.props.form.validateFields;e(function(e,t){if(!e){var a={sourceName:t.sourceName,grossProfitRate:t.grossProfitRate};t.equationRemark&&(a["equationRemark"]=t.equationRemark),(0,B.saveBaseGrossProfitRate)(a).then(function(e){0===e.code?(i["default"].success('\u4fdd\u5b58\u6807\u7684\u7269\u540d\u79f0"'+t.sourceName+'"\u6210\u529f\uff01'),q["default"].goBack()):i["default"].error('\u4fdd\u5b58\u6807\u7684\u7269\u540d\u79f0"'+t.sourceName+'"\u5931\u8d25:'+e.msg)})}})},a}return(0,p["default"])(t,e),(0,y["default"])(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.location.query.sourceName;(0,B.getList)().then(function(t){0===t.code?e.setState({list:t.data}):i["default"].error("\u83b7\u53d6\u6240\u6709\u6807\u7684\u7269\u5217\u8868\u5931\u8d25\uff1a"+t.msg)}),t&&this.query(t)}},{key:"render",value:function(){var e=this,t=this.props.form.getFieldDecorator,a=this.props.location.query,l=a.id,r=(a.sourceName,this.state.list);return u["default"].createElement("div",{className:w["default"].container},u["default"].createElement("div",{className:w["default"].header},u["default"].createElement(c["default"],null,u["default"].createElement(c["default"].Item,null,u["default"].createElement(N["default"],{to:"/home"},"\u9996\u9875")),u["default"].createElement(c["default"].Item,null,u["default"].createElement(N["default"],{to:"/ods/macrofinance/MacroIndex"},"\u6570\u636e\u4ed3\u5e93")),u["default"].createElement(c["default"].Item,null,u["default"].createElement(N["default"],{to:"/ods/baseGrossProfitRate/index"}),"\u539f\u6599\u52a0\u5de5\u9500\u552e\u6bdb\u5229\u7387"),u["default"].createElement(c["default"].Item,null,void 0===l?"\u6dfb\u52a0":"\u7f16\u8f91","\u6807\u7684\u7269")),u["default"].createElement("h2",null,"\u539f\u6599\u52a0\u5de5\u9500\u552e\u6bdb\u5229\u7387\u6570\u636e"),u["default"].createElement("div",null,"\u64cd\u4f5c\uff1a\u53ef\u7f16\u8f91\u3001\u6dfb\u52a0\u548c\u5220\u9664\u539f\u6599\u52a0\u5de5\u9500\u552e\u6bdb\u5229\u7387\u6570\u636e\u3002",u["default"].createElement(s["default"],{onClick:function(){return q["default"].goBack()},className:w["default"].back,icon:"rollback",type:"primary"},"\u8fd4\u56de"))),u["default"].createElement("div",{className:w["default"].body},u["default"].createElement(R["default"],null,u["default"].createElement(P,{label:"\u6807\u7684\u7269"},t("sourceName",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u6807\u7684\u7269"}]})(u["default"].createElement(g["default"],{allowClear:!1,style:{width:240},placeholder:"\u8bf7\u9009\u62e9",onChange:function(t){return e.query(t)}},0!==r.length&&r.map(function(e,t){return u["default"].createElement(C,{value:e.sysCodeVal,key:t},e.sysCodeVal)})))),u["default"].createElement(P,{label:"\u6bdb\u5229\u6da6"},t("grossProfitRate",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6bdb\u5229\u6da6"}]})(u["default"].createElement(f["default"],{style:{width:240}})),u["default"].createElement("span",{style:{marginLeft:12}},"%")),u["default"].createElement(P,{label:"\u8ba1\u7b97\u516c\u5f0f"},t("equationRemark")(u["default"].createElement(d["default"],{allowClear:!1,style:{width:480},placeholder:"\u8ba1\u7b97\u516c\u5f0f\uff08\u9009\u586b\uff09"}))))),u["default"].createElement(n["default"],{type:"flex",justify:"end",align:"middle",className:w["default"].footer},u["default"].createElement(o["default"],null,u["default"].createElement(s["default"],{onClick:function(){return q["default"].goBack()},style:{marginRight:24}},"\u53d6\u6d88"),u["default"].createElement(s["default"],{onClick:this.handleSave.bind(this),type:"primary"},"\u63d0\u4ea4"))))}}]),t}(u.Component),k=b))||k)||k);t["default"]=I}}]);