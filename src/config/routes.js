import VerifyPhone from "@pages/regist/VerifyPhone";
import VerifyCode from "@pages/regist/VerifyCode";
import VerifyPassword from "@pages/regist/VerifyPassword";
import CountryPicker from "@comps/CountryPicker";
import PhoneLogin from "@pages/login/PhoneLogin";

// 路由配置文件
const routes = [
  {
    path: "/regist/verifyPhone",
    component: VerifyPhone,
    exact: true,
  },
  {
    path: "/regist/verifycode",
    component: VerifyCode,
    exact: true,
  },
  {
    path: "/regist/verifypassword",
    component: VerifyPassword,
    exact: true,
  },
  {
    path: "/common/countrypicker",
    component: CountryPicker,
    exact: true,
  },
  {
    path: "/login",
    component: PhoneLogin,
    exact: true,
  },
];

export default routes;
