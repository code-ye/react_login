import React, { useState } from "react";
import { NavBar, Icon, WingBlank, InputItem, Button, Modal } from "antd-mobile";
import { createForm } from "rc-form";
import { reqRegistUser } from "@api/regist";
import { passwordReg } from "@utils/reg";

import msg from "@assets/imgs/msg.png";
import "./index.css";

function VerifyPassword({ form, location, history }) {
  const [isSecret, setIsSecret] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  const { getFieldProps, getFieldValue } = form;

  const iconClassName =
    "iconfont verify-password-icon " + (isSecret ? "icon-eye1" : "icon-eye");

  const setSecret = () => {
    setIsSecret(!isSecret);
  };

  const validator = (rule, value, callback) => {
    let isDisabled = true;
    if (passwordReg.test(value)) {
      isDisabled = false;
    }
    setIsDisabled(isDisabled);

    callback();
  };

  const next = async () => {
    const phone = location.state;
    const password = getFieldValue("password");
    await reqRegistUser(phone, password);
    history.push("/login");
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="verify-password">
      <NavBar
        mode="light"
        icon={<Icon className="left" type="left" />}
        onLeftClick={goBack}
      >
        硅谷注册
      </NavBar>
      <WingBlank>
        <img className="verify-code-msg" src={msg} alt="msg" />
        <p className="verify-code-tip">请设置登录密码</p>
        <InputItem
          {...getFieldProps("password", {
            rules: [{ validator }],
          })}
          type={isSecret ? "password" : "text"}
          className="verify-password-btn"
          placeholder="请设置8-20位登录密码"
          extra={<span onTouchEnd={setSecret} className={iconClassName}></span>}
        />
        <p className="verify-password-text">
          密码由8-20位字母、数字或半角符号组成，不能是10位以下纯数字/字母/半角符号，字母需区分大小写
        </p>
        <Button
          onClick={next}
          type="warning"
          disabled={isDisabled}
          className="warning-btn"
        >
          下一步
        </Button>
        <span className="verify-code-question">
          遇到问题?请<a>联系客服</a>
        </span>
      </WingBlank>
    </div>
  );
}

export default createForm()(VerifyPassword);
