import React, { Component, Fragment } from "react";
import { Breadcrumb, Button, Modal, Icon, Table, message } from "antd";
import { FileUpload } from "@/components";
import style from "../index.less";
import router from "umi/router";
import { connect } from "dva";

const confirm = Modal.confirm;

@connect(({ appContract }) => ({
  appContract
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: "",
      isShow: false,
      contractDetail: null,
      fileName: null,
      path: null,
      pdfUrl:""
    };
  }
  componentDidMount() {
    const { orderId, contractBasicId, dispatch } = this.props;
    const url = location.pathname;
    let pathName = "";
    if (url === "/approval/contract/contractDetail") {
      pathName = url.substring(0, url.indexOf("/contractDetail"));
    } else {
      pathName = url.substring(0, url.indexOf("/contract/detail"));
    }
    this.setState({
      path: pathName
    });
    dispatch({
      type: "appContract/getContractDetail",
      payload: {
        buyOrdersId: orderId,
        buyContractBasicId: contractBasicId
      },
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState({
            contractDetail: data,
            uri: data.url,
            pdfUrl:data.pdf,
            fileName: data.name
          });
        } else {
          // message.error(msg);
        }
      }
    });
  }
  backTo = () => {
    const { orderId } = this.props;
    const { path } = this.state;
    router.push(`${path}/details?enterType=0&key=contract&id=${orderId}`);
  };
  render() {
    const { uri,pdfUrl } = this.state;
    const { right } = this.props;
    const isPdf = pdfUrl&&pdfUrl.match('.pdf')
    return (
      <Fragment>
        <div
          className={style.contractWrap}
          style={right ? null : { width: "100%" }}
        >
          <div className={style.contractBox}>
            <div className={style.contractContent} style={isPdf?{top:'0'}:{}}>
            {isPdf?
                <embed src={pdfUrl} type="application/pdf" width="100%" height="1030px" /> 
                :
                <iframe
                  src={`https://view.officeapps.live.com/op/view.aspx?src=${uri}`}
                  width="100%"
                  id="printBox"
                  height="1030px"
                  frameBorder="1"
                />
              }
              <div className={style.coverBar} style={isPdf?{display:'none'}:{}}/>
            </div>
            <div className={style.contractBtn}>
              {uri ? (
                <Button
                  type="primary"
                  style={{ marginRight: "10px" }}
                  onClick={() => window.open(uri)}
                >
                  下载合同
                </Button>
              ) : null}
              <Button onClick={this.backTo}>返回</Button>
            </div>
            <div className={style.cover} style={isPdf?{display:'none'}:{}}></div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default Index;
