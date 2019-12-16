import React, { Component } from "react";
import { Card, Col, Row, message, Popconfirm } from "antd";
import { FileUpload } from "@/components";
import style from "../index.less";
import { connect } from "dva";

@connect(({ contract }) => ({
  contract
}))
class SignedContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: [],
      right: false,
      status: null
    };
  }
  componentDidMount() {
    this.getRight();
    this.getSignedContracts();
  }
  //获取订单状态并设置相应的权限
  getRight = () => {
    const { dispatch, orderId, type, roleId } = this.props;
    dispatch({
      type: "contract/getAllContracts",
      payload: {
        buyOrdersId: orderId
      },
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              status: data.status
            },
            () => {
              const { status } = this.state;
              if (type === "2") {
                this.setState({
                  right:roleId === 4
                });
              } else {
                this.setState({
                  right:roleId === 4
                });
              }
            }
          );
        } else {
          message.error(msg);
        }
      }
    });
  };
  //获取已经前端的合同
  getSignedContracts = () => {
    const { dispatch, orderId, type } = this.props;
    dispatch({
      type: "contract/signedContracts",
      payload: {
        buyOrdersId: orderId
      },
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState({
            contracts: data
          });
        } else {
          // message.error(msg);
        }
      }
    });
  };
  //上传合同
  fileChange = value => {
    const { dispatch, orderId, type } = this.props;

    switch (type) {
      case "0":
        dispatch({
          type: "contract/saveNewSignedContract",
          payload: {
            url: value.value,
            name: value.name,
            buyOrdersId: orderId
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              this.getSignedContracts();
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "1":
        dispatch({
          type: "contract/saveNewSignedContract",
          payload: {
            url: value.value,
            name: value.name,
            saleOrdersId: orderId
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              this.getSignedContracts();
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "2":
        dispatch({
          type: "contract/saveNewSignedContract",
          payload: {
            url: value.value,
            name: value.name,
            storageOrdersId: orderId
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              this.getSignedContracts();
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "4":
        dispatch({
          type: "contract/saveNewSignedContract",
          payload: {
            url: value.value,
            name: value.name,
            largeBuyOrdersId: orderId
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              this.getSignedContracts();
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
  //删除上传合同
  delete = (id, index) => {
    const { dispatch, type } = this.props;
    switch (type) {
      case "0":
        dispatch({
          type: "contract/deleteSignedContract",
          payload: {
            buyContractAttachmentId: id
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              let newData = [].concat(this.state.contracts);
              newData.splice(index, 1);
              this.setState({
                contracts: newData
              });
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "1":
        dispatch({
          type: "contract/deleteSignedContract",
          payload: {
            saleContractAttachmentId: id
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              let newData = [].concat(this.state.contracts);
              newData.splice(index, 1);
              this.setState({
                contracts: newData
              });
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "2":
        dispatch({
          type: "contract/deleteSignedContract",
          payload: {
            storageContractAttachmentId: id
          },
          callback: (code, msg, data) => {
            if (code === 0) {
              let newData = [].concat(this.state.contracts);
              newData.splice(index, 1);
              this.setState({
                contracts: newData
              });
              message.success(msg);
            } else {
              message.error(msg);
            }
          }
        });
        break;
      case "4":
      dispatch({
        type: "contract/deleteSignedContract",
        payload: {
          largeBuyContractAttachmentId: id
        },
        callback: (code, msg, data) => {
          if (code === 0) {
            let newData = [].concat(this.state.contracts);
            newData.splice(index, 1);
            this.setState({
              contracts: newData
            });
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
  render() {
    const { contracts, right } = this.state;
    const { type } = this.props;
    return (
      <div className={style.signedContractBox}>
        <Card title="已签订的合同" headStyle={{ fontWeight: "600" }}>
          <Row style={{ marginBottom: "10px" }}>
            {contracts[0] ? (
              contracts.map((item, index) => {
                return (
                  <Col key={item.url} sm={8} xs={10}>
                    <div  className={style.signedContract}>
                      <a
                        style={{ color: "rgba(0, 0, 0, 0.64705882)" }}
                        onClick={()=>window.open(item.url)}
                      >
                        <img
                          style={{ width: "14px", marginRight: "10px" }}
                          src={require("@/assets/sign.png")}
                        />
                        {item.name}
                      </a>
                      {right ? (
                        <Popconfirm
                          placement="top"
                          title="确认删除该合同吗?"
                          onConfirm={this.delete.bind(
                            this,
                            type === "0"
                              ? item.buyContractAttachmentId
                              : type === "1"
                              ? item.saleContractAttachmentId
                              :type==="2"
                              ?item.storageContractAttachmentId:item.largeBuyContractAttachmentId,
                            index
                          )}
                          okText="确认"
                          cancelText="取消"
                        >
                          <span
                            style={{
                              width: "14px",
                              marginLeft: "10px",
                              cursor: "pointer"
                            }}
                          >
                            X
                          </span>
                        </Popconfirm>
                      ) : null}
                    </div>
                  </Col>
                );
              })
            ) : (
              <span>暂无</span>
            )}
          </Row>
          <Row>
            <Col sm={8} xs={10}>
              {right ? (
                <FileUpload
                  onChange={this.fileChange.bind(this)}
                  labelInValue={true}
                  showUploadList={false}
                />
              ) : null}
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
export default SignedContract;
