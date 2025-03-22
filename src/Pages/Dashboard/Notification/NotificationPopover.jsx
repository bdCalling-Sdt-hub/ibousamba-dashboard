import { Button, ConfigProvider } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import EmptyNotification from "../../../assets/samba/EmptyNotification.png";
function NotificationPopover() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: "#d99e1e ",
            defaultColor: "#ffffff ",
            defaultHoverBg: "#d99e1e ",
            defaultHoverColor: "#ffffff ",
            defaultHoverBorderColor: "#d99e1e ",
            defaultActiveBg: "#d99e1e ",
            defaultActiveColor: "#ffffff ",
            defaultActiveBorderColor: "none",
          },
        },
      }}
    >
      <div className="w-52 flex flex-col gap-1 items-center justify-center bg-black py-3">
        <img src={EmptyNotification} width={120} height={150} />
        <p className="font-medium text-base text-center text-white">
          There’s no notifications
        </p>
        <p className="text-wrap text-center text-[12px]">
          Your notifications will be appear on this page.
        </p>
        <Link to="/notification">
          <Button className="w-32 rounded-lg">See details</Button>
        </Link>
      </div>
    </ConfigProvider>
  );
}

export default NotificationPopover;
