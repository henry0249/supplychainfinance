import React, { Component } from 'react'
import { Table, Badge } from 'antd'
import styles from './index.less'
import { connect } from 'dva';
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
const result = ['驳回', '成功', '进行中',];
const columns = [{
    title: '操作类型',
    dataIndex: 'operateType',
    key: 'operateType',
    // render: text => <a href="javascript:;">{text}</a>,
}, {
    title: '操作人',
    dataIndex: 'userName',
    key: 'userName',
}, {
    title: '执行结果',
    dataIndex: 'operateResult',
    key: 'operateResult',
    render: (text, record) => {
        return text
        // <Badge status={resultMap[text]} text={result[text]} />
    }

}, {
    title: '操作时间',
    dataIndex: 'operateTime',
    key: 'operateTime',
}];

@connect(({ projectApproval }) => ({
    projectApproval,
}))
export default class OperationLog extends Component {
    constructor() {
        super()
        this.state = {
            oparateData: []
        }
    }

    componentDidMount() {

    }

    render() {
        const { projectApproval: { logs } } = this.props;
        return (
            <Table pagination={false} columns={columns} dataSource={logs} />
        )
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
}
