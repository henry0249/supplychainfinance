import { Component } from 'react';
import { Form, Breadcrumb, Button, Divider, Row, Col, Input, Select, message } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getAllTypes,
  getUnit,
  getIndex,
  getInfoByTast,
  saveAttributes
} from '../../service';

const FormItem = Form.Item;
const { Option } = Select;

@withRouter
@Form.create()
export default class Index extends Component {
  state = {
    types: [],
    units: [],
    indexs: [],
    data: {}
  }

  componentDidMount() {
    const { name } = this.props.location.query;
    const { setFieldsValue } = this.props.form;
    getAllTypes().then(res => {
      if (res.code === 0) {
        this.setState({
          types: res.data
        })
      } else {
        message.error('获取所有标的物大类失败：' + res.msg);
      }
    })
    getUnit().then(res => {
      if (res.code === 0) {
        this.setState({
          units: res.data
        })
      } else {
        message.error('获取所有标的物大类失败：' + res.msg);
      }
    })
    getIndex().then(res => {
      if (res.code === 0) {
        this.setState({
          indexs: res.data
        })
      } else {
        message.error('获取所有标的物大类失败：' + res.msg);
      }
    })
    if (name) {
      getInfoByTast(name).then(res => {
        if (res.code === 0) {
          setFieldsValue({
            tast: res.data.tast,
            bigType: res.data.bigType,
            ifStanard: res.data.ifStanard,
            priceUnit: res.data.priceUnit,
            sourceToMoney: res.data.sourceToMoney,
            sourceConsumable: res.data.sourceConsumable,
            sourceStabilization: res.data.sourceStabilization,
            dataFrom: res.data.dataFrom,
            indexId: res.data.indexId
          })
          this.setState({
            data: res.data
          })
        } else {
          message.error('获取标的物详细信息失败：' + res.msg);
        }
      })
    }
  }

  handleSave = () => {
    const { validateFields } = this.props.form;
    const { data } = this.state;
    validateFields((err, values) => {
      if (!err) {
        let params = {
          ...values
        }
        if (data.id) {
          params['id'] = data.id
        }
        saveAttributes(params).then(res => {
          if (res.code === 0) {
            message.success('保存标的物属性信息成功');
            router.goBack()
          } else {
            message.error('保存标的物属性信息失败：' + res.msg);
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { name } = this.props.location.query;
    const { types, units, indexs, data } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/home">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/macrofinance/MacroIndex">数据仓库</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/subjectMatterInfo">标的物信息</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/subjectMatterInfo/list">标的物列表</Link></Breadcrumb.Item>
            <Breadcrumb.Item> 添加（编辑）标的物</Breadcrumb.Item>
          </Breadcrumb>

          <h2>标的物属性数据</h2>

          <Row type="flex" justify="space-between" align="middle">
            <Col>
              <span>操作：可编辑标的物所有属性数据。</span>
            </Col>
            <Col>
              <Button onClick={() => router.goBack()} icon="rollback" type='primary'>返回</Button>
            </Col>
          </Row>
        </div>

        <div className={styles.body}>
          <Row>
            <Col span={12}>
              <FormItem label="标的物名称">
                {
                  getFieldDecorator('tast', {
                    rules: [
                      { required: true, message: '请输入标的物名称' },
                      { max: 10, message: '标的物名称最多10个汉字' }
                    ]
                  })(
                    <Input style={{ width: 320 }} placeholder="标的物名称（10个字以内）" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="标的物大类">
                {
                  getFieldDecorator('bigType', {
                    rules: [{ required: true, message: '请选择标的物大类' }]
                  })(
                    <Select style={{ width: 320 }} placeholder="请选择">
                      {
                        types.length && types.map((item, i) => <Option value={item} key={i}>{item}</Option>)
                      }
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="是否标准品">
                {
                  getFieldDecorator('ifStanard', {
                    rules: [{ required: true, message: '请选择是否标准品' }]
                  })(
                    <Select style={{ width: 320 }} placeholder="请选择">
                      <Option value="是">是</Option>
                      <Option value="否">否</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="价格单位">
                {
                  getFieldDecorator('priceUnit', {
                    rules: [{ required: true, message: '请选择价格单位' }]
                  })(
                    <Select style={{ width: 320 }} placeholder="请选择">
                      {
                        units.length && units.map(item => <Option value={item.id} key={item.id}>{item.priceUnit}</Option>)
                      }
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="标的物变现能力">
                {
                  getFieldDecorator('sourceToMoney', {
                    rules: [{ required: true, message: '请选择标的物变现能力' }]
                  })(
                    <Select style={{ width: 320 }} placeholder="请选择">
                      <Option value="高">高</Option>
                      <Option value="中">中</Option>
                      <Option value="低">低</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="标的物易损耗性">
                {
                  getFieldDecorator('sourceConsumable', {
                    rules: [{ required: true, message: '请选择标的物易损耗性' }]
                  })(
                    <Select style={{ width: 320 }} placeholder="请选择">
                      <Option value="高">高</Option>
                      <Option value="中">中</Option>
                      <Option value="低">低</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="标的物稳定性">
                {
                  getFieldDecorator('sourceStabilization', {
                    rules: [{ required: true, message: '请选择标的物稳定性' }]
                  })(
                    <Select style={{ width: 320 }} placeholder="请选择">
                      <Option value="高">高</Option>
                      <Option value="中">中</Option>
                      <Option value="低">低</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="数据来源">
                {
                  getFieldDecorator('dataFrom', {
                    rules: [{ required: true, message: '请选择数据来源' }]
                  })(
                    <Select style={{ width: 320 }} placeholder="请选择">
                      <Option value="万德数据">万德数据</Option>
                      <Option value="铁合金在线">铁合金在线</Option>
                      <Option value="卓创资讯">卓创资讯</Option>
                      <Option value="生意社">生意社</Option>
                      <Option value="其他">其他</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="标的物关联指数">
                {
                  getFieldDecorator('indexId', {
                    rules: [{ required: true, message: '请选择标的物关联指数' }]
                  })(
                    <Select style={{ width: 320 }} placeholder="请选择">
                      {
                        indexs.length && indexs.map(item => <Option value={item.indexId} key={item.indexId}>{item.indexName}</Option>)
                      }
                    </Select>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Divider dashed />
          {
            name ?
              <Row>
                <Col>
                  <p className={styles.p}>
                    <span className={styles.label}>标的物规格：</span>
                    <span className={styles.value}>{data.specification || '无'}</span>
                  </p>
                </Col>
                <Col>
                  <p className={styles.p}>
                    <span className={styles.label}>标的物来源：</span>
                    <span className={styles.value}>{data.sourceAddress || '无'}</span>
                  </p>
                </Col>
              </Row> :
              <Row>
                <Col>
                  <FormItem label="标的物规格">
                    {
                      getFieldDecorator('specification', {
                        rules: [{ required: true, message: '请输入标的物规格' }]
                      })(
                        <Input style={{ width: 320, }} placeholder="请输入标的物规格" />
                      )
                    }
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="标的物来源">
                    {
                      getFieldDecorator('sourceAddress', {
                        rules: [{ required: true, message: '请输入标的物来源' }]
                      })(
                        <Input style={{ width: 320, }} placeholder="请输入标的物来源" />
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
          }
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
