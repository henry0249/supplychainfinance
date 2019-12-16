import React, { Component } from 'react'
import { Form, Button, Row, Col, Table, Card, Steps, Radio, Divider, message, Modal } from 'antd';
import styles from './index.less'
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';
import FileUpload from '@/components/fileUpload'
import Link from 'umi/link';
import router from 'umi/router'
import request from '@/utils/request'
import withRouter from "umi/withRouter"
import green from "@/assets/green.png"
import line from "@/assets/line.png"
import red from "@/assets/red.png"

@withRouter
@Form.create()
@connect(({ warningDetail, global }) => ({
  warningDetail,
  global,
}))

//预警详情页
export default class Index extends Component {

  constructor(props) {
    super()
    this.state = {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {},
      file: {},
      warningDetail: {},
      logs: [],
      steps: [],
    }
    this.fileComp = ''
  }

  componentDidMount() {
    const { dispatch } = this.props
    const orderDetail = JSON.parse(sessionStorage.getItem('orderDetail'))
    const orderId = orderDetail.orderId
    const businessMode = JSON.parse(sessionStorage.getItem('businessMode'))

    if (businessMode === 0) {
      //获取业务进度
      request(`/supplychainfinance-audit/buyOrder/getOrderProcessNode?orderId=${orderId}`,
        { method: 'get' }).then(resp => {
          if (resp && resp.code === 0) {
            this.setState({
              steps: resp.data
            })
          } else {
            this.setState({
              steps: [],
            })
          }
        })
    } else if (businessMode === 1) {
      //获取业务进度
      request(`/supplychainfinance-audit/saleOrders/getOrderProcessNode?orderId=${orderId}`,
        { method: 'get' }).then(resp => {
          if (resp && resp.code === 0) {
            this.setState({
              steps: resp.data
            })
          } else {
            this.setState({
              steps: [],
            })
          }
        })
    } else if (businessMode === 2) {
      //获取业务进度
      request(`/supplychainfinance-audit/storageOrders/getOrderProcessNode?orderId=${orderId}`,
        { method: 'get' }).then(resp => {
          if (resp && resp.code === 0) {
            this.setState({
              steps: resp.data
            })
          } else {
            this.setState({
              steps: [],
            })
          }
        })
    } else if (businessMode === 4) {
      //获取业务进度
      request(`/supplychainfinance-audit/largeBuyOrders/getOrderProcessNode?orderId=${orderId}`,
        { method: 'get' }).then(resp => {
          if (resp && resp.code === 0) {
            this.setState({
              steps: resp.data
            })
          } else {
            this.setState({
              steps: [],
            })
          }
        })
    }


    //获取预警详情
    request(`/supplychainfinance-audit/earlyWariningRecord/getRecordDeatilById?id=${orderDetail.id}`,
      { method: 'get' }).then(res => {
        if (res && res.code === 0) {
          this.setState({
            warningDetail: res.data
          })
        } else if (res) {
          message.error(res.msg)
        } else {
          message.error('获取数据失败')
        }
      })

    //获取操作日志
    request(`/supplychainfinance-audit/earlyWariningRecord/getLogsByOrderId?currentPage=1&orderId=${orderDetail.orderId}&pageSize=10`,
      { method: 'get' }).then(res => {
        if (res && res.code === 0) {
          this.setState({
            ...res.page,
            logs: res.data,
          })
        } else if (res) {
          message.error(res.msg)
        }
      })
  }

