//合并两个reducers函数
import { combineReducers } from "redux";

function xxx(prevState = {}, action) {
  switch (action.type) {
    default:
      return prevState;
  }
}
export default combineReducers({
  xxx,
});
