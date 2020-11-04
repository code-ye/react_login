import React, { Component } from "react";
import { NavBar, Icon, InputItem, WingBlank, Modal, Toast } from "antd-mobile";
import { createForm } from "rc-form";
import { reqVerifyPhone } from "@api/regist";
import { reqSendCode } from "@api/login";

import VerifyButton from "@comps/VerifyButton";
import { phoneReg } from "@utils/reg";

import "./index.css";

class VerifyPhone extends Component {
  state = {
    isDisabled: true, // 控制按钮显示哪个
  };

  componentDidMount() {
    Modal.alert(
      "注册协议及隐私政策",
      <span className="policy-text">
        在您注册成为硅谷用户的过程中，您需要完成我们的注册流程并通过点击同意的形式在线签署以下协议，
        <strong className="policy-strong-text">
          请您务必仔细阅读、充分理解协议中的条款内容后再点击同意（尤其是以粗体并下划线标识的条款，因为这些条款可能会明确您应履行的义务或对您的权利有所限制）
        </strong>
        ：<span className="policy-content">《硅谷用户注册协议》</span>
        <span className="policy-content">《硅谷隐私政策》</span>
      </span>,
      [
        {
          text: "不同意",
          onPress: () => this.props.history.goBack(),
        },
        {
          text: "同意",
          style: { backgroundColor: "red", color: "#fff" },
        },
      ]
    );
  }

  // 当用户输入数据时就会触发
  // 表单验证
  validator = (rule, value, callback) => {
    // console.log(rule, value);

    let isDisabled = true;

    if (phoneReg.test(value)) {
      isDisabled = false;
    }

    this.setState({
      isDisabled,
    });

    // callback必须调用，否则检验失败
    // callback(message) 校验失败
    // callback() 校验成功
    callback();
  };

  // 发送验证码
  sendCode = (phone) => {
    Modal.alert("", `我们将发送短信/语音验证码至：${phone}`, [
      {
        text: "取消",
        // onPress: () => console.log("cancel"),
      },
      {
        text: "确定",
        style: { backgroundColor: "red", color: "#fff" },
        onPress: async () => {
          // 发送请求 请求短信验证码
          await reqSendCode(phone);

          this.props.history.push("/regist/verifycode", phone);
        },
      },
    ]);
  };

  // 验证用户手机号是否注册过
  verifyPhone = async () => {
    // 获取单个表单项的值
    const phone = this.props.form.getFieldValue("phone");
    // 获取所有表单项的值
    // const value2 = this.props.form.getFieldsValue();
    await reqVerifyPhone(phone);

    // console.log("success");
    // 请求成功 - 手机号不存在
    // 提示弹框 - 确认请求短信验证码
    this.sendCode(phone);
  };

  goCountryPicker = () => {
    this.props.history.push("/common/countrypicker", "/regist/verifyphone");
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { isDisabled } = this.state;
    // form属性：由createForm高阶组件传递而来
    const { getFieldProps } = this.props.form;

    const number = this.props.location.state || "+86";

    return (
      <div className="verify-phone">
        <NavBar
          mode="light"
          icon={<Icon className="left" type="left" />}
          onLeftClick={this.goBack}
        >
          硅谷注册
        </NavBar>
        <WingBlank>
          <div className="verify-phone-input">
            <InputItem
              {...getFieldProps("phone", {
                // 表单校验规则
                rules: [{ validator: this.validator }],
              })}
              clear
              placeholder="请输入手机号"
            >
              <div
                className="verify-phone-prefix"
                onTouchEnd={this.goCountryPicker}
              >
                <span>{number}</span>
                <Icon type="down" />
              </div>
            </InputItem>
          </div>
          <VerifyButton
            disabled={isDisabled}
            callback={this.verifyPhone}
            btnText="下一步"
          />
        </WingBlank>
      </div>
    );
  }
}

// createForm是高阶组件：给VerifyPhone传递操作表单form对象
export default createForm()(VerifyPhone);
