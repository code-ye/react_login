import React, { Component } from "react";
import { List, NavBar, Icon } from "antd-mobile";
import { reqCountryData } from "@api/common";

import "./index.css";

const Item = List.Item;

export default class CountryPicker extends Component {
  state = {
    countryData: {},
  };

  async componentDidMount() {
    const countryData = await reqCountryData();
    this.setState({
      countryData,
    });
  }

  goCountry = (e) => {
    const id = e.target.textContent;
    window.scrollTo(0, document.getElementById(id).offsetTop - 45);
  };

  goBack = (value) => {
    return () => {
      this.props.history.push(this.props.location.state, value);
    };
  };

  render() {
    const { countryData } = this.state;

    /*
      {
        *: [{"赤道几内亚": "240"}],
        A: [{"赤道几内亚": "240"}]
      }
    */

    // 提取对象的所有属性名成为一个数组
    // ["*", "A", "B" ...]
    const countryDataKeys = Object.keys(countryData);

    return (
      <div>
        <NavBar
          className="country-picker-nav"
          mode="light"
          icon={<Icon className="left" type="left" />}
          // onLeftClick={this.goBack}
        >
          选择国家或者地区
        </NavBar>
        <ul className="country-picker-sidebar" onTouchEnd={this.goCountry}>
          {countryDataKeys.map((key) => {
            return <li key={key}>{key}</li>;
          })}
        </ul>

        <div className="country-picker-container">
          {countryDataKeys.map((key) => {
            return (
              <List id={key} renderHeader={() => key} key={key}>
                {countryData[key].map((item, index) => {
                  // item {"赤道几内亚": "240"}
                  const key = Object.keys(item)[0];
                  const value = "+" + item[key];
                  
                  return (
                    <Item
                      onClick={this.goBack(value)}
                      key={index}
                      extra={<span style={{ paddingRight: 17 }}>{value}</span>}
                    >
                      {key}
                    </Item>
                  );
                })}
              </List>
            );
          })}
        </div>
      </div>
    );
  }
}
