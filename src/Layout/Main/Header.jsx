// import React, { useState, useEffect, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FaRegBell } from "react-icons/fa6";
// import { Badge, Avatar, Popover } from "antd";
// import { useUser } from "../../provider/User";
// import { CgMenu } from "react-icons/cg";
// import NotificationPopover from "../../Pages/Dashboard/Notification/NotificationPopover";
// import { imageUrl } from "../../redux/api/baseApi";
// import io from "socket.io-client";
// import { useNotificationQuery } from "../../redux/apiSlices/notificationSlice";
// import getPageName from "../../components/common/GetPageName";

// const Header = ({ toggleSidebar }) => {
//   const [open, setOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const socketRef = useRef(null);
//   const { user } = useUser();

//   const src = `${imageUrl}${user?.image || ""}`;

//   const {
//     data: notifications,
//     refetch,
//     isLoading: notificationLoading,
//   } = useNotificationQuery();

//   console.log(notifications);
//   // Initialize unread count from API data
//   useEffect(() => {
//     if (notifications?.data?.result) {
//       const count = notifications.data.result.filter(
//         (notification) => !notification.read
//       ).length;
//       setUnreadCount(count);
//     }
//   }, [notifications]);

//   useEffect(() => {
//     if (!user?._id) return;

//     socketRef.current = io("http://10.0.70.36:6011", {
//       transports: ["websocket", "polling"],
//       reconnection: true,
//     });

//     socketRef.current.on("connect", () => {
//       console.log("Socket connected in header:", socketRef.current.id);
//     });

//     socketRef.current.on("connect_error", (error) => {
//       console.error("Socket connection error in header:", error);
//     });

//     const notificationChannel = `notification::${user._id}`;

//     const handleNewNotification = (notification) => {
//       console.log("New notification received:", notification);
//       setUnreadCount((prev) => prev + 1);
//       refetch();
//     };

//     socketRef.current.on(notificationChannel, handleNewNotification);

//     console.log(`Listening for notifications on: ${notificationChannel}`);

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off(notificationChannel, handleNewNotification);
//         socketRef.current.disconnect();
//       }
//     };
//   }, [user?._id, refetch]);

//   const handleNotificationRead = () => {
//     const updatedCount =
//       notifications?.data?.result?.filter(
//         (notification) => !notification.isRead
//       ).length || 0;
//     setUnreadCount(updatedCount);
//   };

//   return (
//     <div className="bg-sambaS min-h-[80px] flex items-center px-6 transition-all duration-300">
//       {/* Sidebar Toggle Button */}
//       <CgMenu
//         size={40}
//         onClick={toggleSidebar}
//         className="cursor-pointer text-white"
//       />

//       <h1 className="text-2xl text-white ml-4">{getPageName()}</h1>

//       <div className="flex items-center gap-6 ml-auto">
//         {/* Notifications */}
//         <Popover
//           content={
//             <NotificationPopover onNotificationRead={handleNotificationRead} />
//           }
//           title={null}
//           trigger="click"
//           arrow={false}
//           open={open}
//           onOpenChange={setOpen}
//           placement="bottom"
//         >
//           <div className="relative border rounded-full p-2 cursor-pointer">
//             <FaRegBell size={24} color="white" />
//             <Badge
//               count={unreadCount}
//               // count={5}
//               overflowCount={5}
//               size="small"
//               className="absolute top-1 -right-0"
//             />
//           </div>
//         </Popover>

//         {/* User Profile */}
//         <Link to="/setting" className="flex items-center gap-2 text-white">
//           <div className="border rounded-full">
//             <Avatar size={40} src={src} />
//           </div>
//           <p>{user?.firstName}</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Header;

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { Badge, Avatar, Popover } from "antd";
import { useUser } from "../../provider/User";
import { CgMenu } from "react-icons/cg";
import NotificationPopover from "../../Pages/Dashboard/Notification/NotificationPopover";
import { imageUrl } from "../../redux/api/baseApi";
import io from "socket.io-client";
import { useNotificationQuery } from "../../redux/apiSlices/notificationSlice";
import getPageName from "../../components/common/GetPageName";

const Header = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const { user } = useUser();

  const src = `${imageUrl}${user?.image || ""}`;

  const {
    data: notifications,
    refetch,
    isLoading: notificationLoading,
  } = useNotificationQuery({ page: 1, limit: 10 });

  // Initialize unread count from API data
  useEffect(() => {
    if (notifications?.data?.result) {
      const count = notifications.data.result.filter(
        (notification) => !notification.read
      ).length;
      setUnreadCount(count);
    }
  }, [notifications]);

  useEffect(() => {
    if (!user?._id) return;

    socketRef.current = io("http://10.0.70.36:6011", {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected in header:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error in header:", error);
    });

    const notificationChannel = `notification::${user._id}`;

    const handleNewNotification = (notification) => {
      console.log("New notification received:", notification);
      setUnreadCount((prev) => prev + 1);
      refetch();
    };

    socketRef.current.on(notificationChannel, handleNewNotification);

    console.log(`Listening for notifications on: ${notificationChannel}`);

    return () => {
      if (socketRef.current) {
        socketRef.current.off(notificationChannel, handleNewNotification);
        socketRef.current.disconnect();
      }
    };
  }, [user?._id, refetch]);

  const handleNotificationRead = () => {
    const updatedCount =
      notifications?.data?.result?.filter(
        (notification) => !notification.isRead
      ).length || 0;
    setUnreadCount(updatedCount);
  };

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
          content={
            <NotificationPopover onNotificationRead={handleNotificationRead} />
          }
          title={null}
          trigger="click"
          arrow={false}
          open={open}
          onOpenChange={setOpen}
          placement="bottom"
        >
          <div className="relative border rounded-full p-2 cursor-pointer">
            <FaRegBell size={24} color="white" />
            <Badge
              count={unreadCount}
              overflowCount={5}
              size="small"
              className="absolute top-1 -right-0"
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
