(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[30],{"0lJ+":function(e,t,a){e.exports={title:"title___pnBfr"}},"3sdX":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=void 0;var n=function(){return window.g_app._store.getState().routing.location.query.busMode},r=function(){var e=sessionStorage.businessMode||n();return"0"===e?"processScheduleBuy":"1"===e?"processScheduleSale":"2"===e?"processScheduleStorage":"largeProcessScheduleBuy"},o={incoming:{next:function(e){return"1"===e?"/incoming":"/orderManage/index"},api:function(e){return"/supplychainfinance-input/".concat(r(),"/getFlowChart?applyId=").concat(e)},from:"/incoming",fromText:"\u8fdb\u4ef6\u7ba1\u7406"},projectApproval:{next:function(e){return"1"===e?"/approval/projectapproval/index":"/orderManage/index"},api:function(e){return"/supplychainfinance-input/".concat(r(),"/getFlowChart?applyId=").concat(e)},from:"/approval/projectapproval/index",fromText:"\u5ba1\u6279\u7ba1\u7406"},bail:{next:function(e){return"1"===e?"/approval/bail/index":"/orderManage/index"},api:function(e){return"/supplychainfinance-audit/".concat(0==sessionStorage.businessMode?"buyBondProof":1==sessionStorage.businessMode?"saleBondProof":"largeBuyBondProof","/record?bondId=").concat(e)},from:"/approval/bail/index",fromText:"\u5ba1\u6279\u7ba1\u7406"},goods:{next:function(e){return"1"===e?"/approval/goods/index":"/orderManage/index"},api:function(e){return"/supplychainfinance-audit/".concat(0==sessionStorage.businessMode?"buyPickUpApply":"storagePickUpApply","/record?pickUpApplyId=").concat(e)},from:"/approval/goods/index",fromText:"\u5ba1\u6279\u7ba1\u7406"},deferred:{next:function(e){return"1"===e?"/approval/deferred/index":"/orderManage/index"},api:function(e){return"/supplychainfinance-audit/audit/".concat(0==sessionStorage.businessMode?"buy":"storage","/delay/record?delayApplyId=").concat(e)},from:"/approval/deferred/index",fromText:"\u5ba1\u6279\u7ba1\u7406"},warehouse:{next:function(e){return"1"===e?"/approval/warehouse/index":"/orderManage/index"},api:function(e){return"/supplychainfinance-audit/storageStorehouseBillProof/record?storehouseId=".concat(e)},from:"/approval/warehouse/index",fromText:"\u5ba1\u6279\u7ba1\u7406"},settlement:{next:function(e){return"1"===e?"/approval/settlement/index":"/orderManage/index"},api:function(e){return"/supplychainfinance-audit/".concat(0==sessionStorage.businessMode?"buyAccounts":1==sessionStorage.businessMode?"saleAccounts":2==sessionStorage.businessMode?"storageAccounts":"largeBuyAccounts","/record?orderId=").concat(e)},from:"/approval/settlement/index",fromText:"\u5ba1\u6279\u7ba1\u7406"},contract:{next:function(e){return"1"===e?"/approval/contract/index":"/orderManage/index"},api:function(e){return"/supplychainfinance-audit/".concat(0==sessionStorage.businessMode?"buyContractExamine":1==sessionStorage.businessMode?"saleContractExamine":2==sessionStorage.businessMode?"storageContractExamine":"largeBuyContractExamine","/record?contractId=").concat(e)},from:"/approval/contract/index",fromText:"\u5ba1\u6279\u7ba1\u7406"}},l=o;t["default"]=l},"4hVg":function(e,t,a){"use strict";var n=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.getResult=i;var r=n(a("d6i3")),o=n(a("1l/V")),l=n(a("t3Un")),s=n(a("3sdX"));function i(){return u.apply(this,arguments)}function u(){return u=(0,o["default"])(r["default"].mark(function e(){var t,a=arguments;return r["default"].wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=a.length>0&&void 0!==a[0]?a[0]:{},e.abrupt("return",(0,l["default"])(s["default"][t.type].api(t.id),{}));case 2:case"end":return e.stop()}},e)})),u.apply(this,arguments)}},ALo4:function(e,t,a){"use strict";var n=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=c;var r=n(a("jehZ"));a("Pwec");var o=n(a("CtXQ")),l=n(a("Y/ft")),s=n(a("q1tI")),i=n(a("TSYQ")),u=n(a("hDW5"));function c(e){var t=e.className,a=e.type,n=e.title,c=e.description,d=e.extra,f=e.actions,p=(0,l["default"])(e,["className","type","title","description","extra","actions"]),m={error:s["default"].createElement(o["default"],{className:u["default"].error,type:"close-circle",theme:"filled"}),success:s["default"].createElement(o["default"],{className:u["default"].success,type:"check-circle",theme:"filled"})},g=(0,i["default"])(u["default"].result,t);return s["default"].createElement("div",(0,r["default"])({className:g},p),s["default"].createElement("div",{className:u["default"].icon},m[a]),s["default"].createElement("div",{className:u["default"].title},n),c&&s["default"].createElement("div",{className:u["default"].description},c),d&&s["default"].createElement("div",{className:u["default"].extra},d),f&&s["default"].createElement("div",{className:u["default"].actions},f))}},QbCb:function(e,t,a){"use strict";var n=a("g09b"),r=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=void 0,a("IzEo");var o=n(a("bx4M"));a("+L6B");var l=n(a("2/Rp"));a("14J3");var s=n(a("BMrR"));a("jCWc");var i=n(a("kPKH"));a("FJo9");var u,c,d=n(a("L41K")),f=n(a("2Taf")),p=n(a("vZ4D")),m=n(a("l4Ni")),g=n(a("ujKo")),y=n(a("MhPg")),x=r(a("q1tI")),v=n(a("ALo4")),h=n(a("zHco")),b=a("4hVg"),E=n(a("bKel")),_=n(a("3sdX")),M=n(a("wY1l")),S=n(a("0lJ+")),w=(0,E["default"])((c=function(e){function t(e){var a;return(0,f["default"])(this,t),a=(0,m["default"])(this,(0,g["default"])(t).call(this,e)),a.componentDidMount=function(){var e=a.props.location.query,t=e.type,n=e.id,r=e.isManage;_["default"][t]&&(0,b.getResult)({id:n,type:t,isManage:r}).then(function(e){0===e.code&&a.setState({data:e.data})})},a.state={data:{list:[]}},a}return(0,y["default"])(t,e),(0,p["default"])(t,[{key:"render",value:function(){var e=this,t=this.state.data,a=t.list,n=this.props.location.query,r=n.type,u=n.status,c=n.isManage,f=d["default"].Step,p=function(e){return x["default"].createElement("div",{style:{fontSize:12,color:"rgba(0, 0, 0, 0.45)",position:"relative",left:42,textAlign:"left"}},x["default"].createElement("div",{style:{margin:"8px 0 4px"}},x["default"].createElement("span",null,e.modifier)),x["default"].createElement("div",null,e.modifyTime))},m=t?x["default"].createElement(x.Fragment,null,x["default"].createElement("div",{style:{fontSize:16,color:"rgba(0, 0, 0, 0.85)",fontWeight:"600",marginBottom:20,marginTop:60}},t.entrustCompany),x["default"].createElement(s["default"],{style:{marginBottom:16}},x["default"].createElement(i["default"],{xs:24,sm:12,md:12,lg:12,xl:6},x["default"].createElement("span",{style:{color:"rgba(0, 0, 0, 0.85)"}},"\u9879\u76eeID\uff1a",t.orderBusinessId)),x["default"].createElement(i["default"],{xs:24,sm:12,md:12,lg:12,xl:6},x["default"].createElement("span",{style:{color:"rgba(0, 0, 0, 0.85)"}},"\u521b\u5efa\u4eba\uff1a",t.creator)),x["default"].createElement(i["default"],{xs:24,sm:24,md:24,lg:24,xl:12},x["default"].createElement("span",{style:{color:"rgba(0, 0, 0, 0.85)"}},"\u521b\u5efa\u65f6\u95f4\uff1a",t.createTime))),a?a.length>0&&x["default"].createElement(d["default"],{style:{marginLeft:-42,width:"calc(100% + 84px)"},progressDot:!0},a.map(function(e,t){if(t<4)return x["default"].createElement(f,{key:t,title:x["default"].createElement("span",{style:{fontSize:14}},e.operateStatusName),status:1===e.isPassStatus?"finish":"wait",description:p(e)})})):"",a?a.length>3&&x["default"].createElement(d["default"],{style:{marginLeft:-42,marginTop:42,width:"calc(100% + 84px)"},progressDot:!0},a.map(function(e,t){if(t>3)return x["default"].createElement(f,{key:t,title:x["default"].createElement("span",{style:{fontSize:14}},e.operateStatusName),status:1===e.isPassStatus?"finish":"wait",description:p(e)})})):""):null,g=x["default"].createElement(x.Fragment,null,x["default"].createElement(l["default"],{type:"primary",onClick:function(){e.props.history.push(_["default"][r].next(c)||"/home")}},"\u8fd4\u56de\u5217\u8868")),y=function(){return x["default"].createElement("span",{className:S["default"].title},x["default"].createElement(M["default"],{to:_["default"][r]&&_["default"][r].from||"/home"},_["default"][r]&&_["default"][r].fromText)," ","/ ",0===Number(u)?"\u63d0\u4ea4\u6210\u529f":"\u9000\u56de\u6210\u529f")};return x["default"].createElement(h["default"],{title:y()},x["default"].createElement(o["default"],{bordered:!1,style:{margin:30},bodyStyle:{height:830,position:"relative"}},r?x["default"].createElement(v["default"],{type:"success",title:0===Number(u)?"\u63d0\u4ea4\u6210\u529f":"\u9000\u56de\u6210\u529f",extra:m,actions:g,style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}):x["default"].createElement("div",null,x["default"].createElement("p",null,"\u4fe1\u606f\u4e22\u5931\u4e86~"),x["default"].createElement(l["default"],{type:"primary",onClick:function(){e.props.history.push("/home")}},"\u8fd4\u56de\u9996\u9875"))))}}]),t}(x.Component),u=c))||u;t["default"]=w},hDW5:function(e,t,a){e.exports={result:"result___-kQbe",icon:"icon___2T7sR",success:"success___RWG-E",error:"error___2tfXR",title:"title___1HWVQ",description:"description___u444q",extra:"extra___3zoMN",actions:"actions___3ePM_"}}}]);