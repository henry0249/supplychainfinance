(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[53],{riow:function(e,t,a){e.exports={container:"container___sInck",colBox:"colBox___2Azvi"}},tc1M:function(e,t,a){"use strict";var n=a("tAuX"),l=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=void 0;var r=n(a("q1tI"));a("IzEo");var o=l(a("bx4M"));a("g9YV");var c=l(a("wCAj"));a("14J3");var d=l(a("BMrR"));a("5NDa");var u=l(a("5rEg"));a("/zsF");var i=l(a("PArb"));a("jCWc");var f=l(a("kPKH"));a("+L6B");var m=l(a("2/Rp"));a("2qtc");var s=l(a("kLXV"));a("miYZ");var p=l(a("tsqr")),y=l(a("2Taf")),h=l(a("vZ4D")),g=l(a("l4Ni")),v=l(a("ujKo")),E=l(a("rlhR")),w=l(a("MhPg"));a("OaEy");var k=l(a("2fM7"));a("y8nQ");var x,C,D,N=l(a("Vl3Y")),b=l(a("3a4m")),T=l(a("riow")),S=a("8ocg"),I=N["default"].Item,P=k["default"].Option,z=(x=N["default"].create(),x((D=function(e){function t(){var e,a;(0,y["default"])(this,t);for(var n=arguments.length,l=new Array(n),r=0;r<n;r++)l[r]=arguments[r];return a=(0,g["default"])(this,(e=(0,v["default"])(t)).call.apply(e,[this].concat(l))),a.state={type:0,data:[],page:{currentPage:1,pageSize:10,totalPage:0,totalRecords:0}},a.getData=function(e,t){var n=a.props.form,l=n.validateFields,r=n.resetFields;l(function(n,l){if(!n){var o={current:e};0===t?(o["companyType"]=l.companyType,(0,S.getDataByType)(o).then(function(e){0===e.code?(r(["companyName"]),a.setState({data:e.data,page:e.page,type:t})):p["default"].error("\u83b7\u53d6\u56fd\u4f01/\u592e\u4f01\u5217\u8868\u5931\u8d25\uff1a"+e.msg)})):1===t&&(o["companyName"]=l.companyName,(0,S.getDataByName)(o).then(function(e){0===e.code?(r(["companyType"]),a.setState({data:e.data,page:e.page,type:t})):p["default"].error("\u83b7\u53d6\u56fd\u4f01/\u592e\u4f01\u5217\u8868\u5931\u8d25\uff1a"+e.msg)}))}})},a.currentChange=function(e){var t=a.state.type;a.getData(e,t)},a.handleSearch=function(e){a.getData(1,e)},a.handleDelete=function(e){var t=a.state.type,n=(0,E["default"])(a);s["default"].confirm({title:"\u5220\u9664\u56fd\u4f01/\u592e\u4f01",content:"\u5220\u9664\u4f01\u4e1a\u201c".concat(e.companyName,"\u201d\u5417\uff1f"),onOk:function(){(0,S.deleteData)({id:e.id}).then(function(e){0===e.code?(p["default"].success("\u5220\u9664\u56fd\u4f01/\u592e\u4f01\u6210\u529f\uff01"),n.getData(1,t)):p["default"].error("\u5220\u9664\u56fd\u4f01/\u592e\u4f01\u5931\u8d25\uff1a"+e.msg)})},onCancel:function(){}})},a}return(0,w["default"])(t,e),(0,h["default"])(t,[{key:"componentDidMount",value:function(){var e=this.state.type;this.getData(1,e)}},{key:"render",value:function(){var e=this,t=this.props.form.getFieldDecorator,a=this.state,n=a.data,l=a.page,s=[{title:"\u7c7b\u578b",dataIndex:"companyType",key:"companyType",width:"25%"},{title:"\u4f01\u4e1a\u540d\u79f0",dataIndex:"companyName",key:"companyName",width:"25%"},{title:"\u66f4\u65b0\u65f6\u95f4",dataIndex:"modifyTime",key:"modifyTime",width:"25%"},{title:"\u64cd\u4f5c",key:"action",render:function(t,a,n){return r["default"].createElement("div",null,r["default"].createElement("span",{onClick:function(){return b["default"].push("/ods/baseImportCompany/edit?id=".concat(a.id))},style:{fontSize:14,color:"#1890FF",cursor:"pointer",marginRight:12}},"\u7f16\u8f91"),r["default"].createElement("span",{onClick:function(){return e.handleDelete(a)},style:{fontSize:14,color:"#1890FF",cursor:"pointer",marginRight:12}},"\u5220\u9664"))},width:"25%"}];return r["default"].createElement("div",{className:T["default"].container},r["default"].createElement(o["default"],{bordered:!1,title:"\u6570\u636e\u4ed3\u5e93\uff1a\u56fd\u4f01/\u592e\u4f01\u540d\u5355",extra:r["default"].createElement(m["default"],{onClick:function(){return b["default"].push("/ods/baseImportCompany/edit")},type:"primary",icon:"plus"},"\u6dfb\u52a0\u65b0\u4f01\u4e1a")},r["default"].createElement(N["default"],{layout:"inline"},r["default"].createElement(d["default"],{gutter:8},r["default"].createElement(f["default"],{className:T["default"].colBox,xs:24,sm:24,md:24,lg:24,xl:9},r["default"].createElement(I,{label:"\u56fd\u4f01/\u592e\u4f01"},t("companyType",{initialValue:0})(r["default"].createElement(k["default"],{allowClear:!1,style:{width:150},placeholder:"\u8bf7\u9009\u62e9"},r["default"].createElement(P,{value:0},"\u5168\u90e8"),r["default"].createElement(P,{value:1},"\u4ec5\u592e\u4f01"),r["default"].createElement(P,{value:2},"\u4ec5\u56fd\u4f01")))),r["default"].createElement(m["default"],{onClick:this.handleSearch.bind(this,0),type:"primary"},"\u7b5b\u9009")),r["default"].createElement(f["default"],{xs:0,sm:0,md:0,lg:0,xl:1},r["default"].createElement(i["default"],{type:"vertical",style:{height:40}})),r["default"].createElement(f["default"],{className:T["default"].colBox,xs:24,sm:24,md:24,lg:24,xl:14},r["default"].createElement(I,null,t("companyName")(r["default"].createElement(u["default"],{allowClear:!1,style:{width:300},placeholder:"\u8bf7\u8f93\u5165\u4f01\u4e1a\u540d\u79f0"}))),r["default"].createElement(m["default"],{onClick:this.handleSearch.bind(this,1),type:"primary",icon:"search"}," ")))),r["default"].createElement(c["default"],{rowKey:"id",style:{marginTop:24},dataSource:n,columns:s,pagination:{showQuickJumper:!0,current:l.currentPage,pageSize:l.pageSize,total:l.totalRecords,onChange:this.currentChange,showTotal:function(e,t){return"\u5171 ".concat(l.totalRecords," \u6761\u8bb0\u5f55 \u7b2c ").concat(l.currentPage," / ").concat(l.totalPage," \u9875")}}})))}}]),t}(r.Component),C=D))||C);t["default"]=z}}]);