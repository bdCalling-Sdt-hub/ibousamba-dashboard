import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { Badge, Avatar, Popover } from "antd";
import { useUser } from "../../provider/User";
import { CgMenu } from "react-icons/cg";
import { useLocation } from "react-router-dom";
import NotificationPopover from "../../Pages/Dashboard/Notification/NotificationPopover";
import { imageUrl } from "../../redux/api/baseApi";

const Header = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const src = `${imageUrl}${user?.image}`;

  const location = useLocation();
  const getPageName = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";

    const pageName = path.substring(1).split("/").pop();
    return pageName
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
      .replace(/-/g, " ") // Replace hyphens with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  // Notification Popover Content

  return (
    <div className="bg-sambaS min-h-[80px] flex items-center px-6 transition-all duration-300">
      {/* Sidebar Toggle Button */}
      <CgMenu
        size={40}
        onClick={toggleSidebar}
        className="cursor-pointer text-white"
      />

      <h1 className="text-2xl text-white ml-4">{getPageName()}</h1>

      <div className="flex items-center gap-6 ml-auto">
        {/* Notifications */}
        <Popover
          content={<NotificationPopover />}
          title={null}
          trigger="click"
          arrow={false}
          open={open}
          onOpenChange={setOpen}
          placement="bottom"
          // overlayClassName="bg-gray-800 p-3 rounded-lg"
        >
          <div className="relative border rounded-full p-2 cursor-pointer">
            <FaRegBell size={24} color="white" />
            <Badge
              color="blue"
              count={10}
              overflowCount={5}
              size="small"
              className="absolute top-1 -right-0 "
            />
          </div>
        </Popover>

        {/* User Profile */}
        <Link to="/setting" className="flex items-center gap-2 text-white">
          <div className="border rounded-full">
            <Avatar size={40} src={src} />
          </div>
          <p>{user?.firstName}</p>
        </Link>
      </div>
    </div>
  );
};

export default Header;
