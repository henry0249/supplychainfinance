import React, { Component, Fragment } from "react";
import {
  Breadcrumb,
  Button,
  Modal,
  Icon,
  Table,
  message,
  Progress
} from "antd";
import { FileWordUpload } from "@/components";
import style from "./index.less";
import { connect } from "dva";
import router from "umi/router";
import { withRouter } from "react-router";
import Link from "umi/link"

const confirm = Modal.confirm;
@withRouter
@connect(({ contract, global, orderManage }) => ({
  contract,
  global,
  orderManage
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: "",
      fileName: null,
      statusData: null,
      status: 0,
      contractDetail: null,
      buyOrdersId: null,
      buyContractBasicId: null,
      right: false,
      userCompanyName: null,
      type: sessionStorage.businessMode,
      confirmStatus: this.props.location.query.status,
      isSave: false,
      contractType: null,
      pdfUrl: "",
      percent: 0
    };
    this.timer = null;
  }
  componentDidMount() {
    const { dispatch } = this.props;
    this.setState(
      {
        roleId: this.props.global.role.roleId,
        buyOrdersId: this.props.location.query.orderId,
        buyContractBasicId: this.props.location.query.contractBasicId,
        userCompanyName: this.props.global.user.companyName,
        contractType: this.props.location.query.contractType
      },
      () => {
        this.getStatus();
        const {
          buyOrdersId,
          buyContractBasicId,
          contractType,
          roleId
        } = this.state;
        //获取合同详情
        dispatch({
          type: "contract/getContractDetail",
          payload: {
            buyOrdersId: buyOrdersId,
            buyContractBasicId: buyContractBasicId
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState({
                contractDetail: data,
                uri: data.url,
                pdfUrl: data.pdf,
                fileName: data.name,
                percent: 100
              });
            } else {
              message.error(msg);
            }
          }
        });
        // if (contractType === "0" || contractType === "3") {
        //   this.setState({
        //     right: roleId === 1 || roleId === 4
        //   });
        // } else if (contractType === "1" || contractType === "4") {
        //   this.setState({
        //     right: roleId === 2 || roleId === 4
        //   });
        // } else if (contractType === "2") {
        //   this.setState({
        //     right: roleId === 1 || roleId === 4 || roleId === 6
        //   });
        // } else if (contractType === "5") {
        //   this.setState({
        //     right: roleId === 1 || roleId === 4
        //   });
        // } else {
        //   this.setState({
        //     right: roleId === 1 || roleId === 4 || roleId === 3
        //   });
        // }
        this.setState({
          right: roleId === 4
        });
      }
    );
  }
  //获取合同确认状态
  getStatus = () => {
    const { dispatch } = this.props;
    const { roleId, buyContractBasicId, userCompanyName } = this.state;
    dispatch({
      type: "contract/getStatus",
      payload: {
        buyContractBasicId: buyContractBasicId,
        userCompanyName: userCompanyName,
        roleId: Number(roleId)
      },
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState({
            status: data.confirmStatus,
            statusData: data
          });
        } else {
          // message.error(msg);
        }
      }
    });
  };
  //确认合同
  sureContract = () => {
    const { dispatch } = this.props;
    const {
      fileName,
      uri,
      roleId,
      buyContractBasicId,
      userCompanyName,
      type
    } = this.state;
    switch (type) {
      case "0":
        dispatch({
          type: "contract/confirmContract",
          payload: {
            buyContractBasicId: buyContractBasicId,
            userCompanyName: userCompanyName,
            name: fileName,
            url: uri,
            roleId: roleId
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              message.success(msg);
              this.getStatus();
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "1":
        dispatch({
          type: "contract/confirmContract",
          payload: {
            saleContractBasicId: buyContractBasicId,
            userCompanyName: userCompanyName,
            name: fileName,
            url: uri,
            roleId: roleId
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              message.success(msg);
              this.getStatus();
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "2":
        dispatch({
          type: "contract/confirmContract",
          payload: {
            storageContractBasicId: buyContractBasicId,
            userCompanyName: userCompanyName,
            name: fileName,
            url: uri,
            roleId: roleId
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              message.success(msg);
              this.getStatus();
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "4":
        dispatch({
          type: "contract/confirmContract",
          payload: {
            largeBuyContractBasicId: buyContractBasicId,
            userCompanyName: userCompanyName,
            name: fileName,
            url: uri,
            roleId: roleId
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              message.success(msg);
              this.getStatus();
            } else {
              message.error(msg);
            }
          }
        });
        break;
      default:
        break;
    }
  };
  //保存上传合同
  saveContract = () => {
    const { fileName, buyContractBasicId, uri, type, pdfUrl } = this.state;
    const { dispatch } = this.props;
    this.setState({
      isSave: false
    });
    switch (type) {
      case "0":
        dispatch({
          type: "contract/updateContractURL",
          payload: {
            buyContractBasicId: buyContractBasicId,
            name: fileName,
            url: uri,
            pdf: pdfUrl
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "1":
        dispatch({
          type: "contract/updateContractURL",
          payload: {
            saleContractBasicId: buyContractBasicId,
            name: fileName,
            url: uri,
            pdf: pdfUrl
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "2":
        dispatch({
          type: "contract/updateContractURL",
          payload: {
            storageContractBasicId: buyContractBasicId,
            name: fileName,
            url: uri,
            pdf: pdfUrl
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "4":
        dispatch({
          type: "contract/updateContractURL",
          payload: {
            largeBuyContractBasicId: buyContractBasicId,
            name: fileName,
            url: uri,
            pdf: pdfUrl
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
        break;
      default:
        break;
    }
  };
  //上传合同文件
  uriChange = value => {
    if (value === "uploading") {
      this.setState(
        {
          percent: 1,
          uri: "",
          pdfUrl: ""
        },
        () => {
          this.process();
        }
      );
    } else {
      this.setState({
        uri: value.value.wordDate.access_url,
        pdfUrl: value.value.pdfDate.access_url,
        fileName: value.name,
        isSave: true
      });
    }
  };
  process = () => {
    let processPer = 1;
    let timer = setInterval(() => {
      processPer++;
      this.setState(
        {
          percent: processPer
        },
        () => {
          if (processPer === 99) {
            clearInterval(timer);
          }
        }
      );
    }, 10);
  };
  //返回上一级的合同列表页面
  backTo = () => {
    const { buyOrdersId } = this.state;
    router.push(
      `/orderManage/details?enterType=1&key=contract&id=${buyOrdersId}`
    );
  };
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const {
      uri,
      status,
      right,
      isSave,
      confirmStatus,
      pdfUrl,
      percent,
      buyOrdersId
    } = this.state;
    const isPdf = pdfUrl && pdfUrl.match(".pdf");
    if (uri && pdfUrl && percent === 99) {
      this.setState({
        percent: 100
      });
    }
    return (
      <Fragment>
        <div className={style.crumb}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to={`/orderManage/details?enterType=1&key=contract&id=${buyOrdersId}`}>订单详情</Link></Breadcrumb.Item>
            <Breadcrumb.Item>合同详情</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={style.contractWrap}>
          <div className={style.contractBox}>
            <div
              className={style.contractContent}
              style={isPdf ? { top: "0" } : {}}
            >
              {percent === 100 && (pdfUrl || uri) ? (
                isPdf ? (
                  <embed
                    src={pdfUrl}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  />
                ) : (
                    <iframe
                      src={`https://view.officeapps.live.com/op/view.aspx?src=${uri}`}
                      width="100%"
                      id="printBox"
                      height="100%"
                      frameBorder="1"
                    />
                  )
              ) : (
                  <Progress
                    style={{ marginTop: "500px" }}
                    percent={percent}
                    status="active"
                  />
                )}
              <div
                className={style.coverBar}
                style={isPdf ? { display: "none" } : {}}
              />
            </div>
            {right ? (
              <div className={style.contractBtn}>
                {status === 0 ? (
                  <Button
                    style={{ marginRight: "10px" }}
                    onClick={this.sureContract}
                    type="primary"
                    disabled={
                      isSave || !(confirmStatus !== 3 && confirmStatus !== 4)
                    }
                  >
                    <span>确认合同</span>
                  </Button>
                ) : (
                    // ) : status === 1 ? (
                    //   <Button
                    //     style={{ marginRight: "10px" }}
                    //     onClick={this.sureContract}
                    //     type="primary"
                    //     disabled={true}
                    //   >
                    //     <span>等待其它方确认</span>
                    //   </Button>
                    // ) : status === 2 ? (
                    //   <Button
                    //     style={{ marginRight: "10px" }}
                    //     onClick={this.sureContract}
                    //     type="primary"
                    //     disabled={true}
                    //   >
                    //     <span>已双方确认</span>
                    //   </Button>
                    <Button
                      style={{ marginRight: "10px" }}
                      onClick={this.sureContract}
                      type="primary"
                      disabled={true}
                    >
                      <span>已确认</span>
                    </Button>
                  )}

                <FileWordUpload
                  disabled={status === 9}
                  onChange={value => this.uriChange(value)}
                  showUploadList={false}
                  labelInValue={true}
                  Button={
                    <Button
                      type="primary"
                      style={{ marginRight: "10px" }}
                      disabled={
                        status !== 0 ||
                        !(confirmStatus !== 3 && confirmStatus !== 4)
                      }
                    >
                      上传合同
                    </Button>
                  }
                  type={1}
                />
                <Button style={{ marginRight: "10px" }} onClick={this.backTo}>
                  <span>返回</span>
                </Button>
                {uri ? (
                  <Button
                    type="primary"
                    style={{ marginRight: "10px" }}
                    onClick={() => window.open(uri)}
                  >
                    下载合同
                  </Button>
                ) : null}
                <Button
                  style={{ marginRight: "10px" }}
                  onClick={this.saveContract}
                  type="primary"
                  disabled={
                    status !== 0 ||
                    !(confirmStatus !== 3 && confirmStatus !== 4) ||
                    !uri ||
                    !isSave
                  }
                >
                  <span>保存</span>
                </Button>
              </div>
            ) : (
                <div className={style.contractBtn}>
                  <Button style={{ marginRight: "10px" }} onClick={this.backTo}>
                    <span>返回</span>
                  </Button>
                  {uri ? (
                    <Button
                      type="primary"
                      style={{ marginRight: "10px" }}
                      onClick={() => window.open(uri)}
                    >
                      下载合同
                  </Button>
                  ) : null}
                </div>
              )}
            <div
              className={style.cover}
              style={isPdf ? { display: "none" } : {}}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}
export default Index;
