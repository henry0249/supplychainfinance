import { Component } from 'react';
import { Breadcrumb, Form, Row, Input, Select, InputNumber, Button, Cascader, message } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from './index.less';
import NewUpload from '@/components/NewUpload';
import { districtDataHandle } from '@/common/utils';
import apis from '../api';
import request from '@/common/request'
import router from 'umi/router';
import {
  getCompanyInfo
} from '../../../services/index'

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

@Form.create()
@connect(({ global, loading }) => ({
  global
}))
export default class Information extends Component {
  state = {
    data: {},
    region: null,
    industry: null,
    defaultRegion: [],
    logosPercent: 0,
    enclosuresPercent: 0,
    permitsPercent: 0,
    certificatesPercent: 0,
    companyList: []
  }

  componentDidMount() {
    this.id = Number(this.props.location.query.id)
    const { setFieldsValue } = this.props.form
    request(apis.getRegion.api())
      .then(resp => {
        if (resp.code === 0 && resp.data.length) {
          const region = districtDataHandle(resp.data[0].children)
          this.setState({
            region
          }, () => {
            if (this.id) {
              getCompanyInfo(this.id).then(res1 => {
                if (res1 && res1.code === 0) {
                  if (res1.data.regionid) {
                    request(apis.findAllRegionById.api(res1.data.regionid)).then(res2 => {
                      const regionid = [res2.data.province.id, res2.data.city.id, res2.data.county.id]
                      const { enterpriseName, contact, street, linkman, } = res1.data
                      let permitsList = [], enclosuresList = []
                      if (res1.data.permitsList && res1.data.permitsList[0] && res1.data.permitsList[0].url)
                        permitsList = res1.data.permitsList.map(item => { return { ...item, status: 'done', uid: item.url, } })
                      if (res1.data.enclosuresList && res1.data.enclosuresList[0] && res1.data.enclosuresList[0].url)
                        enclosuresList = res1.data.enclosuresList.map(item => { return { ...item, status: 'done', uid: item.url } })
                      //  uid: index,
                      //  name: item.name,
                      //  status: 'done',
                      //  url: item.url,
                      setFieldsValue({ enterpriseName, contact, street, regionid, permitsList, enclosuresList, linkman })
                    })
                  }

                  this.setState(
                    {
                      data: res1.data
                    },
                    () => {
                      // setFieldsValue({
                      //   // userId: this.state.data.userDTOs[0].nickname
                      // })
                    }
                  )
                } else {
                  message.error(res1.msg)
                }
              })
            }
          })
        } else {
          this.setState({
            region: null
          }, () => message.error('获取所有省市区失败：' + resp.msg))
        }
      })
    // request(apis.flat.api()).then(resp => {
    //   if (resp && resp.code === 0) {
    //     this.setState({
    //       companyList: resp.data
    //     })
    //   } else {
    //     message.error(resp.msg)
    //   }
    // })
  }

  beforeUpload = (file) => {
    const isMax10M = file.size / 1024 / 1024 < 10; // 最大10M
    this.setState({
      logosPercent: 0
    })
    if (!isMax10M) {
      message.error("文件大小最大支持10M！");
    }
    return isMax10M;
  }

  beforeUploadEnclosures = (file) => {
    const isMax10M = file.size / 1024 / 1024 < 10; // 最大10M
    this.setState({
      enclosuresPercent: 0
    })
    if (!isMax10M) {
      message.error("文件大小最大支持10M！");
    }
    return isMax10M;
  }

  beforeUploadPermits = (file) => {
    const isMax10M = file.size / 1024 / 1024 < 10; // 最大10M
    this.setState({
      permitsPercent: 0
    })
    if (!isMax10M) {
      message.error("文件大小最大支持10M！");
    }
    return isMax10M;
  }

  beforeUploadCertificates = (file) => {
    const isMax10M = file.size / 1024 / 1024 < 10; // 最大10M
    this.setState({
      certificatesPercent: 0
    })
    if (!isMax10M) {
      message.error("文件大小最大支持10M！");
    }
    return isMax10M;
  }

