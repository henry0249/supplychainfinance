(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[51],{GBrA:function(e,t,a){e.exports={container:"container___3o_lp",colBox:"colBox___1oAuY"}},N76W:function(e,t,a){"use strict";var r=a("tAuX"),n=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=void 0;var o=r(a("q1tI"));a("IzEo");var l=n(a("bx4M"));a("g9YV");var c=n(a("wCAj"));a("14J3");var u=n(a("BMrR"));a("jCWc");var i=n(a("kPKH"));a("5NDa");var d=n(a("5rEg"));a("+L6B");var s=n(a("2/Rp"));a("2qtc");var f=n(a("kLXV"));a("miYZ");var m=n(a("tsqr")),p=n(a("2Taf")),g=n(a("vZ4D")),h=n(a("l4Ni")),v=n(a("ujKo")),y=n(a("rlhR")),w=n(a("MhPg"));a("y8nQ");var k,E,N,P=n(a("Vl3Y")),R=n(a("3a4m")),C=n(a("GBrA")),D=a("TZ/o"),b=P["default"].Item,x=(k=P["default"].create(),k((N=function(e){function t(){var e,a;(0,p["default"])(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return a=(0,h["default"])(this,(e=(0,v["default"])(t)).call.apply(e,[this].concat(n))),a.state={data:[],page:{currentPage:1,pageSize:10,totalPage:0,totalRecords:0}},a.getData=function(e){var t=a.props.form.validateFields;t(function(t,r){if(!t){var n={current:e};r.sourceName&&(n["sourceName"]=r.sourceName),(0,D.getBaseGrossProfitRate)(n).then(function(e){0===e.code?a.setState({data:e.data,page:e.page}):m["default"].error("\u83b7\u53d6\u539f\u6599\u52a0\u5de5\u9500\u552e\u6bdb\u5229\u7387\u5217\u8868\u5931\u8d25\uff1a"+e.msg)})}})},a.currentChange=function(e){a.getData(e)},a.handleSearch=function(){a.getData(1)},a.handleDelete=function(e){var t=(0,y["default"])(a);f["default"].confirm({title:"\u5220\u9664\u6bdb\u5229\u7387\u9879",content:"\u5220\u9664\u6807\u7684\u7269\u201c".concat(e.sourceName,"\u201d\u6bdb\u5229\u7387\u9879\u5417\uff1f"),onOk:function(){(0,D.deleteBaseGrossProfitRate)({id:e.id}).then(function(a){0===a.code?(m["default"].success('\u5220\u9664\u6807\u7684\u7269\u540d\u79f0"'+e.sourceName+'"\u6210\u529f\uff01'),t.getData(1)):m["default"].error("\u5220\u9664\u6807\u7684\u7269\u540d\u79f0\u5931\u8d25\uff1a"+a.msg)})},onCancel:function(){}})},a}return(0,w["default"])(t,e),(0,g["default"])(t,[{key:"componentDidMount",value:function(){this.getData(1)}},{key:"render",value:function(){var e=this,t=this.props.form.getFieldDecorator,a=this.state,r=a.data,n=a.page,f=[{title:"\u6807\u7684\u7269\u540d\u79f0",dataIndex:"sourceName",key:"sourceName",width:"25%"},{title:"\u52a0\u5de5\u9500\u552e\u6bdb\u5229\u7387",dataIndex:"grossProfitRate",key:"grossProfitRate",render:function(e,t){return e+"%"},width:"25%"},{title:"\u66f4\u65b0\u65f6\u95f4",dataIndex:"modifyTime",key:"modifyTime",width:"25%"},{title:"\u64cd\u4f5c",key:"action",render:function(t,a,r){return o["default"].createElement("div",null,o["default"].createElement("span",{onClick:function(){return R["default"].push("/ods/baseGrossProfitRate/edit?id=".concat(a.id,"&sourceName=").concat(a.sourceName))},style:{fontSize:14,color:"#1890FF",cursor:"pointer",marginRight:12}},"\u7f16\u8f91"),o["default"].createElement("span",{onClick:function(){return e.handleDelete(a)},style:{fontSize:14,color:"#1890FF",cursor:"pointer",marginRight:12}},"\u5220\u9664"))},width:"25%"}];return o["default"].createElement("div",{className:C["default"].container},o["default"].createElement(l["default"],{bordered:!1,title:"\u6570\u636e\u4ed3\u5e93\uff1a\u539f\u6599\u52a0\u5de5\u9500\u552e\u6bdb\u5229\u7387",extra:o["default"].createElement(s["default"],{onClick:function(){return R["default"].push("/ods/baseGrossProfitRate/edit")},type:"primary",icon:"plus"},"\u6dfb\u52a0\u65b0\u6807\u7684\u7269")},o["default"].createElement(P["default"],{layout:"inline"},o["default"].createElement(u["default"],{gutter:8},o["default"].createElement(i["default"],{className:C["default"].colBox},o["default"].createElement(b,null,t("sourceName")(o["default"].createElement(d["default"],{allowClear:!1,style:{width:300},placeholder:"\u8bf7\u8f93\u5165\u6807\u7684\u7269\u540d\u79f0"}))),o["default"].createElement(s["default"],{onClick:this.handleSearch.bind(this),type:"primary",icon:"search"}," ")))),o["default"].createElement(c["default"],{rowKey:"id",style:{marginTop:24},dataSource:r,columns:f,pagination:{showQuickJumper:!0,current:n.currentPage,pageSize:n.pageSize,total:n.totalRecords,onChange:this.currentChange,showTotal:function(e,t){return"\u5171 ".concat(n.totalRecords," \u6761\u8bb0\u5f55 \u7b2c ").concat(n.currentPage," / ").concat(n.totalPage," \u9875")}}})))}}]),t}(o.Component),E=N))||E);t["default"]=x}}]);