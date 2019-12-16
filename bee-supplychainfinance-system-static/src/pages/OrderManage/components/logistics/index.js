import React, { Component, Fragment } from 'react'
import propTypes from "prop-types"
import style from "./index.less"
// import Enclosure from '@/pages/Approval/ProjectApproval/components/Enclosure'
import { Card, Form, Input, Button, Icon, message, DatePicker } from 'antd'
import { connect } from "dva"
import withRouter from "umi/withRouter"
import FileUpload from "@/components/fileUpload"
import OperationLog from "./components/OperationLog"
import { moneyExp } from "@/utils/utils"
import moment from "moment"

@withRouter
@Form.create()
@connect(({ logistics }) => ({ logistics }))
class LogisticsInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [{}],
      file: [],
      show: false,
      logList: []
    }
    this.orderId = props.location.query.id
    this.businessMode = Number(sessionStorage.businessMode)
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    const { dispatch } = this.props;
    const self = this
    //获取物流信息
    dispatch({
      type: "logistics/getLogisticsInfo",
      payload: {
        businessMode: this.businessMode,
        orderId: this.orderId,
      },
      callback(res) {
        if (res.code === 0) {
          self.setState({
            show: true,
          })
        }
      }
    })
    //获取操作日志
    dispatch({
      type: "logistics/getLogisticsLog",
      payload: {
        orderId: this.orderId
      },
      callback(data) {
        if (data.code === 0) {
          const arr = [];
          data.data.forEach(item => {
            arr.push(item)
          })
          self.setState({
            logList: arr
          })
        }
      }
    })
  }

  datepick = current => {
    return current && current <= moment().endOf("day");
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const self = this;
    const dispatch = this.props.dispatch;
    const id = this.props.logistics.logisticsInfo.id ? this.props.logistics.logisticsInfo.id : ""
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (let key in values) {
          if (values[key] === undefined) {
            values[key] = ""
          }
          if (key === "payDate" && values[key] !== "") {
            values[key] = moment(values[key]).format("YYYY-MM-DD")
          }
        }
        delete values["addMsg0"]
        const inputOk = Object.values(values).some(item => item !== undefined)
        values.accessoryDTOList = this.state.file
        const fileOk = values.accessoryDTOList.length === 0 ? false : true
        if (inputOk || fileOk) {
          if (this.state.show) {
            dispatch({
              type: "logistics/updateLogisticsInfo",
              payload: { ...values, orderId: this.orderId, businessMode: this.businessMode, id: id },
              callback(res) {
                if (res.code === 0) {
                  message.success("更新成功")
                  // self.props.history.push(self.props.location.pathname + self.props.location.search)
                  self.props.form.resetFields()
                  self.com.setState({
                    fileList: []
                  })
                  self.setState({
                    file: []
                  })
                  self.getData()
                } else {
                  message.error(res.msg)
                }
              }
            })
          } else {
            dispatch({
              type: "logistics/saveBLogisticsInfo",
              payload: { ...values, orderId: this.orderId, businessMode: this.businessMode },
              callback(res) {
                if (res.code === 0) {
                  message.success("保存成功")
                  // self.props.history.push(self.props.location.pathname + self.props.location.search)
                  self.props.form.resetFields()
                  self.com.setState({
                    fileList: []
                  })
                  self.setState({
                    file: []
                  })
                  self.getData()
                } else {
                  message.error(res.msg)
                }
              }
            })
          }
        } else {
          message.error("请至少填入一项，或上传附件")
          return
        }
      } else {
        Object.keys(err).forEach((item, index) => {
          if (index === 0) {
            message.error(err[item].errors[0].message)
          }
        })
      }
    });
  }
  addInput() {
    const list = this.state.list;
    list.push({});
    this.setState({
      list
    })
  }
  delList(index) {
    const list = this.state.list;
    list.splice(index, 1, "");
    this.setState({
      list
    })
  }
  removeFile(id) {
    const self = this
    this.props.dispatch({
      type: "logistics/delLogisticsAccessory",
      payload: {
        accessId: id,
        orderId: this.orderId
      },
      callback(res) {
        if (res.code === 0) {
          message.success("删除成功")
          self.getData()
        } else {
          message.error(res.msg)
        }
      }
    })
  }
  FileUpload = (value) => {
    let params = {
      "name": value.name,
      "url": value.value
    }
    let newFile = [].concat(this.state.file)
    newFile.push(params)
    this.setState({
      file: newFile
    })
  }
  getComponent = (com) => {
    this.com = com
  }
  render() {
    const { form, fileData = [], logistics: { logisticsLog = [], logisticsInfo = {} } } = this.props
    const { show } = this.state
    const { getFieldDecorator, validateFields } = form;
    const upLoadProps = {
      multiple: true,
      // onRemove: (file) => {this.removeFile(file)},
      fileList: this.state.file,
      listType: "picture"
    }
    return (
      <div className={style.logisticsInfo}>
        <div className={style.wrap}>
          <div className={style.logistics}>
            <div className={style.header}>
              <p>物流信息</p>
            </div>
            {
              show ?
                <div className={style.logisticsCon}>
                  <div className={style.item}><span>已发货数量 :</span><span>{logisticsInfo.deliveredNumber && logisticsInfo.deliveredNumber}</span></div>
                  <div className={style.item}><span>未发货数量 :</span><span>{logisticsInfo.undeliveredNumber && logisticsInfo.undeliveredNumber}</span></div>
                  <div className={style.item}><span>已到货数量 :</span><span>{logisticsInfo.receivedNumber && logisticsInfo.receivedNumber}</span></div>
                  <div className={style.item}><span>货物所在地 :</span><span>{logisticsInfo.productLoc && logisticsInfo.productLoc}</span></div>
                </div>
                :
                <div className={style.logisticsCon}>
                  <div>暂无数据</div>
                </div>
            }

          </div>
          <div className={style.enclosure}>
            <Card
              title='附件'
              style={{ marginTop: 20 }}
            >
              <div className={style.download}>
                {logisticsInfo.accessoryDTOList && logisticsInfo.accessoryDTOList.length > 0 ? logisticsInfo.accessoryDTOList.map((item, index) =>
                  <div key={item.id}>
                    <a href={item.url}>
                      <Icon type="link" />
                      {item.name}
                    </a>
                    <span style={{ marginLeft: 5, color: ' #1890ff', cursor: "pointer" }} onClick={this.removeFile.bind(this, item.id)}><Icon type="close" /></span>
                  </div>) : null}
              </div>
            </Card>
          </div>
          <div className={style.logisticsUpdate}>
            <div className={style.header}>
              <p>物流信息更新</p>
            </div>
            <div className={style.content}>
              <Form layout="vertical" className={style.updateForm} onSubmit={this.handleSubmit}>
                <div className={style.formItem}>
                  <Form.Item
                    label="已发货数量"
                    style={{ width: "33%" }}
                  >
                    {
                      getFieldDecorator("deliveredNumber", {
                        rules: [
                          {
                            required: false,
                            message: "最长不超过20个字符,必须为数字,最多两位小数",
                            pattern: /(^[1-9]([0-9]{1,19})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]{1,19}([0-9])?$)/gi,
                            max: 20
                          }
                        ]
                      })(<Input placeholder="请输入" style={{ width: "70%" }} />)
                    }
                  </Form.Item>
                  <Form.Item
                    label="未发货数量"
                    style={{ width: "33%" }}
                  >
                    {
                      getFieldDecorator("undeliveredNumber", {
                        rules: [
                          {
                            required: false,
                            message: "最长不超过20个字符,必须为数字,最多两位小数",
                            pattern: /(^[1-9]([0-9]{1,19})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]{1,19}([0-9])?$)/gi,
                            max: 20
                          }
                        ]
                      })(<Input placeholder="请输入" style={{ width: "70%" }} />)
                    }
                  </Form.Item>
                  <Form.Item
                    label="已到货数量"
                    style={{ width: "33%" }}
                  >
                    {
                      getFieldDecorator("receivedNumber", {
                        rules: [
                          {
                            required: false,
                            message: "最长不超过20个字符,必须为数字,最多两位小数",
                            pattern: /(^[1-9]([0-9]{1,19})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]{1,19}([0-9])?$)/gi,
                            max: 20
                          }
                        ]
                      })(<Input placeholder="请输入" style={{ width: "70%" }} />)
                    }
                  </Form.Item>
                  <Form.Item
                    label="货物所在地"
                    style={{ width: "33%" }}
                  >
                    {
                      getFieldDecorator("productLoc", {
                        rules: [
                          {
                            type: "string"
                          },
                          {
                            required: false,
                            message: "最长不超过20个字符",
                            max: 20
                          }
                        ]
                      })(<Input placeholder="请输入" style={{ width: "70%" }} />)
                    }
                  </Form.Item>
                  {
                    this.businessMode === 1
                      ?
                      <Fragment>
                        <Form.Item
                          label="付款时间监控"
                          style={{ width: "33%" }}
                        >
                          {
                            getFieldDecorator("payDate", {
                              rules: [
                                {
                                  required: false,
                                  message: "请选择时间",
                                }
                              ]
                            })(
                              <DatePicker
                                allowClear={false}
                                format="YYYY-MM-DD"
                                disabledDate={this.datepick}
                                placeholder="请选择"
                                style={{ width: "70%" }}

                              />)
                          }
                        </Form.Item>
                        <Form.Item
                          label="累计回款金额监控"
                          style={{ width: "33%" }}
                        >
                          {
                            getFieldDecorator("alreadyPayMoney", {
                              rules: [
                                {
                                  type: "string"
                                },
                                {
                                  required: false,
                                  message: "请输入金额，最多两位小数",
                                  pattern: moneyExp,
                                }
                              ]
                            })(<Input
                              addonBefore="￥"
                              addonAfter="万元"
                              placeholder="请输入" style={{ width: "70%" }} />)
                          }
                        </Form.Item>
                      </Fragment>
                      :
                      ""}
                  {/* {
                    this.state.list.map((item, index) => {
                      if (item !== "") {
                        return <Form.Item
                        label="请输入录入项名称"
                        style={{width: "33%"}}
                        key={index}
                      >
                        {
                          getFieldDecorator(`addMsg${index}`, {
                            rules: [
                              {
                                required: false,
                                message: "最长不超过20个字符",
                                max: 20
                              }
                            ]
                          })(<Input placeholder="请输入" style={{width: "70%"}} disabled/>)
                        }
                        {index === 0 ? "" : <Icon type="close" onClick={this.delList.bind(this, index)}/>}
                      </Form.Item>
                      }
                    })
                  } */}
                  {/* <div style={{width: '33%'}}>
                    <Button type="dashed" onClick={this.addInput.bind(this)} disabled>
                      <Icon type="plus" />添加
                    </Button>
                  </div> */}
                  <Form.Item
                    label="备注信息"
                    style={{ width: "33%" }}
                  >
                    {
                      getFieldDecorator("remark", {
                        rules: [
                          {
                            required: false,
                            message: "最长不超过20个字符",
                            max: 20
                          }
                        ]
                      })(<Input.TextArea autosize={true} placeholder="请输入备注" style={{ minHeight: "137px" }} />)
                    }
                  </Form.Item>
                </div>
                <div className={style.bottom}>
                  <FileUpload onChange={this.FileUpload.bind(this)} upLoadProps={upLoadProps} labelInValue={true} getComponent={this.getComponent} />
                  <div>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
                </div>
                <div className={style.submit}>
                  <Button type="primary" size="large" htmlType="submit">提交</Button>
                </div>
              </Form>
            </div>
          </div>
          <div className={style.operation}>
            <Card
              title='操作日志'
              headStyle={{ color: '#128DFF' }}
              style={{ marginTop: 20 }}
            >
              <OperationLog data={this.state.logList} />
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

LogisticsInfo.propTypes = {
  fileData: propTypes.array,
  info: propTypes.object,
  operationLog: propTypes.array
}

LogisticsInfo.defaultProps = {
  fileData: [],//附件信息
  info: {},//物流信息
  operationLog: []//日志信息
}

export default LogisticsInfo
