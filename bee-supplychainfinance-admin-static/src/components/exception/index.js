import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import router from 'umi/router'

class Exception extends Component {
  backTo = () => {
    router.push('/')
  }
  render() {
    return (
      <div style={{ width: '100%', minHeight: '600px', background: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <div style={{ width: '800px', }}>
          <div style={{ width: '300px', marginRight: '60px', float: 'left' }}>
            <img src={this.props.code === 403 ? require('@/assets/notFound/403.png') : require('@/assets/notFound/404.png')} />
          </div>
          <div style={{ width: '350px', height: '300px', display: 'flex', justifyContent: 'center', paddingLeft: 86, flexDirection: 'column' }}>
            <div style={{ color: '#bbb', fontSize: 111, fontWeight: 700 }}>{this.props.code}</div>
            <div style={{ color: '#bbb', fontSize: 20 }}>抱歉，{this.props.code === 403 ? '您无权访问该页面' : '您访问的页面不存在'}</div>
            <Button onClick={this.backTo} style={{ width: '150px', height: '40px', background: '#ff8200', color: '#f8f8f8', display: 'block', fontSize: '18px', border: '0', borderRadius: '3px', marginTop: '20px' }}>返回首页</Button>
          </div>
        </div>
      </div>
    );
  }
}

Exception.propTypes = {

};
Exception.defaultProps = {
  code: 404
}

export default Exception;