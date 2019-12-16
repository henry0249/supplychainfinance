import React, { Component } from 'react'
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { Button, Row, Checkbox, Form, Input, Radio, Icon, message, Alert } from 'antd';
// import { config } from 'utils';
import router from 'umi/router'
import styles from './index.less';
import { login } from './services/index'
const FormItem = Form.Item;

@connect(({ global, loading }) => ({
  global,
  logining: loading.effects['global/login'],
}))
@Form.create()
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount() {

  }

  handleOk() {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      if (!errors) {
        dispatch({
          type: 'global/login',
          payload: { ...values },
          callback: (status) => {
            if (status) {
              router.push('/')
            }
          }
        })
      }
    })
  }

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" closable showIcon />;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { global, logining } = this.props;
    return (
      <div className={styles.login}>
        <div className={styles.form}>
          <div className={styles.name}>
            <span>领蜂供应链后台管理系统</span>
          </div>
          <div className={styles.version}>
            <span>平台版本ver{'1.00.00'}Beta</span>
          </div>
          {!global.login &&
            !logining &&
            global.message &&
            this.renderMessage(global.message)}

          {/* {(this.props.global.message&&!this.props.logining)&&<Alert style={{ marginBottom: 24 }} message={this.props.global.message} type="error" showIcon />} */}
          <Form>
            <FormItem hasFeedback>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} onPressEnter={this.handleOk.bind(this)} placeholder="手机号/邮箱" />)}
            </FormItem>
            <FormItem hasFeedback style={{ marginBottom: 5 }}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input prefix={<Icon type="unlock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" onPressEnter={this.handleOk.bind(this)} placeholder="登录密码" />)}
            </FormItem>
            {/* <FormItem style={{ marginBottom: 5 }}
          >
            {getFieldDecorator('role', { initialValue: 'user' })(
              <RadioGroup>
                <Radio value="user">用户</Radio>
                <Radio value="admin">管理员</Radio>
              </RadioGroup>
            )}
          </FormItem> */}

            {/* <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住密码</Checkbox>
              )}
              <a className={styles.login_form_forgot} href="">忘了密码?</a>

            </FormItem> */}

            <Row >
              <Button className={styles.button} type="primary" onClick={this.handleOk.bind(this)} loading={this.props.logining}>
                登录
        </Button>
            </Row>

          </Form>
          {/* <Spin spinning={this.props.logining} /> */}
          <div className={styles.footer}>
            <span>copyright 2019 金蜜工业云出品</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Login)
// Login.propTypes = {
//   form: PropTypes.object,
//   dispatch: PropTypes.func,
//   loading: PropTypes.object,
// }

