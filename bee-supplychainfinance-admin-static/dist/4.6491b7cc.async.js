(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{"1C1l":function(e,t,a){e.exports={upload:"upload___1zxDB",imgList:"imgList___3CIqi"}},"3ZQg":function(e,t,a){e.exports={container:"container___bCpVT",top:"top___3gWch",breadcrumb:"breadcrumb___hdXzS",title:"title___mln57",body:"body___pHZP7",boxTitle:"boxTitle___29WPR",main:"main___2jhZA",formitem:"formitem___1fIBk",upload:"upload___1YtKw",footer:"footer___3B1PR"}},m1Ci:function(e,t,a){"use strict";a.r(t);a("+L6B");var r=a("2/Rp"),n=(a("giR+"),a("fyUT")),s=(a("6UJt"),a("DFOY")),i=(a("14J3"),a("BMrR")),o=(a("5NDa"),a("5rEg")),l=(a("sPJy"),a("bE4q")),c=a("p0pE"),u=a.n(c),m=(a("miYZ"),a("tsqr")),p=a("2Taf"),d=a.n(p),f=a("vZ4D"),g=a.n(f),h=a("l4Ni"),v=a.n(h),b=a("ujKo"),E=a.n(b),y=a("MhPg"),P=a.n(y),_=(a("OaEy"),a("2fM7")),L=(a("y8nQ"),a("Vl3Y")),w=a("q1tI"),S=a.n(w),N=a("/MKj"),C=a("wY1l"),R=a.n(C),k=a("3ZQg"),j=a.n(k),I=(a("2qtc"),a("kLXV")),O=(a("MXD1"),a("CFYs")),T=(a("DZo9"),a("8z0m")),U=(a("Pwec"),a("CtXQ")),q=(a("17x9"),a("1C1l")),x=a.n(q),M=function(e){function t(){var e,a;d()(this,t);for(var r=arguments.length,n=new Array(r),s=0;s<r;s++)n[s]=arguments[s];return a=v()(this,(e=E()(t)).call.apply(e,[this].concat(n))),a.state={previewVisible:!1,previewImage:null},a.handlePreview=function(e){a.setState({previewImage:e.url||e.thumbUrl,previewVisible:!0})},a}return P()(t,e),g()(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.accept,r=t.disabled,n=t.fileList,s=t.number,i=t.percent,o=t.beforeUpload,l=t.onChange,c=t.onRemove,u=this.state,m=u.previewVisible,p=u.previewImage,d=n||[],f=S.a.createElement("div",{className:x.a.upload},S.a.createElement(U["a"],{style:{fontSize:20},type:"plus"}),S.a.createElement("div",null,"\u4e0a\u4f20"));return S.a.createElement("div",{className:"clearfix"},S.a.createElement(T["a"],{accept:a,action:"https://www.beesrv.com/bee-web/api/files/uploadFile",className:x.a.imgList,disabled:r,fileList:d,listType:"picture-card",beforeUpload:o,onChange:l,onRemove:!0===r?function(){return!1}:c,onPreview:this.handlePreview},d.length<s&&!1===r?f:null),i&&0!==i?S.a.createElement(O["a"],{style:{position:"relative",top:-8},percent:i,size:"small",status:100===i?"success":101===i?"exception":"active"}):null,S.a.createElement(I["a"],{visible:m,footer:null,onCancel:function(){return e.setState({previewImage:null,previewVisible:!1})}},S.a.createElement("img",{alt:"example",style:{width:"100%"},src:p})))}}]),t}(w["Component"]);M.defaultProps={accept:"image/jpg, image/jpeg, image/png",disabled:!1,fileList:null,number:1,percent:0,beforeUpload:function(e,t){var a=e.size/1024/1024<10;return a||m["a"].error("\u6587\u4ef6\u5927\u5c0f\u6700\u5927\u652f\u630110M\uff01"),a},onChange:function(){return!1},onRemove:function(){return!0}};var V,z,F,D,Z=a("kLkQ"),B=a("HKEg"),Y=a("y0tt"),J=a("3a4m"),Q=a.n(J),X=a("3eXy");a.d(t,"default",function(){return K});var A=L["a"].Item,K=(_["a"].Option,_["a"].OptGroup,V=L["a"].create(),z=Object(N["c"])(function(e){var t=e.global;e.loading;return{global:t}}),V(F=z((D=function(e){function t(){var e,a;d()(this,t);for(var r=arguments.length,n=new Array(r),s=0;s<r;s++)n[s]=arguments[s];return a=v()(this,(e=E()(t)).call.apply(e,[this].concat(n))),a.state={data:{},region:null,industry:null,defaultRegion:[],logosPercent:0,enclosuresPercent:0,permitsPercent:0,certificatesPercent:0,companyList:[]},a.beforeUpload=function(e){var t=e.size/1024/1024<10;return a.setState({logosPercent:0}),t||m["a"].error("\u6587\u4ef6\u5927\u5c0f\u6700\u5927\u652f\u630110M\uff01"),t},a.beforeUploadEnclosures=function(e){var t=e.size/1024/1024<10;return a.setState({enclosuresPercent:0}),t||m["a"].error("\u6587\u4ef6\u5927\u5c0f\u6700\u5927\u652f\u630110M\uff01"),t},a.beforeUploadPermits=function(e){var t=e.size/1024/1024<10;return a.setState({permitsPercent:0}),t||m["a"].error("\u6587\u4ef6\u5927\u5c0f\u6700\u5927\u652f\u630110M\uff01"),t},a.beforeUploadCertificates=function(e){var t=e.size/1024/1024<10;return a.setState({certificatesPercent:0}),t||m["a"].error("\u6587\u4ef6\u5927\u5c0f\u6700\u5927\u652f\u630110M\uff01"),t},a.handleChange=function(e){var t=e.file,r=e.fileList,n=a.state.logosPercent;if("uploading"===t.status)n<89?a.setState({logosPercent:n+10}):a.setState({logosPercent:99});else if("done"===t.status)a.setState({logosPercent:100});else if("error"===t.status)return a.setState({logosPercent:101},function(){return m["a"].error("\u4f01\u4e1alogo\u4e0a\u4f20\u5f02\u5e38\uff0c\u8bf7\u91cd\u8bd5")}),[];return r.map(function(e){return{uid:e.uid,name:e.name,status:"done",url:e.response?e.response.object.access_url:e.url}})},a.handleOnChangeEnclosures=function(e){var t=e.file,r=e.fileList,n=a.state.enclosuresPercent;if("uploading"===t.status)n<89?a.setState({enclosuresPercent:n+10}):a.setState({enclosuresPercent:99});else if("done"===t.status)a.setState({enclosuresPercent:100});else if("error"===t.status)return a.setState({enclosuresPercent:101},function(){return m["a"].error("\u8425\u4e1a\u6267\u7167\u4e0a\u4f20\u5f02\u5e38\uff0c\u8bf7\u91cd\u8bd5")}),[];return r.map(function(e){return{uid:e.uid,name:e.name,status:"done",url:e.response?e.response.object.access_url:e.url}})},a.handleOnChangePermits=function(e){var t=e.file,r=e.fileList,n=a.state.permitsPercent;if("uploading"===t.status)n<89?a.setState({permitsPercent:n+10}):a.setState({permitsPercent:99});else if("done"===t.status)a.setState({permitsPercent:100});else if("error"===t.status)return a.setState({permitsPercent:101},function(){return m["a"].error("\u8425\u4e1a\u8bb8\u53ef\u8bc1\u4e0a\u4f20\u5f02\u5e38\uff0c\u8bf7\u91cd\u8bd5")}),[];return r.map(function(e){return{uid:e.uid,name:e.name,status:"done",url:e.response?e.response.object.access_url:e.url}})},a.onRemoveEnclosures=function(){return a.setState({enclosuresPercent:0}),!0},a.onRemovePermits=function(){return a.setState({permitsPercent:0}),!0},a.onRemoveCertificates=function(){return a.setState({certificatesPercent:0}),!0},a.onRemoveLogo=function(){return a.setState({logosPercent:0}),!0},a.onSubmit=function(){a.props.global.user;var e=a.props.form.validateFields;e(function(e,t){if(!e){var r={enterpriseName:t.enterpriseName,regionid:t.regionid[t.regionid.length-1],street:t.street,contact:t.contact,industry:t.industry,linkman:t.linkman,nickname:t.nickname};if(t.logosList){var n=[];t.logosList.forEach(function(e){n.push({name:e.name,url:e.url,type:3})}),r["logosList"]=n}if(t.enclosuresList){var s=[];t.enclosuresList.forEach(function(e){s.push({name:e.name,url:e.url,type:0})}),r["enclosuresList"]=s}if(t.permitsList){var i=[];t.permitsList.forEach(function(e){i.push({name:e.name,url:e.url,type:1})}),r["permitsList"]=i}r.platformEnterpriseId=a.id,Object(Y["a"])(B["a"].modifyEnterprise.api(),{method:B["a"].modifyEnterprise.type,body:r}).then(function(e){0===e.code?(Q.a.push("/manage/information"),m["a"].success(e.msg)):m["a"].error(e.msg)})}})},a}return P()(t,e),g()(t,[{key:"componentDidMount",value:function(){var e=this;this.id=Number(this.props.location.query.id);var t=this.props.form.setFieldsValue;Object(Y["a"])(B["a"].getRegion.api()).then(function(a){if(0===a.code&&a.data.length){var r=Object(Z["b"])(a.data[0].children);e.setState({region:r},function(){e.id&&Object(X["c"])(e.id).then(function(a){a&&0===a.code?(a.data.regionid&&Object(Y["a"])(B["a"].findAllRegionById.api(a.data.regionid)).then(function(e){var r=[e.data.province.id,e.data.city.id,e.data.county.id],n=a.data,s=n.enterpriseName,i=n.contact,o=n.street,l=n.linkman,c=[],m=[];a.data.permitsList&&a.data.permitsList[0]&&a.data.permitsList[0].url&&(c=a.data.permitsList.map(function(e){return u()({},e,{status:"done",uid:e.url})})),a.data.enclosuresList&&a.data.enclosuresList[0]&&a.data.enclosuresList[0].url&&(m=a.data.enclosuresList.map(function(e){return u()({},e,{status:"done",uid:e.url})})),t({enterpriseName:s,contact:i,street:o,regionid:r,permitsList:c,enclosuresList:m,linkman:l})}),e.setState({data:a.data},function(){})):m["a"].error(a.msg)})})}else e.setState({region:null},function(){return m["a"].error("\u83b7\u53d6\u6240\u6709\u7701\u5e02\u533a\u5931\u8d25\uff1a"+a.msg)})})}},{key:"render",value:function(){var e=this.props.form,t=e.getFieldDecorator,a=e.resetFields,c=this.state,u=c.region,m=(c.industry,c.defaultRegion),p=(c.logosPercent,c.enclosuresPercent),d=c.permitsPercent;c.certificatesPercent,c.companyList;return S.a.createElement("div",{className:j.a.container},S.a.createElement("div",{className:j.a.top},S.a.createElement(l["a"],{className:j.a.breadcrumb},S.a.createElement(l["a"].Item,null,S.a.createElement(R.a,{to:"/home"},"\u9996\u9875")),S.a.createElement(l["a"].Item,null,"\u4f01\u4e1a\u7ba1\u7406"),S.a.createElement(l["a"].Item,null,S.a.createElement(R.a,{to:"/manage/information"},"\u4f01\u4e1a\u4fe1\u606f"))),S.a.createElement("span",{className:j.a.title},"\u4fee\u6539\u4f01\u4e1a\u4fe1\u606f")),S.a.createElement("div",{className:j.a.body},S.a.createElement("span",{className:j.a.boxTitle},"\u4f01\u4e1a\u4fe1\u606f"),S.a.createElement("div",{className:j.a.main},S.a.createElement(L["a"],{layout:"inline"},S.a.createElement(i["a"],{style:{marginTop:20}},S.a.createElement(A,{className:j.a.formitem,label:"\u516c\u53f8\u540d\u79f0"},t("enterpriseName",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u516c\u53f8\u540d\u79f0"}]})(S.a.createElement(o["a"],{style:{width:480},placeholder:"\u8bf7\u8f93\u5165\u516c\u53f8\u540d\u79f0"})))),S.a.createElement(i["a"],{style:{marginTop:20}},S.a.createElement(A,{className:j.a.formitem,label:"\u516c\u53f8\u5730\u5740"},t("regionid",{initialValue:m,rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u516c\u53f8\u5730\u5740"}]})(S.a.createElement(s["a"],{options:u,placeholder:"\u8bf7\u9009\u62e9\u516c\u53f8\u5730\u5740",style:{width:480}})))),S.a.createElement(i["a"],{style:{marginTop:20}},S.a.createElement(A,{className:j.a.formitem,label:"\u8be6\u7ec6\u5730\u5740"},t("street",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u8be6\u7ec6\u5730\u5740"}]})(S.a.createElement(o["a"],{style:{width:480},placeholder:"\u8bf7\u8f93\u5165\u8be6\u7ec6\u5730\u5740"})))),S.a.createElement(i["a"],{style:{marginTop:20}},S.a.createElement(A,{className:j.a.formitem,label:"\u516c\u53f8\u8054\u7cfb\u65b9\u5f0f"},t("contact",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u516c\u53f8\u8054\u7cfb\u65b9\u5f0f"}]})(S.a.createElement(o["a"],{style:{width:480},placeholder:"\u8bf7\u8f93\u5165\u516c\u53f8\u8054\u7cfb\u65b9\u5f0f"})))),S.a.createElement(i["a"],{style:{marginTop:20}},S.a.createElement(A,{className:j.a.formitem,label:"\u6307\u5b9a\u8054\u7cfb\u4eba"},t("linkman",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u8054\u7cfb\u4eba\u624b\u673a\u53f7"}]})(S.a.createElement(n["a"],{style:{width:480},placeholder:"\u8bf7\u8f93\u5165\u8054\u7cfb\u4eba\u624b\u673a\u53f7"})))),S.a.createElement(i["a"],{style:{marginTop:20}},S.a.createElement(A,{className:j.a.formitem,style:{display:"flex",alignItems:"center"},label:"\u8425\u4e1a\u6267\u7167"},t("enclosuresList",{valuePropName:"fileList",getValueFromEvent:this.handleOnChangeEnclosures,rules:[{required:!0,message:"\u8bf7\u4e0a\u4f20\u8425\u4e1a\u6267\u7167"}]})(S.a.createElement(M,{accept:"image/jpg, image/jpeg, image/png",percent:p,number:3,beforeUpload:this.beforeUploadEnclosures,onRemove:this.onRemoveEnclosures})))),S.a.createElement(i["a"],{style:{marginTop:20}},S.a.createElement(A,{className:j.a.formitem,style:{display:"flex",alignItems:"center"},label:"\u5f00\u6237\u8bb8\u53ef\u8bc1"},t("permitsList",{valuePropName:"fileList",getValueFromEvent:this.handleOnChangePermits})(S.a.createElement(M,{accept:"image/jpg, image/jpeg, image/png",percent:d,number:3,beforeUpload:this.beforeUploadCertificates,onRemove:this.onRemoveCertificates})))))),S.a.createElement("div",{className:j.a.footer},S.a.createElement(r["a"],{onClick:function(){return a()},style:{color:"#999999"}},"\u6e05\u7a7a"),S.a.createElement(r["a"],{onClick:this.onSubmit.bind(this),type:"primary",style:{backgroundColor:"#4875EC"}},"\u63d0\u4ea4"))))}}]),t}(w["Component"]),F=D))||F)||F)}}]);