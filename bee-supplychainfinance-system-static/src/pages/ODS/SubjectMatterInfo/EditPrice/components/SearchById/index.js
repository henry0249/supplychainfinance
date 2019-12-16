import { Component } from 'react';
import { Form, Button, Table, Row, Col, Input, InputNumber, Select, message, Modal } from 'antd';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getPriceDatas,
  savePriceInfo
} from '../../../service';

const FormItem = Form.Item;
const { Option } = Select;

@withRouter
@Form.create()
export default class Index extends Component {
  state = {
    current: 1,
    editId: null,
    data: [],
    tast: '',
    tastInfo: '',
    priceUnit: '',
    page: {
      totalPage: 0,
      totalRecords: 0,
    }
  }

  componentDidMount() {
    const { key } = this.props.location.query;

  }

  currentChange = (current) => {
    this.setState({
      current
    })
  }

  handleSearch = () => {
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        if (!values.id) {
          return message.warning("请先输入标的物编号再筛选")
        }
        getPriceDatas(values.id).then(res => {
          if (res.code === 0) {
            if (res.data.priceDTOList.length === 0) {
              Modal.error({
                title: '未找到对应编号标的物',
                content: '请确认标的物编号后再进行查找',
              });
            }
            this.setState({
              data: res.data.priceDTOList || [],
              tast: res.data.tast || '',
              tastInfo: res.data.tastInfo || '',
              priceUnit: res.data.priceUnit || '',
              page: {
                totalPage: Math.ceil(res.data.priceDTOList.length / 10),
                totalRecords: res.data.priceDTOList.length
              }
            })
          } else {
            message.error('获取标的物价格列表失败：' + res.msg);
          }
        })
      }
    })
  }

  handleSave = () => {
    const { validateFields } = this.props.form;
    const { editId } = this.state;
    validateFields((err, values) => {
      if (!err) {
        let params = {
          id: editId,
          priceManualInput: values.priceManualInput,
          price: values.price
        }
        savePriceInfo(params).then(res => {
          if (res.code === 0) {
            message.success('保存标的物价格成功');
            getPriceDatas(values.id).then(res => {
              if (res.code === 0) {
                this.setState({
                  editId: null,
                  data: res.data.priceDTOList,
                  priceUnit: res.data.priceUnit,
                  page: {
                    totalPage: Math.ceil(res.data.priceDTOList.length / 10),
                    totalRecords: res.data.priceDTOList.length
                  }
                })
              } else {
                message.error('获取标的物价格列表失败：' + res.msg);
              }
            })
          } else {
            message.error('保存标的物价格失败：' + res.msg);
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { current, editId, data, tast, tastInfo, priceUnit, page } = this.state;
    const columns = [
      {
        title: '时间',
        dataIndex: 'priceDate',
        key: 'priceDate',
        width: '20%'
      }, {
        title: '咨询价格',
        dataIndex: 'priceManualInput',
        key: 'priceManualInput',
        render: (text, row) => editId !== null && editId === row.id ? <FormItem>
          {
            getFieldDecorator('priceManualInput', {
              initialValue: text
            })(
              <InputNumber style={{ width: 80 }} placeholder="规格名称" />
            )
          }
          <span>{` ${priceUnit}`}</span>
        </FormItem> : text + ` ${priceUnit}`,
        width: '20%'
      }, {
        title: '三方价格',
        dataIndex: 'price',
        key: 'price',
        render: (text, row) => editId !== null && editId === row.id ? <FormItem>
          {
            getFieldDecorator('price', {
              initialValue: text
            })(
              <InputNumber style={{ width: 80 }} placeholder="规格名称" />
            )
          }
          <span> 元/吨</span>
        </FormItem> : text + ` ${priceUnit}`,
        width: '20%'
      }, {
        title: '操作',
        key: 'action',
        render: (text, row, record) => editId !== null && editId === row.id ?
          <div>
            <span onClick={this.handleSave.bind(this)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>保存</span>
            <span onClick={() => this.setState({ editId: null })} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer' }}>取消</span>
          </div> :
          <div>
            <span onClick={() => this.setState({ editId: row.id })} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer' }}>编辑价格</span>
          </div>,
        width: '40%'
      }
    ];

    return (
      <div className={styles.container}>
        <Form style={{ marginBottom: 24 }}>
          <Row>
            <Col span={6}>
              <FormItem label="标的物编号">
                {
                  getFieldDecorator('id')(
                    <Input style={{ width: 240 }} placeholder="请输入" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={10} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 40 }}>
              {
                tast && <FormItem label="标的物名称">
                  {tast}
                </FormItem>
              }
              {
                tastInfo && <FormItem label="标的物特性" style={{ marginLeft: 48 }}>
                  {tastInfo}
                </FormItem>
              }
            </Col>
            <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: 40 }}>
              <Button onClick={this.handleSearch.bind(this)} type='primary'>查找</Button>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{
            showQuickJumper: true,
            current: current,
            pageSize: 10,
            total: page.totalRecords,
            onChange: this.currentChange,
            showTotal: (total, range) => `共 ${page.totalRecords} 条记录 第 ${current} / ${page.totalPage} 页`,
          }}
        />
      </div>
    )
  }
}
