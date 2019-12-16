import React, { Component } from "react";
import { Table, Badge, Divider, Card,message } from "antd";
import style from "../index.less";
import { connect } from "dva";
//'操作日志'组件
// 操作日志由props传入的logData渲染完成，如logData:[
//     {
//         key: '1',
//         name: 'John Brown',
//         type: '订购关系生效',
//         result: '进行中',
//         time:'2017-10-01 12:00',
//         tags: ['nice', 'developer'],
//     }, {
//         key: '2',
//         name: 'John Brown',
//         type: '创建订单',
//         result: '驳回',
//         time:'2017-10-01 12:00',
//         tags: ['nice', 'developer'],
//     }
// ]
// const resultMap = {'创建立项报告':'error','审核通过': 'success','创建立项报告': 'processing',};
const result = ["驳回", "成功", "进行中"];
const columns = [
  {
    title: "操作类型",
    dataIndex: "operateType",
    key: "operateType"
    // render: text => <a href="javascript:;">{text}</a>,
  },
  {
    title: "操作人",
    dataIndex: "operateName",
    key: "operateName"
  },
  {
    title: "执行结果",
    dataIndex: "operateResult",
    key: "operateResult",
    render: (text, record) => {
      return text;
      // <Badge status={resultMap[text]} text={result[text]} />
    }
  },
  {
    title: "操作时间",
    dataIndex: "operateTime",
    key: "operateTime",
    // defaultSortOrder:'descend',
  }
];

@connect(({ contract }) => ({
  contract
}))
export default class OperationLog extends Component {
  constructor() {
    super();
    this.state = {
      oparateData: []
    };
  }

  componentDidMount() {
    const { dispatch, orderId } = this.props;
    //获取日志信息
    dispatch({
      type: "contract/getLogInfo",
      payload: {
        orderId: orderId
      },
      callback: (code, msg, data) => {
        if (code === 0) {
            let arr =[]
            data.map((item,index)=>{
                arr.push({...data[index],rowKey:index})
            })
          this.setState({
              oparateData:arr
          })
        } else {
          message.error(msg);
        }
      }
    });
  }

  render() {
    const { oparateData } = this.state;
    return (
      <div className={style.containerBox}>
        <Card
          title="操作日志"
          headStyle={{ fontWeight: "600", color: "#1890FF" }}
          className={style.containerBox}
        >
          <Table rowKey='rowKey'  columns={columns} dataSource={oparateData} />
        </Card>
      </div>
    );
  }
}
OperationLog.defaultProps = {
  // logData: [
  //     {
  //         key: '1',
  //         name: 'John Brown',
  //         type: '订购关系生效',
  //         result: '进行中',
  //         time: '2017-10-01 12:00',
  //         tags: ['nice', 'developer'],
  //     }, {
  //         key: '2',
  //         name: 'John Brown',
  //         type: '创建订单',
  //         result: '驳回',
  //         time: '2017-10-01 12:00',
  //         tags: ['nice', 'developer'],
  //     }, {
  //         key: '3',
  //         name: 'John Brown',
  //         type: '部门初审',
  //         result: '成功',
  //         time: '2017-10-01 12:00',
  //         tags: ['nice', 'developer'],
  //     }
  // ]
};
