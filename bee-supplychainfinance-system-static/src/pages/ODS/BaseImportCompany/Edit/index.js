import { Component } from 'react';
import { Button, Form, Breadcrumb, Select, Input, Row, Col, message } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getDataById,
  saveData
} from '../services';

const FormItem = Form.Item;
const { Option } = Select;

@withRouter
@Form.create()
export default class Index extends Component {
  state = {
  }

  componentDidMount() {
    const { id } = this.props.location.query;
    const { setFieldsValue } = this.props.form;
    if (id !== undefined) {
      getDataById(id).then(res => {
        if (res.code === 0) {
          setFieldsValue({
            companyType: res.data.companyType,
            companyName: res.data.companyName,
            companyCode: res.data.companyCode
          })
        } else {
          message.error('查询国企/央企失败：' + res.msg);
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
          ...values
        }

        if (id !== undefined) {
          params['id'] = id
        }

        saveData(params).then(res => {
          if (res.code === 0) {
            message.success('保存国企/央企成功！');
            router.goBack();
          } else {
            message.error('保存国企/央企失败:' + res.msg);
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { id } = this.props.location.query;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/home">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/macrofinance/MacroIndex">数据仓库</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/baseImportCompany/index"></Link>国企/央企名单</Breadcrumb.Item>
            <Breadcrumb.Item>{id === undefined ? '添加' : '编辑'}企业</Breadcrumb.Item>
          </Breadcrumb>

          <h2>国企/央企数据</h2>

          <div>
            操作：可编辑、添加和删除国企/央企数据。
            <Button onClick={() => router.goBack()} className={styles.back} icon="rollback" type='primary' >返回</Button>
          </div>
        </div>

        <div className={styles.body}>
          <Form>
            <FormItem label="类型选择">
              {
                getFieldDecorator('companyType', {
                  rules: [{ required: true, message: '请选择类型选择' }]
                })(
                  <Select allowClear={false} style={{ width: 240 }} placeholder="请选择">
                    <Option value="央企">央企</Option>
                    <Option value="国企">国企</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="企业名称（中文）">
              {
                getFieldDecorator('companyName', {
                  rules: [{ required: true, message: '请输入企业中文全名' }]
                })(
                  <Input allowClear={false} style={{ width: 480 }} placeholder="企业中文全名（必填）" />
                )
              }
            </FormItem>
            <FormItem label="统一社会信用代码">
              {
                getFieldDecorator('companyCode', {
                  rules: [{ required: true, message: '请输入统一社会信用代码' }]
                })(
                  <Input allowClear={false} style={{ width: 480 }} placeholder="统一社会信用代码（必填）" />
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
