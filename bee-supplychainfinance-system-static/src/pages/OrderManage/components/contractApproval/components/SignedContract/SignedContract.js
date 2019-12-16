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
      right: false
    };
  }
  componentDidMount() {
    this.getSignedContracts();
  }
  //获取已签订的合同信息
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
  render() {
    const { contracts } = this.state;
    return (
      <div className={style.signedContractBox}>
        <Card title="已签订的合同" headStyle={{ fontWeight: "600" }}>
          <Row>
            {contracts[0] ? (
              contracts.map(item => {
                return (
                  <Col key={item.url} sm={8} xs={10}>
                    <div className={style.signedContract}>
                      <a
                        onClick={()=>window.open(item.url)}
                        style={{ color: "rgba(0, 0, 0, 0.64705882)" }}
                      >
                        <img
                          style={{ width: "14px", marginRight: "10px" }}
                          src={require("@/assets/sign.png")}
                        />
                        {item.name}
                      </a>
                    </div>
                  </Col>
                );
              })
            ) : (
              <span>暂无</span>
            )}
          </Row>
        </Card>
      </div>
    );
  }
}
export default SignedContract;
