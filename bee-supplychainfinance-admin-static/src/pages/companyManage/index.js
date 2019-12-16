import React, { Component } from "react";
import styles from "./index.less";
import { Select, Form, Button, Input, Table, message, Icon } from "antd";
import { request } from "../../common";
import moment from "moment";
import router from "umi/router";
import withRouter from "umi/withRouter";
import { getResultType } from '../../services/index'
import apis from './api'

const FormItem = Form.Item;
const { Option } = Select;
const api = apis.getEnterpriseList.api();

@withRouter
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: '',
      levelTitle: "全部",
      levelNow: "0",
      statusTitle: "全部",
      statusNow: "3",
      resulTypeData: {},
    };
  }

  componentDidMount() {
    this.getDefaultData();
  }
  //获取默认数据
  getDefaultData = () => {
    request(api + `?currentPage=1&pageSize=10`, {
      method: "GET",
    }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        });
      } else if (res) {
        message.error(res.msg);
      } else {
        message.error("获取列表失败，请刷新重试");
      }
    });
    getResultType().then(res => {
      if (res && res.code === 0) {
        this.setState({
          resulTypeData: res.data,
        });
      } else if (res) {
        message.error(res.msg);
      } else {
        message.error(res.msg);
      }
    });
  };
  onChange = current => {
    const { pageSize, params } = this.state;
    request(api + `?currentPage=${current}&pageSize=${pageSize}` + params, {
      method: "GET",
    }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        });
      } else if (res) {
        message.error(res.msg);
      } else {
        message.error("获取列表失败，请刷新重试");
      }
    });
  };

  handleSearch = () => {
    const { validateFields } = this.props.form;
    const { pageSize } = this.state;
    validateFields((err, values) => {
      if (!err) {
        let params = '';
        if (values.name) {
          params = params + `&name=${values.name}`;
        }
        if (values.typeId >= 0) {
          params = params + `&typeId=${values.typeId}`;
        }
        request(api + `?currentPage=1&pageSize=${pageSize}` + params, {
          method: "GET",
        }).then(res => {
          if (res && res.code === 0) {
            this.setState({
              data: res.data,
              params: params,
              ...res.page
            });
          } else if (res) {
            message.error(res.msg);
          } else {
            message.error("获取列表失败，请刷新重试");
          }
        });
      }
    });
  };
  handleJump = (id) => {
    router.push(
      `/companyManage/detail?id=${id}`
    );
  };
  //切换优先级
  clickLevel = (key, title) => {
    let newData = [];
    if (title === "全部") {
      this.getDefaultData();
    } else {
      newData = data.filter(item => {
        return (item.title = title);
      });
    }
    this.setState({
      levelNow: key,
      levelTitle: title
    });
  };
  //切换状态
  clickStatus = (key, title) => {
    const { data } = this.state;
    if (title === "全部") {
      this.getDefaultData();
    } else {
      newData = data.filter(item => {
        return (item.title = title);
      });
    }
    this.setState({
      statusNow: key,
      statusTitle: title
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      data,
      currentPage,
      pageSize,
      totalPage,
      totalRecords,
      resulTypeData
    } = this.state;
    const columns = [
      {
        title: "公司名称",
        dataIndex: "enterpriseName",
        key: "id"
      },
      // {
      //   title: "公司地址",
      //   dataIndex: "address",
      //   render: (text, row, record) => (
      //     <div
      //       style={{ width: "250px" }}
      //     >
      //       {row.address}
      //     </div>
      //   )
      // },
      // {
      //   title: "企业管理员",
      //   dataIndex: "admin",
      // },
      {
        title: `提交时间`,
        dataIndex: "createTime",
        key:'createTime'
        // sorter: (a, b) => moment(a.createAt) - moment(b.createAt)
      },
      // {
      //   title: `是否通过审核`,
      //   dataIndex: "auditName",
      //   render: (text, row, record) => (
      //     <span
      //       onClick={this.handleJump.bind(this, row.type, row.orderBusinessId)}
      //       style={row.type === 1 || row.type === 4 ? { color: "#4CD398" } : row.type === 5 || row.type === 2 ? { color: "rgb(72, 117, 236)" } : { color: "#F45844" }}
      //     >
      //       {row.typeName}
      //     </span>
      //   )
      // },
      {
        title: "操作",
        render: (text, row, record) => (
          <span
            onClick={this.handleJump.bind(this, row.platformEnterpriseId)}
            style={{ color: "#4875EC", cursor: "pointer" }}
          >
            查看详情
          </span>
        )
      }
    ];

    return (
      <div className={styles.container}>
        <h3>企业管理</h3>
        <div className={styles.body}>
          <Form className={styles.top + ' ' + 'topForm'} layout="inline">
            <FormItem style={{ float: "left" }} label="审核结果:">
              {getFieldDecorator("typeId")(
                <Select style={{ width: "250px", float: "left" }}>
                  {resulTypeData.list &&
                    resulTypeData.list.length > 0 && resulTypeData.list.map(item => {
                      return <Option key={item.typeId} value={item.typeId}>{item.typeName}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
            <span style={{ float: "left", marginLeft: "10px", display: 'inline-block', height: '32px', lineHeight: "32px", color: 'rgba(0, 0, 0, 0.85)' }}>(共{resulTypeData.totalCount}家)</span>
            <Button type="primary" onClick={this.handleSearch.bind(this)}>
              <Icon type="search" style={{ color: "#fff" }} />查 询
            </Button>
            <FormItem className={styles.rightInput}>
              {getFieldDecorator("name")(
                <Input style={{ width: "250px" }} placeholder="输入企业名称" />
              )}
            </FormItem>
          </Form>
          <Table
            className="workTable"
            style={{ marginTop: "20px" }}
            columns={columns}
            dataSource={data}
            rowKey={(i, index) => index}
            pagination={{
              showQuickJumper: true,
              defaultCurrent: 1,
              defaultPageSize: 10,
              current: currentPage,
              pageSize: pageSize,
              total: totalRecords,
              onChange: this.onChange.bind(this),
              pageSizeOptions: ["10", "20", "30"],
              showTotal: (total, range) =>
                `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
            }}
          />
        </div>
      </div>
    );
  }
}