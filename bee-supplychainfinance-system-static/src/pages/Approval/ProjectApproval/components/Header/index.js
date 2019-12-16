import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Content from './Content';
import ExtraContent from './ExtraContent';
import { Card } from 'antd';

/**
 * 审批的头部
 * hehao
 * 2018-12-26
 */
export default class App extends Component {

    render() {
        const { tabList, tabKey, onTabChange, children, onSubmit } = this.props;

        return (
            <Card
                title={<Fragment >
                    <Content />
                    <ExtraContent submit={onSubmit}/>
                </Fragment>}
                style={{ background: 'rgb(240,242,245)' }}
                headStyle={{ width: '100%', background: '#fff' }}
                bodyStyle={{ padding: 0, margin: '25px 30px 30px 30px', }}
                bordered={false}
                tabList={tabList}
                activeTabKey={tabKey}
                onTabChange={key => onTabChange(key)}
            >
                {children}
            </Card>
        )
    }
}


App.defaultProps = {
    tabList: [{ name: '', key: '' }],//选项卡
    children: <Fragment />,//内容组件
    tabKey: '',//当前选中项  
    onTabChange: () => false,//选项卡更改时回调
    orderInfo: {},//顶部审批单信息
    roleId: '0',//用户角色

}


