import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Menu,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table,
  Popconfirm
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import propTypes from "prop-types"
import request from "@/utils/request"
import withRouter from "umi/withRouter"
import styles from './index.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
let statusMap, status = []
const reCheck = function () {
  if (location.pathname.indexOf("/incoming") !== -1) {
    statusMap = ["default", "warning", 'success'];
    status = ["新增", "退回", '通过'];
  } else if (location.pathname.indexOf("/approval") !== -1) {
    statusMap = ['processing', 'processing', 'processing', 'processing', 'success'];
    status = ['初审中', '风控审核中', '终审中', '决策复核中', '通过'];
  }
}

// statusMap = ['processing', 'processing', 'processing', 'processing', 'success'];
// status = ['初审中', '风控审核中', '终审中', '决策复核中', '通过'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()

class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => { },
    handleUpdateModalVisible: () => { },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }
  componentWillMount() {
    reCheck()
  }
  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="监控对象">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="规则模板">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">规则模板一</Option>
              <Option value="1">规则模板二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="规则类型">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">强</Radio>
              <Radio value="1">弱</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            rules: [{ required: true, message: '请选择开始时间！' }],
          })(
            <DatePicker
              allowClear={false}
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="调度周期">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="month">月</Option>
              <Option value="week">周</Option>
            </Select>
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入规则名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="配置规则属性" />
          <Step title="设定调度周期" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@withRouter
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()

class TableList extends PureComponent {
  constructor() {
    super()
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {},
      stepFormValues: {},
    };
    reCheck()
    this.columns = this.renderCol()
  }

  componentWillMount() {

  }
  comfirm() {
  }
  renderCol() {
    return [
      {
        title: 'ID',
        dataIndex: 'name',
        filterMultiple: false
      },
      {
        title: '委托企业',
        dataIndex: 'desc',
        filterMultiple: false
      },
      {
        title: '申请类型',
        dataIndex: 'callNo',
        sorter: true,
        align: 'center',
        // render: val => "申请类型",
        needTotal: true,
        filterMultiple: false
        // dataIndex: 'desc'
      },
      {
        title: '状态',
        dataIndex: 'status',
        // filters: [
        //   {
        //     text: status[0],
        //     value: 0,
        //   },
        //   {
        //     text: status[1],
        //     value: 1,
        //   },
        //   {
        //     text: status[2],
        //     value: 2,
        //   },
        //   {
        //     text: status[3],
        //     value: 3,
        //   },
        //   {
        //     text: status[4],
        //     value: 4,
        //   }
        // ],
        filters: status.reduce((result, curr, index) => {
          result.push({
            text: status[index],
            value: index
          })
          return result

        }, []),
        render(val, record, index) {
          return <Badge status={statusMap[val] === undefined ? "default" : statusMap[val]} text={status[val] === undefined ? "暂无" : status[val]} />;
        },
      },
      {
        title: '申请日期',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => { this.props.data.clickInto(text) }}>进入</a>

            {location.pathname.indexOf("/incoming") !== -1
              ?
              <Popconfirm placement="left" title="删除后该申请内容将无法恢复！" onConfirm={this.comfirm.bind(this)} okText="继续" cancelText="取消">
                <Divider type="vertical" />
                <a onClick={() => { this.props.data.clickDelete(text) }}>删除</a>
              </Popconfirm>
              : ""}
            {/* <Divider type="vertical" /> */}
            {/* <a onClick={() => this.handleUpdateModalVisible(true, record)}>删除</a> */}
          </Fragment>
        ),
      },
    ];
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }
  go = () => {
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <h2 style={{ marginBottom: 30 }}>订单列表</h2>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="委托企业">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {/* <Option value="0">新增/退回</Option> */}
                  {
                    status.map((item, index) => {
                      return (
                        <Option value={index} key={index}>{item}</Option>
                      )
                    })
                  }
                  {/*                   
                  <Option value="1">风控审核中</Option>
                  <Option value="2">终审中</Option>
                  <Option value="3">决策复核中</Option>
                  <Option value="4">通过</Option> */}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="选择日期">
              {getFieldDecorator('date')(<RangePicker style={{ width: '100%' }} allowClear={false} />)}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }



  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const list = this.props.data.list.reduce((result, curr) => {
      result.push({
        name: curr.id,
        desc: curr.enterprise,
        callNo: curr.type === "P" ? "委托采购" : curr.type === "S" ? "委托销售" : "金融仓储",
        status: curr.status,
        updatedAt: curr.create,
        key: curr.id
      });
      return result;
    }, [])
    const data = {
      list,
      pagination: {
        total: this.props.data.totalCount
      }
    }
    const loading = false
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const { additional, auditing, auditCount } = this.props.data
    const incoming = location.pathname.indexOf("/incoming") !== -1;
    return (
      <PageHeaderWrapper title="审批管理">
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title={incoming ? "新增的申请" : "待补充订单"} value={additional} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title={incoming ? "退回的项目" : "审核中订单"} value={auditing} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title={incoming ? "本周完成" : "本周完成审批数"} value={auditCount} />
              </Col>
            </Row>
          </Card>
        </div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button> */}
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )} */}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              isSelectShow={false}
              loading={loading}
              data={data}
              columns={this.columns}
              bordered
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              hasRowSelection={false}
            />
            {/* <Table columns={this.columns} dataSource={data} pagination={{ pageSize:5}}/> */}
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

//data 组件接受参数
//list 表格数据 
//id：订单id
//type：申请类型 "S,P,M" 分别为"委托销售，委托采购，金融仓储"
//enterprise: 企业名称
//status：审核状态 0,1,2,3,4 对应 ['初审中', '风控审核中', '终审中', '决策复核中', '通过'];
//create: 创建时间 
//totalCount: 总数据条数
//首页卡片数据
//additional: 待补充订单 第一个卡片
//auditing: 审核中 第二个卡片
//auditCount: 本周完成审批数
//admin: 用户权限
//clickInto: 进入按钮回调
//clickDelete: 删除按钮回调
TableList.defaultProps = {
  data: {
    list: [
      {
        id: 45452,
        type: "S",
        enterprise: "34",
        status: 4,
        create: new Date(),
      },
      {
        id: 45452,
        type: "P",
        enterprise: "334",
        status: 2,
        create: new Date(),
      },
      {
        id: 45452,
        type: "M",
        enterprise: "334",
        status: 0,
        create: new Date(),
      },
      {
        id: 45452,
        type: "M",
        enterprise: "334",
        status: 0,
        create: new Date(),
      },
      {
        id: 45452,
        type: "M",
        enterprise: "334",
        status: 0,
        create: new Date(),
      },
      {
        id: 45452,
        type: "M",
        enterprise: "334",
        status: 0,
        create: new Date(),
      },
      {
        id: 45452,
        type: "M",
        enterprise: "334",
        status: 0,
        create: new Date(),
      },
      {
        id: 45452,
        type: "M",
        enterprise: "334",
        status: 0,
        create: new Date(),
      },
    ],
    totalCount: 34,
    additional: 45,
    auditing: 56,
    auditCount: 56,
    admin: "super",
    clickInto(value) {
    },
    clickDelete(value) {
      return
    }
  }
}

TableList.propTypes = {
  data: propTypes.object,

}

export default TableList;
