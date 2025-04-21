import React from "react";
import { Tabs, ConfigProvider } from "antd";
import AdminPassword from "./AdminPassword";
import Profile from "./Profile";

const items = [
  {
    key: "password",
    label: "Password",
    children: <AdminPassword />,
  },
  {
    key: "profile",
    label: "Profile",
    children: <Profile />,
  },
];
function Setting() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemColor: "white",

            inkBarColor: "#d99e1e",
            itemHoverColor: "white",
            itemSelectedColor: "#d99e1e",
            titleFontSize: "20px",
            horizontalMargin: "0 0 30px 0",
            itemActiveColor: "#d99e1e",
          },
        },
      }}
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="px-4 py-5 font-medium "
      />
    </ConfigProvider>
  );
}

export default Setting;
