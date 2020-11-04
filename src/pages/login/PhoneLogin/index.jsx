import React, { Component } from "react";
import {
  NavBar,
  Icon,
  InputItem,
  WingBlank,
  WhiteSpace,
  Button,
  Toast,
} from "antd-mobile";
import { Link } from "react-router-dom";
import { createForm } from "rc-form";
import { phoneReg, codeReg } from "@utils/reg";
import { reqSendCode, reqLogin } from "@api/login";
import { reqVerifyPhone, reqVerifyCode } from "@api/regist";

import "./index.css";

const TOTAL_TIME = 60;

class Login extends Component {
  state = {
    isDisabledLoginBtn: true,
    isDisabledGetCode: true,
    // 决定是否显示获取验证码
    isShowSendCode: false,
    time: TOTAL_TIME,
    // 是否发送过验证码
    hasSendCode: false,
  };

  validator = (rule, value, callback) => {
    // console.log(rule);

    if (rule.field === "phone") {
      // 手机号
      let isDisabledGetCode = true;

      if (phoneReg.test(value)) {
        isDisabledGetCode = false;
      }

      this.setState({
        isDisabledGetCode,
      });
    } else {
      // 验证码
      let isDisabledLoginBtn = true;

      if (codeReg.test(value)) {
        isDisabledLoginBtn = false;
      }

      this.setState({
        isDisabledLoginBtn,
      });
    }

    callback();
  };

  // 跳转到城市选择器
  goCountry = () => {
    this.props.history.push("/common/countrypicker", "/login");
  };

  // 发送验证码
  sendCode = async () => {
    // isDisabledGetCode不可以点是true
    if (this.state.isDisabledGetCode) return;

    const phone = this.props.form.getFieldValue("phone");
    await reqSendCode(phone);

    this.setState({
      isShowSendCode: true,
      isDisabledGetCode: true,
      hasSendCode: true,
    });

    this.timer = setInterval(() => {
      const time = this.state.time - 1;

      if (time <= 0) {
        clearInterval(this.timer);

        this.setState({
          time: TOTAL_TIME,
          isShowSendCode: false,
          isDisabledGetCode: false,
        });
        return;
      }

      this.setState({
        time,
      });
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  loginOrRegist = () => {
    const { phone, code } = this.props.form.getFieldsValue();

    // 验证手机号是否注册
    reqVerifyPhone(phone)
      .then(async () => {
        // 没有注册过
        // 验证验证码是否正确
        await reqVerifyCode(phone, code);
        // 跳转设置密码页面完成注册 -- 自动登录(跳转首页)
        this.props.history.push("/regist/verifyPassword", phone);
      })
      .catch(async () => {
        // 注册过
        await reqLogin(phone, code);
        // 登录
        this.props.history.push("/");
      });
  };

  oauthGithub = () => {
    window.location.href =
      "https://github.com/login/oauth/authorize?client_id=822d44ded3a1d07300f6";
  };

  render() {
    const {
      form: { getFieldProps },
      location: { state },
    } = this.props;

    const {
      isDisabledGetCode,
      isShowSendCode,
      time,
      isDisabledLoginBtn,
      hasSendCode,
    } = this.state;

    const number = state || "+86";

    return (
      <div className="login">
        <NavBar
          mode="light"
          icon={<Icon className="left" type="left" />}
          // onLeftClick={() => console.log("onLeftClick")}
        >
          硅谷注册登录
        </NavBar>
        <WhiteSpace size="xl" />
        <WingBlank size="lg">
          <InputItem
            clear
            placeholder="请输入手机号"
            {...getFieldProps("phone", {
              rules: [
                {
                  validator: this.validator,
                },
              ],
            })}
          >
            <div className="phone-prefix" onTouchEnd={this.goCountry}>
              <span>{number}</span>
              <Icon type="down" />
            </div>
          </InputItem>
          <WhiteSpace size="lg" />
          <div className="login-code">
            <InputItem
              clear
              placeholder="请输入手机验证码"
              {...getFieldProps("code", {
                rules: [
                  {
                    validator: this.validator,
                  },
                ],
              })}
            />
            <button
              onTouchEnd={this.sendCode}
              className="login-btn-text login-btn"
              style={{
                color: isDisabledGetCode ? "#848689" : "red",
              }}
            >
              {isShowSendCode ? `重新获取(${time}s)` : "获取验证码"}
            </button>
          </div>
          <WhiteSpace size="lg" />
          <WingBlank size="lg">
            <Button
              disabled={isDisabledLoginBtn || !hasSendCode}
              type="warning"
              className="warning-btn"
              onClick={this.loginOrRegist}
            >
              登录
            </Button>
          </WingBlank>
          <WhiteSpace size="lg" />
          <div className="login-btn-wrap">
            <Link to="/login/pwd" className="login-btn-text">
              账户密码登录
            </Link>
            <Link to="/regist/verifyphone" className="login-btn-text">
              手机快速注册
            </Link>
          </div>
          <div className="login-other-text">其他登录方式</div>
          <div className="login-icons">
            <span
              onTouchEnd={this.oauthGithub}
              className="iconfont icon-github"
            ></span>
            <span className="iconfont icon-qq"></span>
            <span className="iconfont icon-wechat"></span>
          </div>
          <span className="login-private-policy">
            未注册的手机号验证后将自动创建硅谷账号, 登录即代表您已同意
            <Link to="/login" className="login-private-policy-btn">
              硅谷隐私政策
            </Link>
          </span>
        </WingBlank>
      </div>
    );
  }
}

export default createForm()(Login);
