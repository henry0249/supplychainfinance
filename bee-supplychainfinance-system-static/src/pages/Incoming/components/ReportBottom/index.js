import React, { Fragment, Component } from "react";
import { connect } from "dva";
import { Form, Button, Card, Row, Col, Popconfirm, Icon, message } from "antd";
import router from "umi/router";
import styles from "./index.less";
import { json } from "graphlib";
import withRouter from "umi/withRouter"

@withRouter
@Form.create()
@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
class ReportBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaved: false,
      throughTime: 0,
      oldTime: 0,
      loading: false
    };
  }
  componentDidMount() {
    let time = new Date().getTime();
    this.setState({
      oldTime: time
    });
    this.timer = setInterval(this.autoSave, 1000 * 60 * 5);
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  autoSave = () => {
    const { type, dispatch, step } = this.props;
    const self = this;
    this.setState(
      {
        loading: true
      },
      () => {
        if (step === 1) {
          this.props.onValidateFormOne("save",() => {
            self.setState({
              loading: false
            })
          })
        } else if (step === 2) {
          this.props.onValidateFormTwo("save",() => {
            self.setState({
              loading: false
            })
          })
          // router.push(`/incoming/purchase/step3?type=${type}&applyId=${applyId}`);
        } else if (step === 3) {
          this.props.onValidateFormThree("save",() => {
            self.setState({
              loading: false
            })
          })
        } else if (step === 4) {
          this.props.onValidateFormFour("save",() => {
            self.setState({
              loading: false
            })
          })
        }
        let now = new Date().getTime();
        let diffValue = now - this.state.oldTime;
        let minC = parseInt(diffValue / (1000 * 60));
        this.setState({
          throughTime: minC,
          isSaved: true
        });
      }
    );
  };
  render() {
    const { isSaved } = this.state;
    const self = this;
    const {
      rcForm,
      dispatch,
      data,
      step,
      broad,
      type,
      err,
      applyId,
      id,
      entrustBuyId
    } = this.props;
    // const { getFieldDecorator, validateFields } = rcForm;
    const turnToNext = () => {
        // if(true) {
        //判断必填项必须填完才能下一步
        this.setState(
          {
            loading: true
          },
          () => {
            if (step === 1) {
              this.props.onValidateFormOne("",() => {
                self.setState({
                  loading: false
                })
              })
            } else if (step === 2) {
              this.props.onValidateFormTwo("",() => {
                self.setState({
                  loading: false
                })
              })
              // router.push(`/incoming/purchase/step3?type=${type}&applyId=${applyId}`);
            } else if (step === 3) {
              this.props.onValidateFormThree("",() => {
                self.setState({
                  loading: false
                })
              })
              // router.push(`/incoming/purchase/step4?type=${type}&applyId=${applyId}`);
            }
          }
        );
      
      // }
    };
    const cancelConfirm = () => {
      router.push("/incoming");
    };
    const confirmReportData = () => {
      let value1,value2,result = null
      this.setState(
        {
          loading: true
        },
        () => {
          this.props.onValidateFormFour("",() => {
            self.setState({
              loading: false
            })
          })
        }
      );
    };
    const backTo = () => {
      if (step === 2) {
        router.push(`/incoming/purchase/step1?type=${type}&applyId=${applyId}&entrustBuyId=${entrustBuyId}`);
      } else if (step === 3) {
        router.push(
          `/incoming/purchase/step2?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
        );
      } else if (step === 4) {
        router.push(
          `/incoming/purchase/step3?type=${type}&applyId=${applyId}&id=${id}&entrustBuyId=${entrustBuyId}`
        );
      }
    };
    return (
      <div className={styles.bottomCard}>
        <Card>
          <Row>
            <Col sm={8} xs={2}>
              <span
                style={{
                  marginRight: "10px"
                }}
              >
                <span
                  style={
                    isSaved
                      ? {
                          color: "green",
                          marginRight: "10px"
                        }
                      : {
                          color: "#f00",
                          marginRight: "10px"
                        }
                  }
                >
                  {isSaved ? (
                    <Icon
                      type="check-circle"
                      theme="twoTone"
                      twoToneColor="#52c41a"
                    />
                  ) : (
                    <Icon
                      type="close-circle"
                      theme="twoTone"
                      twoToneColor="#f00"
                    />
                  )}
                </span>
                {isSaved ? "已保存草稿" : "未保存草稿"}
                <span>
                  {this.state.throughTime}
                  分钟前
                </span>
              </span>
            </Col>
            <Col sm={Number(15 - broad)} xs={2} />
            <Col sm={Number(broad + 1)} xs={2}>
              <Form.Item
                wrapperCol={{
                  xs: {
                    span: 24,
                    offset: 0
                  }
                }}
                label=""
              >
                <Popconfirm
                  placement="bottomRight"
                  title="取消后当前页面未保存内容将丢失！"
                  onConfirm={cancelConfirm}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button
                    type="default"
                    style={{
                      marginLeft: "25px"
                    }}
                  >
                    取消
                  </Button>
                </Popconfirm>
                {step === 2 || step === 3 || step === 4 ? (
                  <Button
                    type="primary"
                    style={{
                      marginLeft: "25px"
                    }}
                    onClick={backTo}
                  >
                    上一步
                  </Button>
                ) : null}
                {step === 4 ? (
                  <Button
                    type="primary"
                    style={{
                      marginLeft: "25px"
                    }}
                    onClick={confirmReportData}
                    disabled={!err}
                    loading={this.state.loading}
                  >
                    提交
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    style={{
                      marginLeft: "25px"
                    }}
                    onClick={turnToNext}
                    // disabled={!err}
                    loading={this.state.loading}
                  >
                    下一步
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default ReportBottom;