  handleChange = ({ file, fileList }) => {
    const { logosPercent } = this.state;
    if (file.status === 'uploading') {
      if (logosPercent < 89) {
        this.setState({
          logosPercent: logosPercent + 10,
        });
      } else {
        this.setState({
          logosPercent: 99,
        });
      }
    } else if (file.status === 'done') {
      this.setState({
        logosPercent: 100
      })
    } else if (file.status === 'error') {
      this.setState({
        logosPercent: 101
      }, () => message.error("企业logo上传异常，请重试"))
      return []
    }
    return fileList.map(item => ({
      uid: item.uid,
      name: item.name,
      status: 'done',
      url: item.response ? item.response.object.access_url : item.url,
    }));
  };

  // 营业执照
  handleOnChangeEnclosures = ({ file, fileList }) => {
    const { enclosuresPercent } = this.state;
    if (file.status === 'uploading') {
      if (enclosuresPercent < 89) {
        this.setState({
          enclosuresPercent: enclosuresPercent + 10,
        });
      } else {
        this.setState({
          enclosuresPercent: 99,
        });
      }
    } else if (file.status === 'done') {
      this.setState({
        enclosuresPercent: 100
      })
    } else if (file.status === 'error') {
      this.setState({
        enclosuresPercent: 101
      }, () => message.error("营业执照上传异常，请重试"))
      return []
    }
    return fileList.map(item => ({
      uid: item.uid,
      name: item.name,
      status: 'done',
      url: item.response ? item.response.object.access_url : item.url,
    }));
  }

  // 营业许可证
  handleOnChangePermits = ({ file, fileList }) => {
    const { permitsPercent } = this.state;
    if (file.status === 'uploading') {
      if (permitsPercent < 89) {
        this.setState({
          permitsPercent: permitsPercent + 10,
        });
      } else {
        this.setState({
          permitsPercent: 99,
        });
      }
    } else if (file.status === 'done') {
      this.setState({
        permitsPercent: 100
      })
    } else if (file.status === 'error') {
      this.setState({
        permitsPercent: 101
      }, () => message.error("营业许可证上传异常，请重试"))
      return []
    }
    return fileList.map(item => ({
      uid: item.uid,
      name: item.name,
      status: 'done',
      url: item.response ? item.response.object.access_url : item.url,
    }));
  }

  // // 企业认证授权书
  // handleOnChangeCertificates = ({ file, fileList }) => {
  //   const { certificatesPercent } = this.state;
  //   if (file.status === 'uploading') {
  //     if (certificatesPercent < 89) {
  //       this.setState({
  //         certificatesPercent: certificatesPercent + 10,
  //       });
  //     } else {
  //       this.setState({
  //         certificatesPercent: 99,
  //       });
  //     }
  //   } else if (file.status === 'done') {
  //     this.setState({
  //       certificatesPercent: 100
  //     })
  //   } else if (file.status === 'error') {
  //     this.setState({
  //       certificatesPercent: 101
  //     }, () => message.error("企业认证授权书上传异常，请重试"))
  //     return []
  //   }
  //   return fileList.map(item => ({
  //     uid: item.uid,
  //     name: item.name,
  //     status: 'done',
  //     url: item.response ? item.response.object.access_url : item.url,
  //   }));
  // };

  onRemoveEnclosures = () => {
    this.setState({
      enclosuresPercent: 0
    })
    return true;
  }

  onRemovePermits = () => {
    this.setState({
      permitsPercent: 0
    })
    return true;
  }

  onRemoveCertificates = () => {
    this.setState({
      certificatesPercent: 0
    })
    return true;
  }

  onRemoveLogo = () => {
    this.setState({
      logosPercent: 0
    })
    return true;
  }

