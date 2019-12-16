import { Component } from 'react';
import { Button, Form, Breadcrumb, Select, Input, Row, Col, Modal, InputNumber, message } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getList,
  saveBaseGrossProfitRate,
  queryBySourceName
} from '../services';

const FormItem = Form.Item;
const { Option } = Select;

@withRouter
@Form.create()
export default class Index extends Component {
  state = {
    list: []
  }

  componentDidMount() {
    const { sourceName } = this.props.location.query;
    getList().then(res => {
      if (res.code === 0) {
        this.setState({
          list: res.data
        })
      } else {
        message.error('获取所有标的物列表失败：' + res.msg);
      }
    })
    if (sourceName) {
      this.query(sourceName)
    }
  }

  query = (name) => {
    const { setFieldsValue, resetFields } = this.props.form;
    queryBySourceName(name).then(res => {
      if (res.code === 0) {
        if (Object.keys(res.data).length !== 0) {
          setFieldsValue({
            sourceName: res.data.sourceName || null,
            grossProfitRate: res.data.grossProfitRate || null,
            equationRemark: res.data.equationRemark || null
          })
        } else {
          resetFields(['grossProfitRate', 'equationRemark'])
        }
      } else {
        message.error('查询标的物详细信息失败：' + res.msg);
      }
    })
  }

  handleSave = () => {
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        let params = {
          sourceName: values.sourceName,
          grossProfitRate: values.grossProfitRate
        }

        if (values.equationRemark) {
          params['equationRemark'] = values.equationRemark
        }

        saveBaseGrossProfitRate(params).then(res => {
          if (res.code === 0) {
            message.success('保存标的物名称"' + values.sourceName + '"成功！');
            router.goBack();
          } else {
            message.error('保存标的物名称"' + values.sourceName + '"失败:' + res.msg);
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { id, sourceName } = this.props.location.query;
    const { list } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/home">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/macrofinance/MacroIndex">数据仓库</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/baseGrossProfitRate/index"></Link>原料加工销售毛利率</Breadcrumb.Item>
            <Breadcrumb.Item>{id === undefined ? '添加' : '编辑'}标的物</Breadcrumb.Item>
          </Breadcrumb>

          <h2>原料加工销售毛利率数据</h2>

          <div>
            操作：可编辑、添加和删除原料加工销售毛利率数据。
            <Button onClick={() => router.goBack()} className={styles.back} icon="rollback" type='primary' >返回</Button>
          </div>
        </div>

        <div className={styles.body}>
          <Form>
            <FormItem label="标的物">
              {
                getFieldDecorator('sourceName', {
                  rules: [{ required: true, message: '请选择标的物' }]
                })(
                  <Select allowClear={false} style={{ width: 240 }} placeholder="请选择" onChange={(e) => this.query(e)}>
                    {
                      list.length !== 0 && list.map((item, i) => <Option value={item.sysCodeVal} key={i}>{item.sysCodeVal}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="毛利润">
              {
                getFieldDecorator('grossProfitRate', {
                  rules: [{ required: true, message: '请输入毛利润' }]
                })(
                  <InputNumber style={{ width: 240 }} />
                )
              }
              <span style={{ marginLeft: 12 }}>%</span>
            </FormItem>
            <FormItem label="计算公式">
              {
                getFieldDecorator('equationRemark')(
                  <Input allowClear={false} style={{ width: 480 }} placeholder="计算公式（选填）" />
                )
              }
            </FormItem>
          </Form>
        </div>

        <Row type="flex" justify="end" align="middle" className={styles.footer}>
          <Col>
            <Button onClick={() => router.goBack()} style={{ marginRight: 24 }}>取消</Button>
            <Button onClick={this.handleSave.bind(this)} type='primary'>提交</Button>
          </Col>
        </Row>
      </div>
    )
  }
}
