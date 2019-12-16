import { Component } from 'react';
import { Button, Form, Breadcrumb, Select, Input, Row, Col, DatePicker, message } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import moment from 'moment';
import {
  getAllProvince,
  getDataById,
  saveData
} from '../services';


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@withRouter
@Form.create()
export default class Index extends Component {
  state = {
    list: []
  }

  componentDidMount() {
    const { id } = this.props.location.query;
    const { setFieldsValue } = this.props.form;
    getAllProvince().then(res => {
      if (res.code === 0) {
        this.setState({
          list: res.data
        })
      } else {
        message.error('查询所有省份失败：' + res.msg);
      }
    })
    if (id !== undefined) {
      getDataById(id).then(res => {
        if (res.code === 0) {
          setFieldsValue({
            province: res.data.province,
            illegalEnterpriseName: res.data.illegalEnterpriseName,
            creditId: res.data.creditId,
            legalRepresentative: res.data.legalRepresentative,
            unlawfulActive: res.data.unlawfulActive || null,
            punishmentBook: res.data.punishmentBook || null,
            issuedTime: moment(res.data.issuedTime) || null
          })
        } else {
          message.error('查询环保失信企业失败：' + res.msg);
        }
      })
    }
  }

  handleSave = () => {
    const { validateFields } = this.props.form;
    const { id } = this.props.location.query;
    validateFields((err, values) => {
      if (!err) {
        let params = {
          ...values,
        }

        if (values.issuedTime) {
          params['issuedTime'] = moment(values.issuedTime).format("YYYY-MM-DD hh:mm:ss")
        }

        if (id !== undefined) {
          params['id'] = id
        }

        saveData(params).then(res => {
          if (res.code === 0) {
            message.success('保存环保失信企业成功！');
            router.goBack();
          } else {
            message.error('保存环保失信企业失败:' + res.msg);
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { id } = this.props.location.query;
    const { list } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/home">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/macrofinance/MacroIndex">数据仓库</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/baseLoseCreditList/index">环保失信企业名单</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{id === undefined ? '添加' : '编辑'}企业</Breadcrumb.Item>
          </Breadcrumb>

          <h2>环保失信企业数据</h2>

          <div>
            操作：可编辑、添加和删除环保失信企业数据。
            <Button onClick={() => router.goBack()} className={styles.back} icon="rollback" type='primary' >返回</Button>
          </div>
        </div>

        <div className={styles.body}>
          <Form>
            <FormItem label="省份">
              {
                getFieldDecorator('province', {
                  rules: [{ required: true, message: '请选择省份' }]
                })(
                  <Select allowClear={false} style={{ width: 240 }} placeholder="请选择">
                    {
                      list.length !== 0 && list.map(
                        item => <Option value={item.district} key={item.id}>{item.district}</Option>
                      )
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="企业名称（中文）">
              {
                getFieldDecorator('illegalEnterpriseName', {
                  rules: [{ required: true, message: '请输入企业中文全名' }]
                })(
                  <Input allowClear={false} style={{ width: 480 }} placeholder="企业中文全名（必填）" />
                )
              }
            </FormItem>
            <FormItem label="统一社会信用代码">
              {
                getFieldDecorator('creditId', {
                  rules: [{ required: true, message: '请输入统一社会信用代码' }]
                })(
                  <Input allowClear={false} style={{ width: 480 }} placeholder="统一社会信用代码（必填）" />
                )
              }
            </FormItem>
            <FormItem label="企业法人">
              {
                getFieldDecorator('legalRepresentative', {
                  rules: [{ required: true, message: '请输入企业法人' }]
                })(
                  <Input allowClear={false} style={{ width: 480 }} placeholder="企业法人（必填）" />
                )
              }
            </FormItem>
            <FormItem label="违法行为">
              {
                getFieldDecorator('unlawfulActive')(
                  <TextArea rows={4} style={{ width: 480 }} placeholder="（选填）" />
                )
              }
            </FormItem>
            <FormItem label="行政处罚决定书文号">
              {
                getFieldDecorator('punishmentBook')(
                  <Input allowClear={false} style={{ width: 480 }} placeholder="行政处罚决定书文号（选填）" />
                )
              }
            </FormItem>
            <FormItem label="下达时间">
              {
                getFieldDecorator('issuedTime')(
                  <DatePicker format="YYYY-MM-DD hh:mm:ss" allowClear={false} style={{ width: 240 }} placeholder="请选择下达时间" />
                )
              }
            </FormItem>
          </Form>
        </div>

        <Row type="flex" justify="end" align="middle" className={styles.footer}>
          <Col>
            <Button onClick={() => router.goBack()} style={{ marginRight: 24 }}>取消</Button>
            <Button onClick={this.handleSave.bind(this)} type='primary' >提交</Button>
          </Col>
        </Row>
      </div>
    )
  }
}
