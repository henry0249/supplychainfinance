(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{"+YQB":function(e,t,a){e.exports={container:"container___3chZl",header:"header___22goR",col:"col___1zxpP",name:"name___2MUv1",body:"body___onIn7",td:"td___z1cZc",newModal:"newModal___3QJAB",configModal:"configModal___19UNo",userModal:"userModal___2YdRr"}},OCaG:function(e,t,a){e.exports={body:"body___NCs9P",title:"title___2ToVo",top:"top___2C8-w",btnBox:"btnBox____Dejs",modal:"modal___2ILXw",panel:"panel___3rsL6",left:"left___3f8Uh",item:"item___3V2j_",label:"label___3FE1o",value:"value___1-72Z",delete:"delete___26lwe",active:"active___2e5Ki",add:"add___3cloL",right:"right___3TNaY",bottom:"bottom___3WEu8",checkPanel:"checkPanel___3vh8H"}},rTHH:function(e,t,a){"use strict";a.r(t);a("P2fV");var n,r,s,l,o,i,c,d,u,m=a("NJEC"),p=(a("+L6B"),a("2/Rp")),h=(a("Pwec"),a("CtXQ")),g=(a("sPJy"),a("bE4q")),f=(a("miYZ"),a("tsqr")),v=a("2Taf"),E=a.n(v),b=a("vZ4D"),y=a.n(b),k=a("l4Ni"),C=a.n(k),N=a("ujKo"),I=a.n(N),_=a("MhPg"),S=a.n(_),w=(a("OaEy"),a("2fM7")),R=(a("y8nQ"),a("Vl3Y")),x=a("q1tI"),M=a.n(x),P=a("ukGn"),D=a.n(P),T=a("3a4m"),O=a.n(T),U=a("wY1l"),V=a.n(U),j=a("bKel"),z=a.n(j),L=a("zP20"),B=(a("IzEo"),a("bx4M")),q=(a("14J3"),a("BMrR")),A=(a("g9YV"),a("wCAj")),H=(a("5Dmo"),a("3S7+")),Z=a("rZXm"),Y=a.n(Z),F=(n=R["a"].create(),z()(r=n((s=function(e){function t(){var e,a;E()(this,t);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return a=C()(this,(e=I()(t)).call.apply(e,[this].concat(r))),a.state={logs:[],logsPage:{currentPage:1,pageSize:10,totalPage:0,totalRecords:0}},a.getBaseLogs=function(e){Object(L["l"])(e).then(function(e){0===e.code?a.setState({logs:e.data,logsPage:e.page||{currentPage:1,pageSize:10,totalPage:0,totalRecords:0}}):a.setState({logs:[],logsPage:{currentPage:1,pageSize:10,totalPage:0,totalRecords:0}},function(){return f["a"].error("\u83b7\u53d6\u64cd\u4f5c\u65e5\u5fd7\u5931\u8d25\uff1a"+e.msg)})})},a}return S()(t,e),y()(t,[{key:"componentDidMount",value:function(){this.getBaseLogs(1)}},{key:"render",value:function(){var e=this,t=this.state,a=t.logs,n=t.logsPage,r=[{title:"\u64cd\u4f5c\u7c7b\u578b",dataIndex:"operateModuleType",key:"operateModuleType",width:"15%"},{title:"\u64cd\u4f5c\u4eba",dataIndex:"operatorName",key:"operatorName",width:"15%"},{title:"\u6743\u9650\u7ec4",dataIndex:"roleName",key:"roleName",width:"20%"},{title:"\u6267\u884c\u7ed3\u679c",dataIndex:"operateMsg",key:"operateMsg",render:function(e,t){return M.a.createElement(H["a"],{title:e},M.a.createElement("div",{className:Y.a.td},e))},width:"30%"},{title:"\u64cd\u4f5c\u65f6\u95f4",dataIndex:"operateTime",key:"operateTime",width:"20%"}];return M.a.createElement("div",{className:Y.a.body},M.a.createElement(B["a"],{title:"\u64cd\u4f5c\u65e5\u5fd7",bordered:!1,style:{marginBottom:24,paddingBottom:12}},M.a.createElement(q["a"],null,M.a.createElement(A["a"],{rowKey:"id",dataSource:a,columns:r,pagination:{size:"small",current:n.currentPage,pageSize:n.pageSize,total:n.totalRecords,onChange:function(t){return e.getBaseLogs(t)},showTotal:function(e,t){return"\u5171 ".concat(n.totalRecords," \u6761\u8bb0\u5f55 \u7b2c ").concat(n.currentPage," / ").concat(n.totalPage," \u9875")}}}))))}}]),t}(x["Component"]),r=s))||r)||r),G=(a("sRBo"),a("kaz8")),J=(a("jCWc"),a("kPKH")),K=(a("5NDa"),a("5rEg")),Q=(a("/zsF"),a("PArb")),X=(a("2qtc"),a("kLXV")),W=a("rlhR"),$=a.n(W),ee=a("+YQB"),te=a.n(ee),ae=R["a"].Item,ne=w["a"].Option,re=(l=R["a"].create(),z()(o=l((i=function(e){function t(){var e,a;E()(this,t);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return a=C()(this,(e=I()(t)).call.apply(e,[this].concat(r))),a.state={newVisible:!1,configVisible:!1,userVisible:!1,roles:[],rolesData:[],rolesPage:{currentPage:1,pageSize:5,totalPage:0,totalRecords:0},rolesModal:{},allOptions:[],options:[],selectedOptions:[],checkedValues:[],allUsers:[],users:[],selectedUsers:[],checkedUsers:[]},a.getRoles=function(e){var t=a.props.location.query.id;Object(L["e"])({currentPage:e,enterpriseId:t}).then(function(e){0===e.code?a.setState({rolesData:e.data,rolesPage:e.page}):f["a"].error("\u83b7\u53d6\u4f01\u4e1a\u4e0b\u6240\u6709\u6743\u9650\u7ec4\u5931\u8d25\uff1a"+e.msg)})},a.handleAddRole=function(){var e=a.props.form.validateFields,t=a.props.location.query.id,n=$()(a);e(["addRoleName","permissionId"],function(e,r){e||Object(L["a"])({enterpriseId:t,roleName:r.addRoleName,permissionId:r.permissionId}).then(function(e){0===e.code?a.setState({newVisible:!1},function(){f["a"].success("\u65b0\u5efa\u6743\u9650\u7ec4\u6210\u529f"),n.getRoles(1)}):f["a"].error("\u65b0\u5efa\u6743\u9650\u7ec4\u5931\u8d25\uff1a"+e.msg)})})},a.onCurrentChange=function(e){a.getRoles(e)},a.handleConfig=function(e){Object(L["i"])(e.roleId).then(function(t){0===t.code?a.setState({rolesModal:e,configVisible:!0,allOptions:t.data.allResource||[],options:t.data.allResource||[],selectedOptions:t.data.selectResource||[],checkedValues:t.data.chosenResourceIds||[]}):f["a"].error("\u83b7\u53d6\u53ef\u9009\u7b56\u7565\u5931\u8d25\uff1a"+t.msg)})},a.searchConfig=function(e){var t=a.state.allOptions,n=[];t.forEach(function(t){t.resourceName.indexOf(e)>-1&&n.push(t)}),a.setState({options:n})},a.checkboxChange=function(e,t){var n=a.state,r=n.options,s=n.selectedOptions,l=n.checkedValues;if(e){for(var o=0;o<r.length;o++)if(t===r[o].resourceId){s.push(r[o]),l.push(t);break}}else{for(var i=0;i<s.length;i++)if(t===s[i].resourceId){s.splice(i,1);break}for(var c=0;c<l.length;c++)if(t===l[c]){l.splice(c,1);break}}a.setState({selectedOptions:s,checkedValues:l})},a.saveConfig=function(){var e=a.props.form.validateFields,t=a.props.location.query.id,n=a.state,r=n.rolesModal,s=n.checkedValues,l={enterpriseId:t,resourceIds:s,roleId:r.roleId},o=$()(a);e(["roleName"],function(e,t){e||(l["roleName"]=t.roleName,Object(L["m"])(l).then(function(e){0===e.code?a.setState({configVisible:!1,rolesModal:{},allOptions:[],options:[],selectedOptions:[],checkedValues:[]},function(){f["a"].success("\u4fdd\u5b58\u914d\u7f6e\u6210\u529f"),o.getRoles(1)}):f["a"].error("\u4fdd\u5b58\u914d\u7f6e\u5931\u8d25\uff1a"+e.msg)}))})},a.handleUser=function(e){var t=a.props.location.query.id;Object(L["f"])({enterpriseId:t,roleId:e.roleId}).then(function(t){0===t.code?a.setState({rolesModal:e,userVisible:!0,allUsers:t.data.allUserList||[],users:t.data.allUserList||[],selectedUsers:t.data.checkUserList||[],checkedUsers:t.data.checkUserIds||[]}):f["a"].error("\u83b7\u53d6\u53ef\u9009\u7528\u6237\u5931\u8d25\uff1a"+t.msg)})},a.searchUser=function(e){var t=a.state.allUsers,n=[];t.forEach(function(t){t.userName.indexOf(e)>-1&&n.push(t)}),a.setState({users:n})},a.checkboxUsersChange=function(e,t){var n=a.state,r=n.users,s=n.selectedUsers,l=n.checkedUsers;if(e){for(var o=0;o<r.length;o++)if(t===r[o].userId){s.push(r[o]),l.push(t);break}}else{for(var i=0;i<s.length;i++)if(t===s[i].userId){s.splice(i,1);break}for(var c=0;c<l.length;c++)if(t===l[c]){l.splice(c,1);break}}a.setState({selectedUsers:s,checkedUsers:l})},a.saveUser=function(){a.props.form.validateFields;var e=a.props.location.query.id,t=a.state,n=t.rolesModal,r=t.checkedUsers,s={enterpriseId:e,checkUserIds:r,roleId:n.roleId},l=$()(a);Object(L["o"])(s).then(function(e){0===e.code?a.setState({userVisible:!1,rolesModal:{},allUsers:[],users:[],selectedUsers:[],checkedUsers:[]},function(){f["a"].success("\u4fdd\u5b58\u7528\u6237\u6743\u9650\u6210\u529f"),l.getRoles(1)}):f["a"].error("\u4fdd\u5b58\u7528\u6237\u6743\u9650\u5931\u8d25\uff1a"+e.msg)})},a.handleDeleteRole=function(e){var t=$()(a);X["a"].confirm({title:"\u5220\u9664\u540e\u8be5\u6743\u9650\u7ec4\u5c06\u65e0\u6cd5\u6062\u590d\uff01",content:"\u4f60\u8fd8\u8981\u7ee7\u7eed\u5417\uff1f",okText:"\u7ee7\u7eed",cancelText:"\u53d6\u6d88",onOk:function(){Object(L["c"])(e.roleId).then(function(e){0===e.code?(f["a"].success("\u5220\u9664\u6743\u9650\u7ec4\u6210\u529f"),t.getRoles(1)):f["a"].error("\u5220\u9664\u6743\u9650\u7ec4\u5931\u8d25\uff1a"+e.msg)})}})},a}return S()(t,e),y()(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.location.query.id;Object(L["j"])({id:t}).then(function(t){0===t.code?e.setState({roles:t.data}):f["a"].error("\u83b7\u53d6\u4f01\u4e1a\u4e0b\u6240\u6709\u4f01\u4e1a\u89d2\u8272\u5931\u8d25\uff1a"+t.msg)}),this.getRoles(1)}},{key:"render",value:function(){var e=this,t=this.props.form.getFieldDecorator,a=this.state,n=a.newVisible,r=a.configVisible,s=a.userVisible,l=a.roles,o=a.rolesData,i=a.rolesPage,c=a.rolesModal,d=a.options,u=a.selectedOptions,m=a.checkedValues,g=a.users,f=a.selectedUsers,v=a.checkedUsers,E=[{title:"\u6743\u9650\u7ec4\u540d\u79f0",dataIndex:"roleName",key:"roleName",width:"30%"},{title:"\u4f01\u4e1a\u89d2\u8272",dataIndex:"permissionName",key:"permissionName",width:"20%"},{title:"\u521b\u5efa\u65f6\u95f4",dataIndex:"createTime",key:"createTime",width:"20%"},{title:"\u64cd\u4f5c",key:"action",render:function(t,a,n){return M.a.createElement("div",null,M.a.createElement("span",{style:{color:"#1890ff",cursor:"pointer"},onClick:e.handleConfig.bind(e,a)},"\u914d\u7f6e"),M.a.createElement(Q["a"],{type:"vertical"}),M.a.createElement("span",{style:{color:"#1890ff",cursor:"pointer"},onClick:e.handleUser.bind(e,a)},"\u7528\u6237\u7ba1\u7406"),M.a.createElement(Q["a"],{type:"vertical"}),M.a.createElement("span",{style:{color:"#1890ff",cursor:"pointer"},onClick:e.handleDeleteRole.bind(e,a)},"\u5220\u9664"))},width:"30%"}];return M.a.createElement("div",{className:te.a.container},M.a.createElement("div",{className:te.a.body},M.a.createElement(q["a"],null,M.a.createElement(B["a"],{title:"\u6743\u9650\u7ec4",bordered:!1,style:{marginBottom:16}},M.a.createElement(q["a"],{type:"flex",justify:"end",style:{marginBottom:16}},M.a.createElement(p["a"],{onClick:function(){return e.setState({newVisible:!0})},type:"primary",icon:"plus"},"\u65b0\u5efa\u6743\u9650\u7ec4")),M.a.createElement(q["a"],null,M.a.createElement(A["a"],{rowKey:"roleId",dataSource:o,columns:E,pagination:{size:"small",current:i.currentPage,pageSize:i.pageSize,total:i.totalRecords,onChange:this.onCurrentChange.bind(this),showTotal:function(e,t){return"\u5171 ".concat(i.totalRecords," \u6761\u8bb0\u5f55 \u7b2c ").concat(i.currentPage," / ").concat(i.totalPage," \u9875")}}}))))),n?M.a.createElement(X["a"],{centered:!0,wrapClassName:te.a.newModal,title:"\u65b0\u5efa\u6743\u9650\u7ec4",visible:n,onOk:this.handleAddRole,onCancel:function(){return e.setState({newVisible:!1})}},M.a.createElement(R["a"],{layout:"inline"},M.a.createElement(ae,{label:"\u6743\u9650\u7ec4\u540d\u79f0",style:{marginBottom:16}},t("addRoleName",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6743\u9650\u7ec4\u540d\u79f0"}]})(M.a.createElement(K["a"],{allowClear:!1,style:{width:320},placeholder:"\u8bf7\u8f93\u5165"}))),M.a.createElement(ae,{label:"\u6240\u5c5e\u4f01\u4e1a\u89d2\u8272"},t("permissionId",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u6240\u5c5e\u4f01\u4e1a\u89d2\u8272"}]})(M.a.createElement(w["a"],{allowClear:!1,style:{width:320},placeholder:"\u8bf7\u9009\u62e9"},l.length&&0!==l.length&&l.map(function(e){return M.a.createElement(ne,{value:e.permissionId,key:e.permissionId},e.permissionName)})))))):null,M.a.createElement(X["a"],{centered:!0,title:"\u6743\u9650\u7ec4\u914d\u7f6e",visible:r,wrapClassName:te.a.configModal,width:900,onOk:this.saveConfig,onCancel:function(){return e.setState({configVisible:!1})}},M.a.createElement(R["a"],{layout:"inline",hideRequiredMark:!0},M.a.createElement(q["a"],{gutter:24,style:{marginBottom:24}},M.a.createElement(J["a"],{span:12},M.a.createElement(ae,{label:"\u6743\u9650\u7ec4\u540d\u79f0"},t("roleName",{initialValue:c.roleName,rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6743\u9650\u7ec4\u540d\u79f0"}]})(M.a.createElement(K["a"],{allowClear:!1,style:{width:280},placeholder:"\u8bf7\u8f93\u5165"})))),M.a.createElement(J["a"],{span:12},M.a.createElement(ae,{label:"\u6240\u5c5e\u4f01\u4e1a\u89d2\u8272"},c.permissionName))),M.a.createElement(q["a"],{gutter:24,style:{marginBottom:16}},M.a.createElement(J["a"],{span:12},M.a.createElement(ae,{label:"\u53ef\u9009\u7b56\u7565\uff08\u5171".concat(d.length,"\u6761\uff09")},M.a.createElement(K["a"].Search,{allowClear:!1,style:{width:223},placeholder:"\u8bf7\u8f93\u5165\u7b56\u7565\u540d\u79f0",onSearch:function(t){return e.searchConfig(t)}})))),M.a.createElement(q["a"],{gutter:24},M.a.createElement(J["a"],{span:12},M.a.createElement(B["a"],{title:M.a.createElement(q["a"],{style:{padding:"0 8px 0 24px",fontSize:14}},M.a.createElement(J["a"],{span:12},"\u6a21\u5757"),M.a.createElement(J["a"],{span:12},"\u6743\u9650"))},d.map(function(t){return M.a.createElement(G["a"],{onChange:function(a){return e.checkboxChange(a.target.checked,t.resourceId)},checked:m.includes(t.resourceId),key:t.resourceId},M.a.createElement(q["a"],null,M.a.createElement(J["a"],{span:12},t.parentName),M.a.createElement(J["a"],{span:12},t.resourceName)))}))),M.a.createElement(J["a"],{span:12},M.a.createElement(B["a"],{title:M.a.createElement(q["a"],{style:{fontSize:14}},M.a.createElement(J["a"],{span:10},"\u6a21\u5757"),M.a.createElement(J["a"],{span:10},"\u6743\u9650"),M.a.createElement(J["a"],{span:4},"\u64cd\u4f5c"))},u.map(function(t){return M.a.createElement(q["a"],{style:{marginBottom:12},key:t.resourceId},M.a.createElement(J["a"],{span:10},t.parentName),M.a.createElement(J["a"],{span:10},t.resourceName),M.a.createElement(J["a"],{span:4},M.a.createElement(h["a"],{onClick:e.checkboxChange.bind(e,!1,t.resourceId),type:"close",style:{fontSize:14,cursor:"pointer"}})))})))))),M.a.createElement(X["a"],{centered:!0,title:"\u7528\u6237\u7ba1\u7406",visible:s,wrapClassName:te.a.userModal,width:900,onOk:this.saveUser,onCancel:function(){return e.setState({userVisible:!1})}},M.a.createElement(R["a"],{layout:"inline",hideRequiredMark:!0},M.a.createElement(q["a"],{gutter:24,style:{marginBottom:24}},M.a.createElement(J["a"],{span:12},M.a.createElement(ae,{label:"\u6743\u9650\u7ec4\u540d\u79f0"},c.roleName)),M.a.createElement(J["a"],{span:12},M.a.createElement(ae,{label:"\u6240\u5c5e\u4f01\u4e1a\u89d2\u8272"},c.permissionName))),M.a.createElement(q["a"],{gutter:24,style:{marginBottom:16}},M.a.createElement(J["a"],{span:12},M.a.createElement(ae,{label:"\u53ef\u9009\u7528\u6237\uff08\u5171".concat(g.length||0,"\u6761\uff09")},M.a.createElement(K["a"].Search,{allowClear:!1,style:{width:223},placeholder:"\u8bf7\u8f93\u5165\u7528\u6237\u540d\u79f0",onSearch:function(t){return e.searchUser(t)}})))),M.a.createElement(q["a"],{gutter:24},M.a.createElement(J["a"],{span:12},M.a.createElement(B["a"],{title:M.a.createElement(q["a"],{style:{padding:"0 8px 0 24px",fontSize:14}},M.a.createElement(J["a"],{span:24},"\u7528\u6237\u540d\u79f0"))},g.map(function(t){return M.a.createElement(G["a"],{onChange:function(a){return e.checkboxUsersChange(a.target.checked,t.userId)},checked:v.includes(t.userId),key:t.userId},M.a.createElement(q["a"],null,M.a.createElement(J["a"],{span:24},t.userName)))}))),M.a.createElement(J["a"],{span:12},M.a.createElement(B["a"],{title:M.a.createElement(q["a"],{style:{fontSize:14}},M.a.createElement(J["a"],{span:20},"\u7528\u6237\u540d\u79f0"),M.a.createElement(J["a"],{span:4},"\u64cd\u4f5c"))},f.map(function(t){return M.a.createElement(q["a"],{style:{marginBottom:12},key:t.userId},M.a.createElement(J["a"],{span:20},t.userName),M.a.createElement(J["a"],{span:4},M.a.createElement(h["a"],{onClick:e.checkboxUsersChange.bind(e,!1,t.userId),type:"close",style:{fontSize:14,cursor:"pointer"}})))})))))))}}]),t}(x["Component"]),o=i))||o)||o),se=a("jehZ"),le=a.n(se),oe=a("p0pE"),ie=a.n(oe),ce=a("gWZ8"),de=a.n(ce),ue=(a("+BJd"),a("mr32")),me=a("OCaG"),pe=a.n(me),he=w["a"].Option,ge=z()((d=function(e){function t(e){var a;return E()(this,t),a=C()(this,I()(t).call(this,e)),a.handleSearch=function(e){a.getApprovalManagementList()},a.hideModal=function(){a.setState({visible:!1})},a.save=function(){var e=a.state,t=e.levels,n=e.processDesc,r=e.processType,s=e.inLoan,l={processDesc:n,processType:r};l.id=a.id;var o=!1;l.list=t.map(function(e){return e.value&&e.value.roleId?void 0===e.enable&&(o=e.processNodeDesc+"\u672a\u8bbe\u7f6e\u542f\u505c"):o=e.processNodeDesc+"\u672a\u9009\u62e9\u6743\u9650\u7ec4",{processNodeCode:e.processNodeCode,processNodeDesc:e.processNodeDesc,roleId:e.value&&void 0!==e.value.roleId?e.value.roleId:null,enable:e.enable}}),0===s&&o?f["a"].error("".concat(o)):Object(L["b"])(l).then(function(e){0===e.code?(f["a"].success(e.msg),a.getApprovalManagementList(),a.setState({visible:!1})):f["a"].error(e.msg)})},a.tagDelete=function(e,t){a.onChange(e,t.levelIndex,!1)},a.deleteRow=function(e){var t=de()(a.state.permissions),n=de()(a.state.levels);n=n.slice(0,-1),t=t.map(function(t){return e===t.processNodeCode?ie()({},t,{processNodeCode:null}):t}),a.setState({permissions:t,levels:n})},a.state={currentPage:1,pageSize:10,totalPage:0,totalRecords:0,params:{},visible:!1,modifyId:null,list:[],detail:{},permissions:[],levels:[],processDesc:"",activeCode:0,processType:"",inLoan:0,enable:!1},a.chineseText={0:"\u4e00",1:"\u4e8c",2:"\u4e09",3:"\u56db",4:"\u4e94"},a}return S()(t,e),y()(t,[{key:"componentDidMount",value:function(){this.id=this.props.location.query.id,this.id||(f["a"].error("\u8bf7\u5148\u9009\u62e9\u4f01\u4e1a"),this.props.history.goback()),this.getApprovalManagementList(this.id)}},{key:"getApprovalManagementList",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.id;Object(L["h"])({id:t}).then(function(t){t&&0===t.code&&e.setState({list:t.data})})}},{key:"getApprovalManagementDetail",value:function(e){var t=this;Object(L["g"])({processType:e,id:this.id}).then(function(e){0===e.code?(t.dataHandle(e.data),t.setState({visible:!0})):f["a"].error(e.msg)})}},{key:"dataHandle",value:function(e){var t=e.levels,a=e.permissions;t=t&&t.length?t.map(function(e){var t={};return void 0!==e.nodeAuditRoleId?(a=a.map(function(a,n){return e.nodeAuditRoleId===a.roleId?(t.roleId=a.roleId,t.roleName=a.roleName,t.levelIndex=n,ie()({},a,{processNodeCode:e.processNodeCode})):a}),ie()({},e,{value:t})):e}):[{processNodeCode:0,processNodeDesc:"\u4e00\u7ea7\u5ba1\u6279"}],this.setState({permissions:a,levels:t,enable:t[0]&&t[0].enable||void 0})}},{key:"enableChange",value:function(e,t){var a=de()(this.state.levels);a[e].enable=t,this.setState({levels:a})}},{key:"onChange",value:function(e,t,a){var n=de()(this.state.permissions),r=de()(this.state.levels);a?(n=n.map(function(t){return t.processNodeCode===e?ie()({},t,{processNodeCode:null}):t}),n[t]=ie()({},n[t],{processNodeCode:e}),r[e]=ie()({},r[e],{value:{roleId:n[t].roleId,roleName:n[t].roleName,levelIndex:t}})):(n[t]=ie()({},n[t],{processNodeCode:null}),r[e]=ie()({},r[e],{value:{}})),this.setState({permissions:n,levels:r})}},{key:"searchChange",value:function(e,t){var a=this.state.params;a[e]=t,this.setState({params:a})}},{key:"toHandle",value:function(e){this.getApprovalManagementDetail(e.processType),this.setState({processType:e.processType,processDesc:e.processDesc,inLoan:e.inLoan})}},{key:"addRow",value:function(){var e=de()(this.state.levels);e.push({processNodeCode:e.length,processNodeDesc:"".concat(this.chineseText[e.length],"\u7ea7\u5ba1\u6279")}),this.setState({levels:e})}},{key:"itemClick",value:function(e,t){this.setState({activeCode:e,enable:t})}},{key:"render",value:function(){var e=this,t=this.state,a=t.list,n=t.levels,r=t.permissions,s=t.processDesc,l=t.activeCode,o=t.inLoan,i=t.enable,c=[{title:"\u5ba1\u6279\u540d\u79f0",dataIndex:"processDesc",key:"processDesc"},{title:"\u4fee\u6539\u65f6\u95f4",dataIndex:"modifyTime",key:"modifyTime"},{title:"\u64cd\u4f5c",key:"action",render:function(t,a,n){return M.a.createElement("div",null,M.a.createElement("a",{onClick:function(){return e.toHandle(a)}},"\u914d\u7f6e"))}}];return M.a.createElement("div",{className:pe.a.body},M.a.createElement("div",{className:pe.a.title},"\u5ba1\u6279\u7ba1\u7406\u914d\u7f6e"),M.a.createElement(A["a"],{style:{marginTop:"30px"},columns:c,dataSource:a,rowKey:function(e,t){return t},pagination:!1}),M.a.createElement(X["a"],{title:"\u5ba1\u6279\u7ba1\u7406\u914d\u7f6e",visible:this.state.visible,onOk:this.save,onCancel:this.hideModal,centered:!0,okText:"\u786e\u8ba4",cancelText:"\u53d6\u6d88",width:878,wrapClassName:pe.a.modal},M.a.createElement("div",null,"\u5ba1\u6279\u540d\u79f0:",s),M.a.createElement("div",{className:pe.a.panel},M.a.createElement("div",{className:pe.a.left},n.length?n.map(function(t,a){return M.a.createElement(ve,le()({itemClick:e.itemClick.bind(e,t.processNodeCode,t.enable),inLoan:o,enableChange:e.enableChange.bind(e,a),enable:t.enable,activeCode:l,tagDelete:e.tagDelete},t,{key:t.processNodeCode,isLast:0!==a&&a+1===n.length,deleteRow:e.deleteRow.bind(e),value:t.value||{}}))}):null,n.length<5&&1===o?M.a.createElement("div",{className:pe.a.add,onClick:this.addRow.bind(this)}," + \xa0\u6dfb\u52a0"):null),M.a.createElement("div",{className:pe.a.right},M.a.createElement("div",{className:pe.a.top},M.a.createElement("div",{className:pe.a.label},"\u53ef\u9009\u6743\u9650\u7ec4 \u5171(",r.length||0,")\u6761:")),M.a.createElement("div",{className:pe.a.bottom},M.a.createElement("div",{className:pe.a.title},"\u6743\u9650\u7ec4\u540d\u79f0"),M.a.createElement("div",{className:pe.a.checkPanel},r.length?r.map(function(t,a){return M.a.createElement(G["a"],{className:pe.a.checkbox,checked:0===t.processNodeCode||t.processNodeCode>0,disabled:(0===t.processNodeCode||t.processNodeCode>0)&&t.processNodeCode!==l||2===i,onChange:function(t){return e.onChange(l,a,t.target.checked)}},t.roleName)}):null))))))}}]),t}(x["Component"]),c=d))||c,fe=[{value:0,label:"\u672a\u542f\u7528",disabled:!1},{value:1,label:"\u542f\u7528",disabled:!1},{value:2,label:"\u542f\u7528",disabled:!0}],ve=function(e){var t=e.activeCode,a=e.processNodeCode,n=e.processNodeDesc,r=e.value,s=void 0===r?{}:r,l=e.tagDelete,o=e.itemClick,i=e.isLast,c=void 0===i||i,d=e.deleteRow,u=e.enableChange,m=e.enable,p=e.inLoan;return M.a.createElement("div",{onClick:function(){return o()},className:"".concat(pe.a.item," ").concat(t===a?pe.a.active:"")},M.a.createElement("div",{className:pe.a.label},n,":"),M.a.createElement("div",{className:pe.a.value},s.roleName?M.a.createElement(ue["a"],{closable:2!==m,onClose:function(){return l(a,s)}},s.roleName):null),0===p?M.a.createElement(w["a"],{style:{width:90},onSelect:u,placeholder:"",value:m,disabled:2===m},fe&&fe.map(function(e){return M.a.createElement(he,{disabled:e.disabled,value:e.value,key:e.value},e.label)})):M.a.createElement("div",{className:pe.a["delete"]},c?M.a.createElement(h["a"],{onClick:function(e){e.stopPropagation(),d(a)},width:30,height:30,type:"delete"}):null))};a.d(t,"default",function(){return ye});var Ee=R["a"].Item,be=w["a"].Option,ye=z()(u=function(e){function t(e){var a;return E()(this,t),a=C()(this,I()(t).call(this,e)),a.state={showSave:!1,currentPage:1,pageSize:10,totalPage:0,totalRecords:0,cloumns:[],cloumnsData:null,triggerTypes:[],data:{businessMode:0,subjectName:""},goods:[{name:"\u5168\u90e8",key:0},{name:"\u6838\u5fc3\u4f01\u4e1a",key:1},{name:"\u8d27\u4ee3\u516c\u53f8",key:2},{name:"\u7ed3\u7b97\u7ba1\u7406",key:3}]},a.id=e.location.query.id||!1,a.enterpriseName=e.location.query.enterpriseName||!1,a}return S()(t,e),y()(t,[{key:"componentDidMount",value:function(){this.dataInit()}},{key:"dataInit",value:function(){var e=this;Object(L["d"])().then(function(t){return 0===t.code&&e.setState({allPermissons:t.data}),!1}).then(function(){Object(L["j"])({id:e.id}).then(function(t){if(0===t.code&&t.data&&t.data.length){var a=t.data.map(function(e){return{key:e.permissionId,label:e.permissionName}});e.setState({permissions:a})}})})}},{key:"getTriggerType",value:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,a=arguments.length>1?arguments[1]:void 0;getTriggerType(t).then(function(t){1===t.code?e.setState({cloumns:t.data},function(){a&&a()}):e.setState({cloumns:[]})})})},{key:"findLowGradeConfig",value:function(e){function t(t,a){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e,t){var a=this;findLowGradeConfig(e).then(function(e){if(1===e.code){var n={};e.data.updateColumnInfo&&e.data.updateColumnInfo.length&&(n=ke(e.data.updateColumnInfo)),a.setState({cloumnsData:n,data:{businessMode:e.data.businessMode,subjectName:e.data.subjectName}},function(){t&&t(e.data.businessMode)})}else a.setState({cloumns:[]})})})},{key:"permissionChange",value:function(e){this.setState({permissions:e,showSave:!0})}},{key:"cloumnsChange",value:function(e,t,a){var n=this.state.cloumnsData;n["data".concat(e)][t]=a,this.setState({cloumnsData:n})}},{key:"save",value:function(){var e=this,t=this.state.permissions,a={enterpriseId:this.id};a.permissionIds=t.map(function(e){return e.key}),Object(L["n"])(a).then(function(t){0===t.code?(f["a"].success(t.msg),e.setState({showSave:!1})):f["a"].error(t.msg)})}},{key:"render",value:function(){var e=this,t=this.state,a=t.showSave,n=t.allPermissons,r=t.permissions;return M.a.createElement("div",{className:D.a.container},M.a.createElement("div",{className:D.a.crumb},M.a.createElement(g["a"],{className:D.a.breadcrumb},M.a.createElement(g["a"].Item,null,M.a.createElement(V.a,{to:"/enterpriseConfig"},"\u4f01\u4e1a\u5217\u8868")),M.a.createElement(g["a"].Item,null,"\u4f01\u4e1a\u8be6\u60c5")),M.a.createElement("div",{className:D.a.title},M.a.createElement(h["a"],{style:{fontSize:28},type:"home",theme:"twoTone"}),M.a.createElement("span",{className:D.a.name},this.enterpriseName),M.a.createElement("div",{className:D.a.btnBox},M.a.createElement(m["a"],{title:"\u9000\u51fa\u540e\u5185\u5bb9\u5c06\u4e0d\u80fd\u4fdd\u5b58",okText:"\u786e\u5b9a",cancelText:"\u53d6\u6d88",onConfirm:function(){O.a.push("/enterpriseConfig")}},M.a.createElement(p["a"],{type:"default",size:"large"},"\u8fd4 \u56de")))),M.a.createElement(R["a"],{className:D.a.topForm,layout:"inline"},M.a.createElement(Ee,{label:"\u4f01\u4e1a\u89d2\u8272"},M.a.createElement(w["a"],{style:{width:500,marginRight:15},placeholder:"\u8bf7\u9009\u62e9\u6807\u7684\u7269\u7c7b\u578b",onChange:function(t){return e.permissionChange(t)},value:r||[],mode:"multiple",labelInValue:!0},n&&n.length>0?n.map(function(e){return M.a.createElement(be,{key:e.permissionId,value:e.permissionId},e.permissionName)}):null),M.a.createElement(p["a"],{type:"primary",onClick:this.save.bind(this),disabled:!a},"\u4fdd\u5b58")))),M.a.createElement(re,null),M.a.createElement(ge,null),M.a.createElement(F,null))}}]),t}(x["Component"]))||u,ke=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t={};return e.forEach(function(e){t["data".concat(e.updateColumnId)]={triggerGrade:e.triggerGrade,triggerType:void 0!==e.triggerType?e.triggerType+"":"",updateColumnId:e.updateColumnId,updateContent:e.updateContent}}),t}},rZXm:function(e,t,a){e.exports={body:"body___2QH-P",td:"td___3Iss1"}}}]);