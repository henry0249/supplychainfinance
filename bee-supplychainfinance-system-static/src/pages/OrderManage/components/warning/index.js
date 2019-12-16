import React, { Component, Fragment } from 'react'
import { Card, Form, Button, Popconfirm, Pagination, Table, Modal, Alert, Input, message } from 'antd'
import { connect } from 'dva'
import withRouter from "umi/withRouter"
import OpLog from './components/opLog'
import FileUpload from '@/components/fileUpload'
import router from 'umi/router'
import request from '@/utils/request';
import green from "../../../../assets/green.png"
import line from "@/assets/line.png"
import red from "@/assets/red.png"
import styles from './index.less'

@withRouter
@Form.create()
@connect(({ warning, global }) => ({
  warning,
  global,
}))

//风控预警页面组件
export default class index extends Component {

  constructor(props) {
    super()
    this.state = {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: {},
      file: {},
      visible: false,
      warningLen: 0,
      list: [],
      key: 'warning',
      page: null
    }
    this.fileComp = ''
  }

  componentDidMount() {
    const { dispatch } = this.props
    const { id } = this.props.location.query
    const businessMode = JSON.parse(sessionStorage.getItem('businessMode'))

    //获取业务进度
    dispatch({
      type: 'warning/getSteps',
      payload: {
        id,
        businessMode,
      }
    })

    //获取预警信息列表
    dispatch({
      type: 'warning/getWarningList',
      payload: {
        url: `businessMode=${businessMode}&currentPage=1&orderId=${id}&pageSize=${4}`,
        id: 1
      },
      success: (resp) => {
        if (resp && resp.code === 0) {
          this.setState({
            ...resp.page
          })
        } else if (resp && resp.code === -1) {
          this.setState({
            currentPage: 1,
            pageSize: 4,
            totalPage: 0,
            totalRecords: 0,
          })
        } else if (resp) {
          this.setState({
            currentPage: 1,
            pageSize: 4,
            totalPage: 0,
            totalRecords: 0,
          })
        } else {
          this.setState({
            currentPage: 1,
            pageSize: 4,
            totalPage: 0,
            totalRecords: 0,
          })
        }

      }
    })
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  hideModal = () => {
    const { resetFields } = this.props.form
    resetFields()
    this.fileComp.setState({ fileList: [] })
    this.setState({
      visible: false,
      file: {},
    });
  }

  handleCancel = (e) => {
    const { resetFields } = this.props.form
    resetFields()
    this.fileComp.setState({ fileList: [] })
    this.setState({
      visible: false,
      file: {},
    });
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

  confirm = () => {
    const { validateFields, resetFields } = this.props.form
    const { dispatch } = this.props
    const { id, creator } = this.props.location.query
    const businessMode = JSON.parse(sessionStorage.getItem('businessMode'))
    const userName = this.props.global.user.fullName
    validateFields((err, value) => {
      if (!err) {
        let params = {}
        params['creator'] = userName
        params['orderId'] = id
        params['businessMode'] = businessMode

        if (value.warningInfo) {
          params['warningContent'] = value.warningInfo
        }

        if (value.upload) {
          params['annexName'] = this.state.file.annexName
          params['annexUrl'] = this.state.file.annexUrl
        }

        //增加预警
        dispatch({
          type: 'warning/addWarning',
          payload: params,
          success: (resp) => {
            if (resp && resp.code === 0) {
              resetFields()
              this.countDown()
              this.fileComp.setState({ fileList: [] })//将上传的文件列表置空
              this.setState({ file: {} })
              //刷新预警列表
              dispatch({
                type: 'warning/getWarningList',
                payload: {
                  url: `businessMode=${businessMode}&currentPage=1&orderId=${id}&pageSize=${4}`,
                  id: 1
                },
                success: (resp) => {
                  if (resp && resp.code === 0) {
                    this.setState({
                      ...resp.page
                    })
                  } else if (resp && resp.code === -1) {
                    this.setState({
                      currentPage: 1,
                      pageSize: 4,
                      totalPage: 0,
                      totalRecords: 0,
                    })
                  } else if (resp) {
                    this.setState({
                      currentPage: 1,
                      pageSize: 4,
                      totalPage: 0,
                      totalRecords: 0,
                    })
                  } else {
                    this.setState({
                      currentPage: 1,
                      pageSize: 4,
                      totalPage: 0,
                      totalRecords: 0,
                    })
                  }

                }
              })

              //刷新操作日志
              dispatch({
                type: 'warning/getLogs',
                payload: {
                  url: `currentPage=1&orderId=${id}&pageSize=${10}`,
                  id: 1
                },
                success: (resp) => {
                  if (resp && resp.code === 0) {
                    this.setState({
                      page: resp.page
                    })
                  } else if (resp && resp.code === -1) {
                    this.setState({
                      currentPage: 1,
                      pageSize: 10,
                      totalPage: 0,
                      totalRecords: 0,
                    })
                  } else if (resp) {
                    this.setState({
                      page: {
                        currentPage: 1,
                        pageSize: 10,
                        totalPage: 0,
                        totalRecords: 0,
                      }
                    })
                  } else {
                    this.setState({
                      page: {
                        currentPage: 1,
                        pageSize: 10,
                        totalPage: 0,
                        totalRecords: 0,
                      }
                    })
                  }
                }
              })
              this.setState({
                visible: false,
              }, () => {
              })
            } else if (resp && resp.code === -1) {
              this.setState({
                currentPage: 1,
                pageSize: 4,
                totalPage: 0,
                totalRecords: 0,
              })
            } else if (resp) {
              message.error(resp.msg)
            } else {
              message.error('获取预警列表失败')
            }
          }
        })
      } else {
        message.error("请确认输入是否正确！");

      }
    })
  }

  cancel = () => {

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

  onChange = (current) => {
    const { dispatch } = this.props;
    const { pageSize, params } = this.state;
    const { id } = this.props.location.query
    const businessMode = JSON.parse(sessionStorage.getItem('businessMode'))
    //获取预警信息列表
    dispatch({
      type: 'warning/getWarningList',
      payload: {
        url: `businessMode=${businessMode}&currentPage=${current}&orderId=${id}&pageSize=${pageSize}`,
        params: params
      },
      success: (resp) => {
        if (resp && resp.code === 0) {
          this.setState({
            ...resp.page
          })
        } else if (resp && resp.code === -1) {
          this.setState({
            currentPage: 1,
            pageSize: 4,
            totalPage: 0,
            totalRecords: 0,
          })
        } else if (resp) {
          message.error('获取预警信息列表失败：' + resp.msg)
          this.setState({
            currentPage: 1,
            pageSize: 4,
            totalPage: 0,
            totalRecords: 0,
          })
        } else {
          message.error('获取预警信息列表失败')
          this.setState({
            currentPage: 1,
            pageSize: 4,
            totalPage: 0,
            totalRecords: 0,
          })
        }

      }
    })
  }

  onShowSizeChange = (current, size) => {
    const { dispatch } = this.props;
    const { params } = this.state;
    const { id } = this.props.location.query
    const businessMode = JSON.parse(sessionStorage.getItem('businessMode'))
    //获取预警信息列表
    dispatch({
      type: 'warning/getWarningList',
      payload: {
        url: `businessMode=${businessMode}&currentPage=1&orderId=${id}&pageSize=${size}`,
        params: params
      },
      success: (resp) => {
        if (resp && resp.code === 0) {
          this.setState({
            ...resp.page
          })
        } else if (resp && resp.code === -1) {
          this.setState({
            currentPage: 1,
            pageSize: 4,
            totalPage: 0,
            totalRecords: 0,
          })
        } else if (resp) {
          message.error('获取预警信息列表失败：' + resp.msg)
          this.setState({
            currentPage: 1,
            pageSize: 4,
            totalPage: 0,
            totalRecords: 0,
          })
        } else {
          message.error('获取预警信息列表失败')
          this.setState({
            currentPage: 1,
            pageSize: 4,
            totalPage: 0,
            totalRecords: 0,
          })
        }

      }
    })
  }

  onClose = (e) => {

  }

  closeAlert = (e) => {
    this.setState({
      warningLen: e.target.value.length
    })

  }

  backTo = (payload) => {
    sessionStorage.setItem('orderDetail', JSON.stringify(payload))
    router.push({
      pathname: `warning/detail`,
      params: payload
    })
  }

  getComponent = (comp) => {
    this.fileComp = comp
  }

  render() {
    const { currentPage, pageSize, totalPage, totalRecords, params, list, page } = this.state
    const FormItem = Form.Item
    const userName = this.props.global.user.fullName
    const { id } = this.props.location.query
    const { steps, warningList } = this.props.warning
    const { TextArea } = Input
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    }
    const text = (
      <Fragment>
        <div style={{ fontWeight: 800 }}>请确认输入的预警信息是否正确！</div>
        <p>点击确定后将会生成一条预警信息,</p>
        <p>是否继续?</p>
      </Fragment>
    )

    return (
      <div className={styles.body}>
        <div className={styles.handle} style={{ marginBottom: 20 }}>
          <div className={styles.step}>
            <Card
              title='业务进度'
              bordered={false}
            >
              <div className={styles.cardWrapper}>
                {
                  steps && steps.length > 0
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
              </div>
            </Card>
          </div>
          <div className={styles.formwrapper}>
            <Card
              title="预警提示"
              extra={<Button type="primary" onClick={this.showModal}>增加预警</Button>}
              bordered={false}
            >
              <Modal
                title="增加预警信息"
                visible={this.state.visible}
                closable
                onCancel={this.hideModal}
                footer={[
                  <Button key="back" onClick={this.handleCancel}>取消</Button>,
                  <Popconfirm
                    title={text}
                    okText="确定"
                    cancelText="取消"
                    onConfirm={this.confirm}
                    onCancel={this.cancel}
                    placement="topRight"
                  >
                    <Button key="submit" type="primary" >
                      增加
                </Button>
                  </Popconfirm>
                ]}
              >
                <Form>
                  {
                    this.state.warningLen == 0
                      ?
                      <Alert
                        message="请输入预警信息！"
                        type="error"
                        closable
                        onClose={this.onClose}
                        showIcon
                      />
                      :
                      null
                  }

                  <FormItem {...formItemLayout} label="创建人：">
                    {
                      getFieldDecorator('name')(
                        <span>{userName}</span>
                      )
                    }
                  </FormItem>
                  <FormItem  {...formItemLayout} label="预警信息">
                    {
                      getFieldDecorator('warningInfo', {
                        rules: [
                          { required: true, message: '请输入至少五个字符', min: 5, whitespace: true },
                        ],
                      })(
                        <TextArea placeholder="请输入至少五个字符" onChange={this.closeAlert}></TextArea>
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
                </Form>
              </Modal>
              <div style={{ minHeight: 500 }}>
                {
                  warningList.length > 0
                    ?
                    warningList.map((item, index) => {
                      return (
                        <div className={styles.warning} onClick={this.backTo.bind(this, { id: item.id, orderId: item.orderId, orderStatus: item.orderStatus })} key={item.id}
                        >
                          <h2 style={{ fontWeight: 600 }} >预警信息：</h2>
                          <div className={styles.status} >状态：<span >{item.warningStatusName}</span></div>
                          <p key={index}>{item.warningContent}</p>
                          <p style={{ textAlign: "right" }} >{item.operateTime}</p>
                        </div>
                      )
                    })
                    :
                    null
                }
              </div>
              <Pagination
                showQuickJumper={true}
                showSizeChanger={true}
                defaultCurrent={1}
                defaultPageSize={10}
                current={currentPage}
                pageSize={pageSize}
                pageSizeOptions={["4", "10", "20", "30"]}
                total={totalRecords}
                showTotal={() => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`}
                onShowSizeChange={this.onShowSizeChange.bind(this)}
                onChange={this.onChange.bind(this)}
              />
            </Card>
          </div>
        </div>
        <div className={styles.log}>
          <OpLog page={page} id={id} />
        </div>
      </div>
    )
  }
}