  countDown = () => {
    let secondsToGo = 2;
    const modal = Modal.success({
      title: '提交成功',
      content: `${secondsToGo} 秒后自动消失`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `${secondsToGo} 秒后自动消失`,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000);
  }

  handleOk = (e) => {
    e.preventDefault();
    const { resetFields } = this.props.form;
    const { roleId } = this.props.global.role
    const { validateFields } = this.props.form;
    const { orderId, id } = this.state.warningDetail
    const { warningType, warningStatus } = this.state.warningDetail
    const orderStatus = JSON.parse(sessionStorage.getItem('orderStatus'))
    const businessMode = JSON.parse(sessionStorage.getItem('businessMode'))
    validateFields((err, values) => {
      if (!err) {
        let params = {};
        params['roleId'] = roleId//获取角色ID
        params['orderId'] = orderId//获取订单ID
        params['id'] = id //获取预警ID
        if (values.operateReason) {
          params['operateReason'] = values.operateReason
        }
        if (values.upload) {
          params['annexName'] = this.state.file.annexName || ''
          params['annexUrl'] = this.state.file.annexUrl || ''
        }

        //预警信息类型为提示信息，对应表单元素
        if (warningType == 0) {
          params['dealType'] = 5
        }

        //预警状态为‘申请中’状态，对应表单元素
        else if (warningStatus == 2) {
          params['isPass'] = values.isPass
        }

        //预警状态为‘待处理，已处理，已冻结’状态，对应表单元素
        else {
          params['dealType'] = values.dealType
        }

        // if (params.dealType == 3 && (orderStatus === 12 || orderStatus === 9)) {
        //   message.warning('该订单已完成，不能再次冻结')
        //   return false
        // }
        // 0,1 ---12   2---9   4===6
        if (params.dealType == 3 && businessMode === 0 && orderStatus === 12) {
          message.warning('该订单已完成，不能再次冻结')
          return false
        } else if (params.dealType == 3 && businessMode === 1 && orderStatus === 12) {
          message.warning('该订单已完成，不能再次冻结')
          return false
        } else if (params.dealType == 3 && businessMode === 2 && orderStatus === 9) {
          message.warning('该订单已完成，不能再次冻结')
          return false
        } else if (params.dealType == 3 && businessMode === 4 && orderStatus === 6) {
          message.warning('该订单已完成，不能再次冻结')
          return false
        }

        //如果预警状态为‘申请中’状态，请求申请中接口
        if (warningStatus == 2) {
          request(`/supplychainfinance-audit/earlyWariningRecord/checkingWariningRecord`, {
            method: 'POST',
            body: params
          }).then(res => {
            if (res && res.code === 0) {
              resetFields()
              this.fileComp.setState({ fileList: [] })
              this.setState({ file: {} })
              this.countDown()
              //获取预警详情
              request(`/supplychainfinance-audit/earlyWariningRecord/getRecordDeatilById?id=${id}`,
                { method: 'get' }).then(res => {
                  if (res.code === 0) {
                    this.setState({
                      warningDetail: res.data
                    })
                  } else {
                    message.error('获取预警详情失败：' + res.msg)
                    this.setState({
                      warningDetail: {},
                    })
                  }
                })

              //获取操作日志
              request(`/supplychainfinance-audit/earlyWariningRecord/getLogsByOrderId?currentPage=1&orderId=${orderId}&pageSize=10`,
                { method: 'get' }).then(res => {
                  if (res && res.code === 0) {
                    this.setState({
                      ...res.page,
                      logs: res.data,
                    })
                  } else {
                    message.error('获取操作日志失败：' + res.data)
                    this.setState({
                      logs: [],
                      currentPage: 1,
                      pageSize: 10,
                      totalPage: 0,
                      totalRecords: 0,
                    })
                  }
                })

            } else if (res) {
              message.error(res.msg)
            } else {
              message.error('获取数据失败')
            }
          })
        } else {
          //请求风控预警接口
          request(`/supplychainfinance-audit/earlyWariningRecord/operateWariningRecord`, {
            method: 'POST',
            body: params
          }).then(res => {
            if (res && res.code === 0) {
              resetFields()
              this.fileComp.setState({ fileList: [] })
              this.setState({ file: {} })
              this.countDown()

              //获取预警详情
              request(`/supplychainfinance-audit/earlyWariningRecord/getRecordDeatilById?id=${id}`,
                { method: 'get' }).then(res => {
                  if (res && res.code === 0) {
                    this.setState({
                      warningDetail: res.data
                    })
                  } else {
                    message.error('获取预警详情失败：' + res.msg)
                    this.setState({
                      warningDetail: {},
                    })
                  }
                })

              //获取操作日志
              request(`/supplychainfinance-audit/earlyWariningRecord/getLogsByOrderId?currentPage=1&orderId=${orderId}&pageSize=10`,
                { method: 'get' }).then(res => {
                  if (res && res.code === 0) {
                    this.setState({
                      ...res.page,
                      logs: res.data,
                    })
                  } else {
                    message.error('获取操作日志失败：' + res.data)
                    this.setState({
                      logs: [],
                      currentPage: 1,
                      pageSize: 10,
                      totalPage: 0,
                      totalRecords: 0,
                    })
                  }
                })

            } else if (res) {
              message.error(res.msg)
            } else {
              message.error('获取数据失败')
            }
          })
        }
      }
    })
  }

  cancel = () => {
    const { orderId } = this.state.warningDetail
    router.push(`/orderManage/details?enterType=1&key=warning&id=${orderId}`)
  }

  onChange = (current) => {
    const { pageSize } = this.state;
    const { orderId } = this.state.warningDetail

    //获取操作日志
    request(`/supplychainfinance-audit/earlyWariningRecord/getLogsByOrderId?currentPage=${current}&orderId=${orderId}&pageSize=${pageSize}`,
      { method: 'get' }).then(res => {
        if (res && res.code === 0) {
          this.setState({
            ...res.page,
            logs: res.data,
          })
        } else if (res) {
          message.error('获取操作日志失败：' + res.msg)
        } else {
          message.error('获取操作日志失败')
        }
      })
  }

  onShowSizeChange = (current, size) => {
    const { orderId } = this.state.warningDetail

    //获取操作日志
    request(`/supplychainfinance-audit/earlyWariningRecord/getLogsByOrderId?currentPage=${1}&orderId=${orderId}&pageSize=${size}`,
      { method: 'get' }).then(res => {
        if (res && res.code === 0) {
          this.setState({
            ...res.page,
            logs: res.data,
          })
        } else if (res) {
          message.error('获取操作日志失败：' + res.msg)
        } else {
          message.error('获取操作日志失败')
        }
      })
  }

  getComponent = (comp) => {
    this.fileComp = comp
    this.fileComp.setState({ fileList: [] })
  }

  FileUpload = (value) => {
    if (this.fileComp.state.fileList.length > 1) {
      const file = this.fileComp.state.fileList.shift()
      const newArr = [];
      newArr.push(file)
      this.fileComp.setState({
        fileList: newArr
      })
    }
    let params = {
      annexName: value.name,
      annexUrl: value.value
    }
    this.setState({
      file: params
    })
  }

  //撤销申请按钮
  backApproval = () => {
    const { id, orderId } = this.state.warningDetail
    const { pageSize } = this.state

    request(`/supplychainfinance-audit/earlyWariningRecord/cacelApplyWariningRecord?id=${id}&orderId=${orderId}`, {
      method: 'GET',
    }).then(res => {
      if (res && res.code === 0) {
        message.success(res.msg)

        //获取预警详情
        request(`/supplychainfinance-audit/earlyWariningRecord/getRecordDeatilById?id=${id}`,
          { method: 'get' }).then(res => {
            if (res && res.code === 0) {
              this.setState({
                warningDetail: res.data
              })
            } else {
              message.error('获取预警详情失败：' + res.msg)
            }
          })

        //获取操作日志
        request(`/supplychainfinance-audit/earlyWariningRecord/getLogsByOrderId?currentPage=${1}&orderId=${orderId}&pageSize=${pageSize}`,
          { method: 'get' }).then(res => {
            if (res && res.code === 0) {
              this.setState({
                ...res.page,
                logs: res.data,
              })
            } else if (res) {
              message.error(res.msg)
            } else {
              message.error('获取数据失败')
            }
          })
      } else if (res) {
        message.error(res.msg)
      } else {
        message.error('获取数据失败')
      }
    })
  }

  render() {
    const { currentPage, pageSize, totalPage, totalRecords, params, warningDetail, logs, steps } = this.state;
    const FormItem = Form.Item;
    let content = null;
    const { getFieldDecorator } = this.props.form;
    const { warningType, warningStatus } = warningDetail
    const { roleId } = this.props.global.role
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
    }
    if (warningType == 0) {//提示信息页面
      content =
        <div className={styles.formwrapper} >
          <Card
            title="信息详情"
            style={{ minHeight: 463 }}
            bordered={false}
          >
            <div style={{ minHeight: 463 }}>
              <div className={styles.headWrap}>
                <div className={styles.formHead}>供应链订单编号：<span>{warningDetail.orderId}</span></div>
                <div className={styles.formHead}>业务类型：<span>{warningDetail.businessMode === 0 ? '委托采购' : warningDetail.businessMode == 1 ? '委托销售' : warningDetail.businessMode === 2 ? '金融仓储' : '大型企业委托采购'}</span></div>
                <div className={styles.formHead}>信息名称：<span>{warningDetail.warningName}</span></div>
              </div>
              <div className={styles.warning} style={{ backgroundColor: '#FFFBD6', borderColor: '#FFFBD6' }}>
                <h2 style={{ fontWeight: 600 }}>提示信息：</h2>
                <p>{warningDetail.warningContent}</p>
                <p style={{ textAlign: "right" }}>{warningDetail.operateTime}</p>
              </div>
              <Form onSubmit={this.handleOk}>
                <FormItem  {...formItemLayout} label="操作说明">
                  {
                    getFieldDecorator('operateReason', {
                      rules: [
                        { required: true, message: '请输入操作说明！' },
                      ],
                    })(
                      <TextArea placeholder="请输入"></TextArea>
                    )
                  }
                </FormItem>
                <FormItem  {...formItemLayout} label="附件上传" extra="支持扩展名：.doc .docx .pdf .jpg...">
                  {
                    getFieldDecorator('upload')(
                      <FileUpload onChange={this.FileUpload.bind(this)} labelInValue={true}
                        getComponent={this.getComponent}
                      />
                    )
                  }
                </FormItem>
                <Divider />
                <Row>
                  <Col span={24} style={{ textAlign: 'right' }}>
                    <Button onClick={this.cancel}>取消</Button>
                    <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                      确定
                                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Card>
        </div>

    } else if (warningStatus == 1) {//预警状态为已处理对应页面
      content =
        <div className={styles.formwrapper} >
          <Card
            title="信息详情"
            style={{ minHeight: 463 }}
            bordered={false}
          >
            <div style={{ minHeight: 463 }}>
              <div className={styles.headWrap}>
                <div className={styles.formHead}>供应链订单编号：<span>{warningDetail.orderId}</span></div>
                <div className={styles.formHead}>业务类型：<span>{warningDetail.businessMode === 0 ? '委托采购' : warningDetail.businessMode == 1 ? '委托销售' : warningDetail.businessMode === 2 ? '金融仓储' : '大型企业委托采购'}</span></div>
                <div className={styles.formHead}>信息名称：<span>{warningDetail.warningName}</span></div>
              </div>
              <div className={styles.warning} >
                <h2 style={{ fontWeight: 600 }}>预警信息：</h2>
                <p>{warningDetail.warningContent}</p>
                <p style={{ textAlign: "right" }}>{warningDetail.operateTime}</p>
              </div>
              <Form onSubmit={this.handleOk}>
                <FormItem  {...formItemLayout} label="紧急处理">
                  {
                    getFieldDecorator('dealType', {
                      rules: [
                        { required: true, message: '请选择处理方式！' },
                      ],
                    })(
                      <Radio.Group>
                        <Radio value="2">解除预警</Radio>
                        <Radio value="3">冻结订单</Radio>
                      </Radio.Group>
                    )
                  }
                </FormItem>
                <FormItem  {...formItemLayout} label="操作说明">
                  {
                    getFieldDecorator('operateReason', {
                      rules: [
                        { required: true, message: '请输入操作说明！' },
                      ],
                    })(
                      <TextArea placeholder="请输入"></TextArea>
                    )
                  }
                </FormItem>
                <FormItem  {...formItemLayout} label="附件上传" extra="支持扩展名：.doc .docx .pdf .jpg...">
                  {
                    getFieldDecorator('upload')(
                      <FileUpload onChange={this.FileUpload.bind(this)} labelInValue={true} />
                    )
                  }
                </FormItem>
                <Divider />
                <Row>
                  <Col span={24} style={{ textAlign: 'right' }}>
                    <Button onClick={this.cancel}>取消</Button>
                    <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                      确定
                                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Card>
        </div>
    } else if (warningStatus == 4) {//预警状态为已解除对应页面
      content =
        <div className={styles.formwrapper} >
          <Card
            title="信息详情"
            style={{ minHeight: 463 }}
            bordered={false}
          >
            <div style={{ minHeight: 463 }}>
              <div className={styles.headWrap}>
                <div className={styles.formHead}>供应链订单编号：<span>{warningDetail.orderId}</span></div>
                <div className={styles.formHead}>业务类型：<span>{warningDetail.businessMode === 0 ? '委托采购' : warningDetail.businessMode == 1 ? '委托销售' : warningDetail.businessMode === 2 ? '金融仓储' : '大型企业委托采购'}</span></div>
                <div className={styles.formHead}>信息名称：<span>{warningDetail.warningName}</span></div>
              </div>
              <h2 style={{ marginTop: 30 }}>已解除...</h2>
              <div className={styles.warning} style={{ marginBottom: 30 }}>
                <h2 style={{ fontWeight: 600 }}>预警信息：</h2>
                <p>{warningDetail.warningContent}</p>
                <p style={{ textAlign: "right" }}>{warningDetail.operateTime}</p>
              </div>
            </div>
          </Card>
        </div>
    } else if (warningStatus == 3) {//预警状态为已冻结对应页面
      content =
        <div className={styles.formwrapper} >
          <Card
            title="信息详情"
            style={{ minHeight: 463 }}
            bordered={false}
          >
            <div style={{ minHeight: 463 }}>
              <div className={styles.headWrap}>
                <div className={styles.formHead}>供应链订单编号：<span>{warningDetail.orderId}</span></div>
                <div className={styles.formHead}>业务类型：<span>{warningDetail.businessMode === 0 ? '委托采购' : warningDetail.businessMode == 1 ? '委托销售' : warningDetail.businessMode === 2 ? '金融仓储' : '大型企业委托采购'}</span></div>
                <div className={styles.formHead}>信息名称：<span>{warningDetail.warningName}</span></div>
              </div>
              <div className={styles.warning} >
                <h2 style={{ fontWeight: 600 }}>预警信息：</h2>
                <p>{warningDetail.warningContent}</p>
                <p style={{ textAlign: "right" }}>{warningDetail.operateTime}</p>
              </div>
              <Form onSubmit={this.handleOk}>
                <FormItem  {...formItemLayout} label="紧急处理">
                  {
                    getFieldDecorator('dealType', {
                      rules: [
                        { required: true, message: '请选择处理方式！' },
                      ],
                    })(
                      <Radio.Group>
                        <Radio value="4">解除冻结</Radio>
                      </Radio.Group>
                    )
                  }
                </FormItem>
                <FormItem  {...formItemLayout} label="操作说明">
                  {
                    getFieldDecorator('operateReason', {
                      rules: [
                        { required: true, message: '请输入操作说明！' },
                      ],
                    })(
                      <TextArea placeholder="请输入"></TextArea>
                    )
                  }
                </FormItem>
                <FormItem  {...formItemLayout} label="附件上传" extra="支持扩展名：.doc .docx .pdf .jpg...">
                  {
                    getFieldDecorator('upload')(
                      <FileUpload onChange={this.FileUpload.bind(this)} labelInValue={true} />
                    )
                  }
                </FormItem>
                <Divider />
                <Row>
                  <Col span={24} style={{ textAlign: 'right' }}>
                    <Button onClick={this.cancel}>取消</Button>
                    <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                      确定
                                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Card>
        </div>

    } else if (warningStatus == 2) {//预警状态为申请中对应页面
      if (roleId === 6 || roleId === 7) {//风控专员和业务风控对应页面
        content =
          <div className={styles.formwrapper} >
            <Card
              title="信息详情"
              extra={<Button type="primary" onClick={this.backApproval}>撤回申请</Button>}
              style={{ minHeight: 463 }}
              bordered={false}
            >
              <div style={{ minHeight: 463 }}>
                <div className={styles.headWrap}>
                  <div className={styles.formHead}>供应链订单编号：<span>{warningDetail.orderId}</span></div>
                  <div className={styles.formHead}>业务类型：<span>{warningDetail.businessMode === 0 ? '委托采购' : warningDetail.businessMode == 1 ? '委托销售' : warningDetail.businessMode === 2 ? '金融仓储' : '大型企业委托采购'}</span></div>
                  <div className={styles.formHead}>信息名称：<span>{warningDetail.warningName}</span></div>
                </div>
                <h2 style={{ marginTop: 30 }}>{warningDetail.nowOperateType == 3 ? '冻结订单申请中...' : warningDetail.nowOperateType == 5 ? '解除冻结申请中...' : warningDetail.nowOperateType == 1 ? '添加预警申请中...' : '解除预警申请中...'}</h2>
                <div className={styles.warning} style={{ marginBottom: 30 }}>
                  <h2 style={{ fontWeight: 600 }}>预警信息：</h2>
                  <p>{warningDetail.warningContent}</p>
                  <p style={{ textAlign: "right" }}>{warningDetail.operateTime}</p>
                </div>
                <span style={{ color: 'black' }}>操作说明：</span>
                <span>{warningDetail.nowOperateReason || '无'}</span>
              </div>
            </Card>
          </div>
      } else {//风控负责人对应页面
        content =
          <div className={styles.formwrapper} style={{ minHeight: 315 }}>
            <Card
              title="信息详情"
              style={{ minHeight: 463 }}
              bordered={false}
            >
              <div style={{ minHeight: 463 }}>
                <div className={styles.headWrap}>
                  <div className={styles.formHead}>供应链订单编号：<span>{warningDetail.orderId}</span></div>
                  <div className={styles.formHead}>业务类型：<span>{warningDetail.businessMode === 0 ? '委托采购' : warningDetail.businessMode == 1 ? '委托销售' : warningDetail.businessMode === 2 ? '金融仓储' : '大型企业委托采购'}</span></div>
                  <div className={styles.formHead}>信息名称：<span>{warningDetail.warningName}</span></div>
                </div>
                <div className={styles.warning} >
                  <h2 style={{ fontWeight: 600 }}>预警信息：</h2>
                  <p>{warningDetail.warningContent}</p>
                  <p style={{ textAlign: "right" }}>{warningDetail.operateTime}</p>
                </div>
                <Form onSubmit={this.handleOk}>
                  <FormItem  {...formItemLayout} label="审核">
                    {
                      getFieldDecorator('isPass', {
                        rules: [
                          { required: true, message: '请选择审核结果！' },
                        ],
                      })(
                        <Radio.Group>
                          <Radio value="1">通过</Radio>
                          <Radio value="0">不通过</Radio>
                        </Radio.Group>
                      )
                    }
                  </FormItem>
                  <FormItem  {...formItemLayout} label="操作说明">
                    {
                      getFieldDecorator('operateReason', {
                        rules: [
                          { required: true, message: '请输入操作说明！' },
                        ],
                      })(
                        <TextArea placeholder="请输入"></TextArea>
                      )
                    }
                  </FormItem>
                  <FormItem  {...formItemLayout} label="附件上传" extra="支持扩展名：.doc .docx .pdf .jpg...">
                    {
                      getFieldDecorator('upload')(
                        <FileUpload onChange={this.FileUpload.bind(this)} labelInValue={true}

                        />
                      )
                    }
                  </FormItem>
                  <Divider />
                  <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                      <Button onClick={this.cancel}>取消</Button>
                      <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                        确定
                                    </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Card>
          </div>
      }
    } else {//其他预警状态对应页面
      content =
        <div className={styles.formwrapper} >
          <Card
            title="信息详情"
            style={{ minHeight: 463 }}
            bordered={false}
          >
            <div style={{ minHeight: 463 }}>
              <div className={styles.headWrap}>
                <div className={styles.formHead}>供应链订单编号：<span>{warningDetail.orderId}</span></div>
                <div className={styles.formHead}>业务类型：<span>{warningDetail.businessMode === 0 ? '委托采购' : warningDetail.businessMode == 1 ? '委托销售' : warningDetail.businessMode === 2 ? '金融仓储' : '大型企业委托采购'}</span></div>
                <div className={styles.formHead}>信息名称：<span>{warningDetail.warningName}</span></div>
              </div>
              <div className={styles.warning} >
                <h2 style={{ fontWeight: 600 }}>预警信息：</h2>
                <p>{warningDetail.warningContent}</p>
                <p style={{ textAlign: "right" }}>{warningDetail.operateTime}</p>
              </div>
              <Form onSubmit={this.handleOk}>
                <FormItem  {...formItemLayout} label="紧急处理">
                  {
                    getFieldDecorator('dealType', {
                      rules: [
                        { required: true, message: '请选择处理方式！' },
                      ],
                    })(
                      <Radio.Group>
                        <Radio value="1">核实预警</Radio>
                        <Radio value="2">解除预警</Radio>
                        <Radio value="3">冻结订单</Radio>
                      </Radio.Group>
                    )
                  }
                </FormItem>
                <FormItem  {...formItemLayout} label="操作说明">
                  {
                    getFieldDecorator('operateReason', {
                      rules: [
                        { required: true, message: '请输入操作说明！' },
                      ],
                    })(
                      <TextArea placeholder="请输入"></TextArea>
                    )
                  }
                </FormItem>
                <FormItem  {...formItemLayout} label="附件上传" extra="支持扩展名：.doc .docx .pdf .jpg...">
                  {
                    getFieldDecorator('upload')(
                      <FileUpload onChange={this.FileUpload.bind(this)} labelInValue={true}
                        getComponent={this.getComponent}
                      />
                    )
                  }
                </FormItem>
                <Divider />
                <Row>
                  <Col span={24} style={{ textAlign: 'right' }}>
                    <Button onClick={this.cancel}>取消</Button>
                    <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                      确定
                                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Card>
        </div>

    }
    const columns = [{
      title: '操作类型',
      dataIndex: 'operateTypeName',
      key: 'operateTypeName',
    }, {
      title: '操作员',
      dataIndex: 'operateName',
      key: 'operateName',
    }, {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
    }, {
      title: '操作说明',
      dataIndex: 'operateReason',
      key: 'operateReason',
    }, {
      title: '查看附件',
      dataIndex: 'annexUrl',
      key: 'annexUrl',
      render: (text, row, record) => <a href={row.annexUrl ? row.annexUrl : 'javascript:;'}>附件信息</a>,
    }];
    return (
      <div className={styles.container}>

        <div className={styles.handle} style={{ marginBottom: 20 }}>
          <div className={styles.step}>
            <Card
              title='业务进度'
              bordered={false}
            >
              {
                steps.length > 0
                  ?
                  steps.map((item, index) => {
                    return (
                      <div className={styles.steps} key={index}>
                        <img src={green} alt="icon" />
                        <img src={line} alt="line" className={styles.line} />
                        <span style={{ marginLeft: 10 }}>{item.orderProcessNodeName}</span>
                        <span className={styles.stepTime}>{item.orderProcessNodeDate}</span>
                      </div>
                    )
                  })
                  :
                  null
              }

            </Card>
          </div>
          {content}
        </div>
        <div className={styles.log}>
          <Card
            title="操作日志"

          >
            <Table columns={columns} dataSource={logs}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                defaultCurrent: 1,
                defaultPageSize: 10,
                current: currentPage,
                pageSize: pageSize,
                total: totalRecords,
                onChange: this.onChange.bind(this),
                pageSizeOptions: ["10", "20", "30"],
                showTotal: (total, range) => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
                onShowSizeChange: this.onShowSizeChange.bind(this)
              }}
            />
          </Card>
        </div>
      </div>

    )
  }
}

