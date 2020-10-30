import React, { Component } from "react";
import { NavBar, Icon, InputItem, WingBlank, Modal, Toast } from "antd-mobile";
import { createForm } from "rc-form";
import { reqVerifyPhone } from "@api/regist";
import { reqSendCode } from "@api/login";
import VerifyButton from "@comps/VerifyButton";

import "./index.css";

class VerifyPhone extends Component {
  state = {
    isDisabled: true,
  };

  componentDidMount() {
    Modal.alert(
      //弹框的标题
      "注册协议及隐私政策",
      //弹框的内容
      <span className="policy-text">
        在您注册成为硅谷用户的过程中，您需要完成我们的注册流程并通过点击同意的形式在线签署以下协议，
        <strong className="policy-strong-text">
          请您务必仔细阅读、充分理解协议中的条款内容后再点击同意（尤其是以粗体并下划线标识的条款，因为这些条款可能会明确您应履行的义务或对您的权利有所限制）
        </strong>
        ：<span className="policy-content">《硅谷用户注册协议》</span>
        <span className="policy-content">《硅谷隐私政策》</span>
      </span>,
      //弹框的按钮
      [
        {
          text: "不同意",
          //点击不同意时触发的回调
          onPress: () => console.log("cancel"),
        },
        {
          text: "同意",
          //可以在对象中写style
          style: { backgroundColor: "red", color: "#fff" },
        },
      ]
    );
  }

  // 当用户输入数据时就会触发
  validator = (rule, value, callback) => {
    // rule：即传入的字段，为phone，  value：为表单的value
    //每当表单改变时都会触发这个方法
    // console.log(rule, value);
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|199)[0-9]{8}$/;
    //下一步按钮默认为不可点击
    let isDisabled = true;

    if (reg.test(value)) {
      //校验成功后，下一步设置为可点击
      isDisabled = false;
    }
    //更新state
    this.setState({
      isDisabled,
    });
    // callback必须调用，否则检验失败
    // callback(message) 校验失败
    // callback() 校验成功
    callback();
  };

  //发送验证码
  sendCode = (phone) => {
    Modal.alert(
      "",
      `我们将发送短信/语音验证码至：${phone}`, //弹框的按钮
      [
        {
          text: "取消",
          //点击不同意时触发的回调
          onPress: () => console.log("cancel"),
        },
        {
          text: "确定",
          //可以在对象中写style
          style: { backgroundColor: "red", color: "#fff" },
          onPress: async () => {
            // 发送请求 请求短信验证码
            await reqSendCode(phone);
            //路由跳转
            this.props.history.push("/regist/verifycode");
          },
        },
      ]
    );
  };

  verifyPhone = async () => {
    try {
      // 获取单个表单项的值
      const phone = this.props.form.getFieldValue("phone");
      // 获取所有表单项的值
      // const value2 = this.props.form.getFieldsValue();
      await reqVerifyPhone(phone);

      // 请求成功--手机号不存在
      // 提示弹框--确认请求短信验证码
      console.log("success");
      this.sendCode(phone);
    } catch (e) {
      if (e === "fail") return;
      // 请求失败 - 手机号存在
      Toast.fail(e, 3);
      // console.log("err", e);
    }
  };

  render() {
    const { isDisabled } = this.state;
    const { getFieldProps } = this.props.form;

    return (
      <div>
        <NavBar
          // 颜色为light
          mode="light"
          // 左侧导航
          icon={<Icon className="left" type="left" />}
          // 点击左侧导航的回调
          onLeftClick={() => console.log("onLeftClick")}
        >
          硅谷注册
        </NavBar>
        {/* 两翼留白效果 */}
        <WingBlank>
          <div className="verify-phone-input">
            <InputItem
              {...getFieldProps("phone", {
                // 表单校验规则：自定义校验规则
                rules: [{ validator: this.validator }],
              })}
              // 表单右侧的x号
              clear
              // 表单提示
              placeholder="请输入手机号"
            >
              <div className="verify-phone-prefix">
                <span>+86</span>
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
