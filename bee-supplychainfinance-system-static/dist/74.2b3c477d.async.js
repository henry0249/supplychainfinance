(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[74],{lN8E:function(e,t,r){"use strict";var a=r("g09b"),d=r("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=void 0;var i=a(r("p0pE"));r("miYZ");var o=a(r("tsqr")),s=a(r("2Taf")),n=a(r("vZ4D")),u=a(r("l4Ni")),c=a(r("ujKo")),l=a(r("rlhR")),p=a(r("MhPg"));r("y8nQ");var y=a(r("Vl3Y"));r("OaEy");var f=a(r("2fM7"));r("5NDa");var g,h,v,m,I=a(r("5rEg")),b=d(r("q1tI")),P=r("Hg0r"),w=a(r("3a4m")),F=r("zHmJ"),C=r("dtw8"),k=(a(r("hx5r")),a(r("wd/R"))),D=(I["default"].Group,f["default"].Option,g=y["default"].create(),h=(0,P.connect)(function(e){var t=e.incomingstep;e.loading;return{incomingstep:t}}),(0,C.withRouter)(v=g(v=h((m=function(e){function t(e){var r;return(0,s["default"])(this,t),r=(0,u["default"])(this,(0,c["default"])(t).call(this,e)),r.getIsProved=function(e,t,a){r.setState({isProved:e,isCompanyProved:t},function(){a&&a(r.state.isProved,r.state.isCompanyProved)})},r.addressChange=function(e){r.setState({takeGoodsAddress:e})},r.onValidateForm=function(e,t){var a=r.state,d=(a.getData,a.editPrice),s=r.props.form,n=(s.getFieldDecorator,s.validateFields),u=(s.getFieldValue,r.props.location.query),c=u.type,p=u.applyId,y=u.id,f=u.entrustBuyId,g=r.props,h=g.dispatch,v=g.incomingstep,m=(0,l["default"])(r),I=r.props.form.getFieldsValue(["hasGuarantor","hasFreight"]);n(function(a,s){if("save"===e)a=!1,s=r.props.form.getFieldsValue();else{if("w"===c&&(!v.buyFirstPartTwo.freightForwardCreditId||1!==m.state.isCompanyProved))return t&&t(),void o["default"].error("\u8bf7\u9a8c\u8bc1\u8d27\u4ee3\u516c\u53f8");if("s"===c){var n=m.props.form.getFieldValue("paymentProvision");if("1"===n&&(!v.buyFirstPartTwo.freightForwardCreditId||1!==m.state.isCompanyProved))return t&&t(),void o["default"].error("\u8bf7\u9a8c\u8bc1\u8d27\u4ee3\u516c\u53f8")}if("1"===I.hasFreight&&(!v.buyFirstPartTwo.freightForwardCreditId||1!==m.state.isCompanyProved))return t&&t(),void o["default"].error("\u8bf7\u9a8c\u8bc1\u8d27\u4ee3\u516c\u53f8");if("1"===I.hasGuarantor&&(!v.buyFirstPartTwo.guarantorCreditId||1!==m.state.isProved))return t&&t(),void o["default"].error("\u8bf7\u9a8c\u8bc1\u62c5\u4fdd\u4f01\u4e1a");if("p"===c||"L"===c){if(!r.props.form.getFieldValue("deliveryAddress"))return t&&t(),void o["default"].error("\u8bf7\u9009\u62e9\u53d1\u8d27\u5730");if(!r.props.form.getFieldValue("takeGoodsAddress"))return t&&t(),void o["default"].error("\u8bf7\u9009\u62e9\u6536\u8d27\u5730")}}if(a){t&&t();var u="";Object.values(a)[0],u=Object.values(a)[0].errors[0].message,o["default"].error(u)}else{var l={},g={},b={},P="",F=[],C=m.props.incomingstep.buyFirstPartTwo;for(var D in s)-1!==D.indexOf("addts")?(l[D]=s[D],delete s[D]):-1!==D.indexOf("names")&&(g[D]=s[D],delete s[D]),"latestPaymentTime"===D&&(s[D]=(0,k["default"])(s[D]).format("YYYY-MM-DD"));for(var A in l)for(var T in g)A[A.length-1]===T[T.length-1]&&(l[A]||(l[A]=""),g[T]||(g[T]=""),F.push(l[A]+"&b;"+g[T]));switch(P=F.join("&d;"),s["additionalInformation"]=P,c){case"p":s.freightForwardCreditId=v.buyFirstPartTwo.freightForwardCreditId?v.buyFirstPartTwo.freightForwardCreditId:null,s.guarantorCreditId=v.buyFirstPartTwo.guarantorCreditId?v.buyFirstPartTwo.guarantorCreditId:null;break;case"L":s.freightForwardCreditId=v.buyFirstPartTwo.freightForwardCreditId?v.buyFirstPartTwo.freightForwardCreditId:null,s.guarantorCreditId=v.buyFirstPartTwo.guarantorCreditId?v.buyFirstPartTwo.guarantorCreditId:null;break;case"s":s.freightForwardCreditId=v.buyFirstPartTwo.freightForwardCreditId?v.buyFirstPartTwo.freightForwardCreditId:null,s.guarantorCreditId=v.buyFirstPartTwo.guarantorCreditId?v.buyFirstPartTwo.guarantorCreditId:null;break;case"w":s.freightForwardCreditId=v.buyFirstPartTwo.freightForwardCreditId?v.buyFirstPartTwo.freightForwardCreditId:null,s.guarantorCreditId=v.buyFirstPartTwo.guarantorCreditId?v.buyFirstPartTwo.guarantorCreditId:null,s.latestDeliveryDate=s.latestDeliveryDate?(0,k["default"])(s.validateFields).format("YYYY-MM-DD"):"",delete C["deliveryAddress"],delete C["takeGoodsAddress"];break}switch(b=(0,i["default"])({},s,C,{applyId:p,id:y}),d&&("p"===c||"L"===c?(b["sellingPriceElse"]=Number(s.sellingPrice),delete b.sellingPrice):"s"===c&&(b["purchasePriceElse"]=Number(s.purchasePrice),delete b.purchasePrice)),c){case"p":h({type:"incomingstep/dataSecond",payload:(0,i["default"])({},b),callback:function(r,a,d){0===r?(t&&t(),"save"!==e?w["default"].push("/incoming/purchase/step3?type=".concat(c,"&applyId=").concat(p,"&id=").concat(d.id,"&entrustBuyId=").concat(f)):o["default"].success(a)):(t&&t(),w["default"].push("/incoming/purchase/step2?type=".concat(c,"&applyId=").concat(p,"&id=").concat(y,"&entrustBuyId=").concat(f)),o["default"].error(a))}});break;case"L":h({type:"incomingstep/dataSecond",payload:(0,i["default"])({},b),callback:function(r,a,d){0===r?(t&&t(),"save"!==e?w["default"].push("/incoming/purchase/step3?type=".concat(c,"&applyId=").concat(p,"&id=").concat(d.id,"&entrustBuyId=").concat(f)):o["default"].success(a)):(t&&t(),w["default"].push("/incoming/purchase/step2?type=".concat(c,"&applyId=").concat(p,"&id=").concat(y,"&entrustBuyId=").concat(f)),o["default"].error(a))}});break;case"s":h({type:"incomingstep/dataSecond",payload:(0,i["default"])({},b),callback:function(r,a,d){0===r?(t&&t(),"save"!==e?w["default"].push("/incoming/purchase/step3?type=".concat(c,"&applyId=").concat(p,"&id=").concat(d.id,"&entrustBuyId=").concat(f)):o["default"].success(a)):(t&&t(),w["default"].push("/incoming/purchase/step2?type=".concat(c,"&applyId=").concat(p,"&id=").concat(y,"&entrustBuyId=").concat(f)),o["default"].error(a))}});break;case"w":h({type:"incomingstep/dataSecond",payload:(0,i["default"])({},b),callback:function(r,a,d){0===r?(t&&t(),"save"!==e?w["default"].push("/incoming/purchase/step3?type=".concat(c,"&applyId=").concat(p,"&id=").concat(d.id,"&entrustBuyId=").concat(f)):o["default"].success(a)):(t&&t(),w["default"].push("/incoming/purchase/step2?type=".concat(c,"&applyId=").concat(p,"&id=").concat(y,"&entrustBuyId=").concat(f)),o["default"].error(a))}});break;default:break}}})},r.changeEditPrice=function(e){r.setState({editPrice:e})},r.state={isProved:2,isCompanyProved:2,type:r.props.location.query.type,applyId:r.props.location.query.applyId,id:r.props.location.query.id,entrustBuyId:r.props.location.query.entrustBuyId,pushData:{},isShow:!1,getData:{},deliveryAddress:0,takeGoodsAddress:0,err:!0,editPrice:!1},r}return(0,p["default"])(t,e),(0,n["default"])(t,[{key:"componentDidMount",value:function(){var e=this,t=this.state,r=t.type,a=t.applyId,d=this;switch(r){case"p":this.props.dispatch({type:"incomingstep/setBuyDetailData",payload:a,callback:function(t,r,a){if(0===t){if(a.entrustBuyDetailDTO){var i=a.entrustBuyDetailDTO;0!==Object.keys(i).length&&(d.deliveryAddress={province:i.deliveryProvince?i.deliveryProvince.id:Number(String(i.deliveryAddress)[0]),city:i.deliveryCity?i.deliveryCity.id:Number(String(i.deliveryAddress)[1]),country:i.deliveryCounty?i.deliveryCounty.id:Number(String(i.deliveryAddress)[2])},d.takeGoodsAddress={province:i.takeGoodsProvince?i.takeGoodsProvince.id:Number(String(i.takeGoodsAddress)[0]),city:i.takeGoodsCity?i.takeGoodsCity.id:Number(String(i.takeGoodsAddress)[1]),country:i.takeGoodsCounty?i.takeGoodsCounty.id:Number(String(i.takeGoodsAddress)[2])})}e.setState({getData:a,isShow:!0})}}});break;case"L":this.props.dispatch({type:"incomingstep/setLargeBuyDetailData",payload:a,callback:function(t,r,a){if(0===t){if(a.largeEntrustBuyDetailDTO){var i=a.largeEntrustBuyDetailDTO;0!==Object.keys(i).length&&(d.deliveryAddress={province:i.deliveryProvince?i.deliveryProvince.id:Number(String(i.deliveryAddress)[0]),city:i.deliveryCity?i.deliveryCity.id:Number(String(i.deliveryAddress)[1]),country:i.deliveryCounty?i.deliveryCounty.id:Number(String(i.deliveryAddress)[2])},d.takeGoodsAddress={province:i.takeGoodsProvince?i.takeGoodsProvince.id:Number(String(i.takeGoodsAddress)[0]),city:i.takeGoodsCity?i.takeGoodsCity.id:Number(String(i.takeGoodsAddress)[1]),country:i.takeGoodsCounty?i.takeGoodsCounty.id:Number(String(i.takeGoodsAddress)[2])})}e.setState({getData:a,isShow:!0})}}});break;case"s":this.props.dispatch({type:"incomingstep/setSaleDetailData",payload:a,callback:function(t,r,a){0===t&&e.setState({getData:a,isShow:!0})}});break;case"w":this.props.dispatch({type:"incomingstep/setStorageDetailData",payload:a,callback:function(t,r,a){0===t&&e.setState({getData:a,isShow:!0})}});break;default:break}}},{key:"render",value:function(){var e=this.state,t=(e.isProved,e.type),r=e.pushData,a=e.applyId,d=e.id,i=e.deliveryAddress,o=e.takeGoodsAddress,s=e.getData,n=e.err,u=e.isShow,c=e.entrustBuyId,l=e.editPrice,p=(this.props.form,"");return s.entrustBuyDTO&&(p=s.entrustBuyDTO.applyCompanyName),b["default"].createElement(b.Fragment,null,b["default"].createElement(F.ReportHeader,{title:p,showInput:!1,prev:!0,prevFun:function(){return w["default"].push("/incoming/purchase/step1?type=".concat(t,"&applyId=").concat(a,"&entrustBuyId=").concat(c))},nextFun:function(){return console.log("\u4fdd\u5b58\u89e6\u53d1\u4e86")},onChange:this.onChange,step:2,type:t,id:d,rcForm:this.props.form,getData:s,applyId:a,onValidateFormTwo:this.onValidateForm}),u?b["default"].createElement(F.BusinessDetail,{writeBack:{deliveryAddress:this.deliveryAddress,takeGoodsAddress:this.takeGoodsAddress},getData:s,entrustBuyId:c,deliveryAddress:i,takeGoodsAddress:o,type:t,pushData:r,addressChange:this.addressChange,applyId:a,id:d,getIsProved:this.getIsProved,isProved:this.state.isProved,isCompanyProved:this.state.isCompanyProved,rcForm:this.props.form,editPrice:l,changeEditPrice:this.changeEditPrice}):null,u?b["default"].createElement(F.BusinessFooter,{getData:s,type:t,id:d,entrustBuyId:c,applyId:a,rcForm:this.props.form}):"",b["default"].createElement(F.ReportBottom,{step:2,broad:5,type:t,err:n,id:d,applyId:a,entrustBuyId:c,onValidateFormTwo:this.onValidateForm,incomProp:this.props.incomingstep.buyFirstPartTwo}))}}]),t}(b.Component),v=m))||v)||v)||v),A=D;t["default"]=A}}]);