  onSubmit = () => {
    const { user } = this.props.global;
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        // console.log(values)
        let params = {
          // id: user.orgId,
          enterpriseName: values.enterpriseName,
          regionid: values.regionid[values.regionid.length - 1],
          street: values.street,
          contact: values.contact,
          industry: values.industry,
          linkman: values.linkman,
          nickname: values.nickname,
          // pid: values.pid,
        }

        if (values.logosList) {
          let logos = []
          values.logosList.forEach(item => {
            logos.push({
              name: item.name,
              url: item.url,
              type: 3
            })
          })
          params['logosList'] = logos;
        }

        if (values.enclosuresList) {
          let enclosures = []
          values.enclosuresList.forEach(item => {
            enclosures.push({
              name: item.name,
              url: item.url,
              type: 0
            })
          })
          params['enclosuresList'] = enclosures;
        }

        // if (values.certificatesList) {
        //   let certificates = []
        //   values.certificatesList.forEach(item => {
        //     certificates.push({
        //       name: item.name,
        //       url: item.url,
        //       type: 2
        //     })
        //   })
        //   params['certificatesList'] = certificates;
        // }

        if (values.permitsList) {
          let permits = []
          values.permitsList.forEach(item => {
            permits.push({
              name: item.name,
              url: item.url,
              type: 1
            })
          })
          params['permitsList'] = permits;
        }

        params.platformEnterpriseId = this.id
        request(apis.modifyEnterprise.api(), { method: apis.modifyEnterprise.type, body: params })
          .then(res => {
            if (res.code === 0) {
              router.push('/manage/information')
              message.success(res.msg)
            } else {
              message.error(res.msg)
            }
          })
      }
    })
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { region, industry, defaultRegion, logosPercent, enclosuresPercent, permitsPercent, certificatesPercent, companyList } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <Breadcrumb className={styles.breadcrumb}>
            <Breadcrumb.Item><Link to='/home'>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item>企业管理</Breadcrumb.Item>
            <Breadcrumb.Item><Link to='/manage/information'>企业信息</Link></Breadcrumb.Item>
          </Breadcrumb>
          <span className={styles.title}>修改企业信息</span>
        </div>

        <div className={styles.body}>
          <span className={styles.boxTitle}>企业信息</span>
          <div className={styles.main}>
            <Form layout='inline'>
              {/*  
              <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} style={{ display: 'flex', alignItems: 'center' }} label='企业logo'>
                  {getFieldDecorator('logosList', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.handleChange,
                  })(
                    // <Upload
                    //   listType="picture-card"
                    //   className="avatar-uploader"
                    //   showUploadList={false}
                    //   action={`${config.domain}/api/files/uploadFile`}
                    //   beforeUpload={this.beforeUpload}
                    // >
                    //   {logosUrl ? <img style={{ width: 100, height: 100 }} src={logosUrl} alt="avatar" /> : uploadButton}
                    // </Upload>
                    <NewUpload
                      accept='image/jpg, image/jpeg, image/png'
                      percent={logosPercent}
                      number={1}
                      beforeUpload={this.beforeUpload}
                      onRemove={this.onRemoveLogo}
                    />
                  )}
                </FormItem>
              </Row> */}

              <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} label='公司名称'>
                  {
                    getFieldDecorator('enterpriseName', {
                      rules: [
                        { required: true, message: '请输入公司名称' }
                      ]
                    })(
                      <Input style={{ width: 480 }} placeholder="请输入公司名称" />
                    )
                  }
                </FormItem>
              </Row>
              {/* <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} label='上级公司'>
                  {
                    getFieldDecorator('pid', {
                      rules: [
                        { required: true, message: '请选择上级公司' }
                      ]
                    })(
                      <Select style={{ width: 480 }} placeholder="请选择上级公司">
                        {
                          companyList && companyList.map(item => {
                            return <Option value={item.value} key={item.value}>{item.label}</Option>
                          })
                        }
                      </Select>
                    )
                  }
                </FormItem>
              </Row> */}
              <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} label='公司地址'>
                  {
                    getFieldDecorator('regionid', {
                      initialValue: defaultRegion,
                      rules: [
                        { required: true, message: '请选择公司地址' }
                      ]
                    })(
                      <Cascader
                        options={region}
                        placeholder="请选择公司地址"
                        style={{ width: 480 }}
                      />
                    )
                  }
                </FormItem>
              </Row>

              <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} label='详细地址'>
                  {
                    getFieldDecorator('street', {
                      rules: [
                        { required: true, message: '请输入详细地址' }
                      ]
                    })(
                      <Input style={{ width: 480 }} placeholder="请输入详细地址" />
                    )
                  }
                </FormItem>
              </Row>

              <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} label='公司联系方式'>
                  {
                    getFieldDecorator('contact', {
                      rules: [
                        { required: true, message: '请输入公司联系方式' }
                      ]
                    })(
                      <Input style={{ width: 480 }} placeholder="请输入公司联系方式" />
                    )
                  }
                </FormItem>
              </Row>

              {/* <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} label='所属行业'>
                  {
                    getFieldDecorator('industry', {
                      rules: [
                        { required: true, message: '请选择所属行业' }
                      ]
                    })(
                      <Select style={{ width: 480 }} placeholder="请选择所属行业">
                        {
                          industry && industry.map((every, i) => {
                            return every.map((item, index) => {
                              if (item.level === 1) {
                                return <OptGroup label={item.industry} key={item.id}>
                                  {
                                    every.map((row, key) => {
                                      if (row.level === 2) {
                                        return <Option value={row.id} key={row.id}>{row.industry}</Option>
                                      }
                                    })
                                  }
                                </OptGroup>
                              }
                            })
                          })
                        }
                      </Select>
                    )
                  }
                </FormItem>
              </Row> */}

              <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} label='指定联系人'>
                  {
                    getFieldDecorator('linkman', {
                      rules: [
                        { required: true, message: '请输入联系人手机号' }
                      ]
                    })(
                      <InputNumber style={{ width: 480 }} placeholder="请输入联系人手机号" />
                    )
                  }
                </FormItem>
                {/* <FormItem className={styles.formitem} label='指定手机号'>
                  {
                    getFieldDecorator('phone', {
                      rules: [
                        { required: true, message: '请输入指定手机号' },
                        {
                          validator: (rule, value, callback) => {
                            let tel = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
                            console.log(rule)
                            if (!value) {
                              callback(' ');
                            } else if (!tel.test(value)) {
                              callback('手机号格式不正确！');
                            } else {
                              callback();
                            }
                          }
                        }
                      ]
                    })(
                      <Input style={{ width: 480 }} placeholder="请输入指定手机号" />
                    )
                  }
                </FormItem> */}
              </Row>

              {/* <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} label='联系人名称'>
                  {
                    getFieldDecorator('nickname', {
                      rules: [
                        { required: false, message: '请输入联系人名称' }
                      ]
                    })(
                      <Input style={{ width: 480 }} placeholder="请输入联系人名称" />
                    )
                  }
                </FormItem>
              </Row> */}

              <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} style={{ display: 'flex', alignItems: 'center' }} label='营业执照'>
                  {getFieldDecorator('enclosuresList', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.handleOnChangeEnclosures,
                    rules: [
                      { required: true, message: '请上传营业执照' },
                    ]
                  })(
                    <NewUpload
                      accept='image/jpg, image/jpeg, image/png'
                      percent={enclosuresPercent}
                      number={3}
                      beforeUpload={this.beforeUploadEnclosures}
                      onRemove={this.onRemoveEnclosures}
                    />
                  )}
                </FormItem>
              </Row>

              <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} style={{ display: 'flex', alignItems: 'center' }} label='开户许可证'>
                  {getFieldDecorator('permitsList', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.handleOnChangePermits
                  })(
                    <NewUpload
                      accept='image/jpg, image/jpeg, image/png'
                      percent={permitsPercent}
                      number={3}
                      // fileList={fileList}
                      beforeUpload={this.beforeUploadCertificates}
                      onRemove={this.onRemoveCertificates}
                    />
                  )}
                </FormItem>
              </Row>

              {/* <Row style={{ marginTop: 20 }}>
                <FormItem className={styles.formitem} style={{ display: 'flex', alignItems: 'center' }} label='企业认证授权书'>
                  {getFieldDecorator('certificatesList', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.handleOnChangeCertificates,
                    rules: [
                      { required: true, message: '请上传企业认证授权书' },
                    ]
                  })(
                    <NewUpload
                      accept='image/jpg, image/jpeg, image/png'
                      percent={certificatesPercent}
                      number={3}
                      beforeUpload={this.beforeUploadPermits}
                      onRemove={this.onRemoveCertificates}
                    />
                  )}
                </FormItem>
                <span
                  onClick={() => window.open('http://obs-fe91.obs.cn-south-1.myhuaweicloud.com/fcc91a4f5cb84bf28d369978e57c0c3c.doc')}
                  style={{ position: 'absolute', left: 71, bottom: 20, color: '#4875EC', cursor: 'pointer' }}
                >
                  下载模板
                </span>
              </Row> */}
            </Form>
          </div>
          <div className={styles.footer}>
            <Button onClick={() => resetFields()} style={{ color: '#999999' }}>清空</Button>
            <Button onClick={this.onSubmit.bind(this)} type="primary" style={{ backgroundColor: '#4875EC' }}>提交</Button>
          </div>
        </div>
      </div>
    )
  }
}