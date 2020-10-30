// import React, { useEffect } from "react";
// import { reqVerifyCode } from "@api/common";
// import { Button } from "antd-mobile";
// const verifyBtnProps = {
//   id: "TencentCaptcha",
//   // 该appId为自己腾讯云账号的验证码appId
//   "data-appid": "2014566629",
//   "data-cbfn": "verifyCallback",
// };

//工厂函数创建组件
// export default function VerifyButton({ disabled, callback }) {
//   //相当于componentDidMount
//   useEffect(() => {
//     window.verifyCallback = async (res) => {
//       // console.log(res);
//       //res.ret等于0说明验证成功
//       if (res.ret === 0) {
//         //验证成功 客户端验证成功，还需要进行二次验证，服务器
//         //随机字符串和票据
//         await reqVerifyCode(res.randstr, res.ticket);
//         //服务端验证通过---下一步是验证手机号是否注册
//         //做其它事
//         callback();
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <Button
//         style={{ display: disabled ? "block" : "none" }}
//         className="warning-btn"
//         // onClick={this.next}
//         //按钮类型
//         type="warning"
//         // 禁用
//         disabled
//       >
//         下一步
//       </Button>
//       <Button
//         style={{ display: !disabled ? "block" : "none" }}
//         {...verifyBtnProps}
//         // onClick={this.next}
//         className="warning-btn"
//         //按钮类型
//         type="warning"
//       >
//         下一步
//       </Button>
//     </div>
//   );
// }

// ES6类创建组件
import React, { Component } from "react";
import PropTypes from "prop-types";
import { reqVerifyCode } from "@api/common";
import { Button } from "antd-mobile";
const verifyBtnProps = {
  id: "TencentCaptcha",
  // 该appId为自己腾讯云账号的验证码appId
  "data-appid": "2014566629",
  "data-cbfn": "verifyCallback",
};

export default class index extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    callback: PropTypes.func.isRequired,
    btnText: PropTypes.string.isRequired,
  };
  componentDidMount() {
    const { callback } = this.props;
    window.verifyCallback = async (res) => {
      // console.log(res);
      //res.ret等于0说明验证成功
      if (res.ret === 0) {
          //验证成功 客户端验证成功，还需要进行二次验证，服务器
          //随机字符串和票据
          await reqVerifyCode(res.randstr, res.ticket);
          //服务端验证通过---下一步是验证手机号是否注册
          //做其它事
          callback();
      }
    };
  }
  render() {
    const { disabled, btnText } = this.props;
    return (
      <>
        <Button
          style={{ display: disabled ? "block" : "none" }}
          className="warning-btn"
          // onClick={this.next}
          //按钮类型
          type="warning"
          // 禁用
          disabled
        >
          {btnText}
        </Button>
        <Button
          style={{ display: !disabled ? "block" : "none" }}
          {...verifyBtnProps}
          // onClick={this.next}
          className="warning-btn"
          //按钮类型
          type="warning"
        >
          {btnText}
        </Button>
      </>
    );
  }
}
