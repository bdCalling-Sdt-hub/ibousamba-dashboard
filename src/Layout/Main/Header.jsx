import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
        (notification) => !notification.isRead
      ).length;
      setUnreadCount(count);
    }
  }, [notifications]);

  useEffect(() => {
    if (!user?._id) return;

    socketRef.current = io("http://10.0.60.123:5002", {
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

// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
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
//   const [notifications, setNotifications] = useState([]);
//   const socketRef = useRef(null);
//   const socketInitializedRef = useRef(false);
//   const { user } = useUser();

//   const src = `${imageUrl}${user?.image || ""}`;

//   const {
//     data: notificationsData,
//     refetch,
//     isLoading: notificationLoading,
//   } = useNotificationQuery({ page: 1, limit: 10 });

//   // Initialize notifications and unread count from API data
//   useEffect(() => {
//     if (notificationsData?.data?.result) {
//       setNotifications(notificationsData.data.result);
//       const count =
//         notificationsData.data.meta.unreadCount ||
//         notificationsData.data.result.filter(
//           (notification) => !notification.isRead
//         ).length;
//       setUnreadCount(count);
//     }
//   }, [notificationsData]);

//   // Socket connection management
//   useEffect(() => {
//     if (!user?._id || socketInitializedRef.current) return;

//     const SOCKET_SERVER_URL = "http://10.0.60.36:8011/api/v1";
//     const socketOptions = {
//       transports: ["websocket", "polling"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     };

//     try {
//       socketRef.current = io(SOCKET_SERVER_URL, socketOptions);
//       socketInitializedRef.current = true;

//       socketRef.current.on("connect", () => {
//         console.log("Socket connected successfully:", socketRef.current.id);
//       });

//       socketRef.current.on("connect_error", (error) => {
//         console.error("Socket connection error:", error);
//         // Attempt to reconnect after a delay
//         setTimeout(() => {
//           socketRef.current.connect();
//         }, 3000);
//       });

//       socketRef.current.on("disconnect", (reason) => {
//         console.log("Socket disconnected:", reason);
//         socketInitializedRef.current = false;
//       });

//       const notificationChannel = `notification::${user._id}`;
//       console.log("Subscribing to channel:", notificationChannel);

//       const handleNewNotification = (notification) => {
//         console.log("New notification received:", notification); // Debugging log

//         // Add new notification to the top of the list
//         setNotifications((prevNotifications) => [
//           notification,
//           ...prevNotifications,
//         ]);

//         // Increment unread count
//         setUnreadCount((prev) => prev + 1);

//         // Show notification (could integrate with browser notifications)
//         if (Notification.permission === "granted") {
//           new Notification("New Notification", {
//             body: notification.message,
//             icon: "/favicon.ico",
//           });
//         }

//         // Refresh notification data from API
//         refetch();
//       };

//       socketRef.current.on(notificationChannel, handleNewNotification);
//       console.log(`Listening for notifications on: ${notificationChannel}`);

//       // Request browser notification permission
//       if (
//         Notification.permission !== "granted" &&
//         Notification.permission !== "denied"
//       ) {
//         Notification.requestPermission();
//       }

//       return () => {
//         if (socketRef.current) {
//           socketRef.current.off(notificationChannel, handleNewNotification);
//           socketRef.current.disconnect();
//           socketInitializedRef.current = false;
//         }
//       };
//     } catch (error) {
//       console.error("Error setting up socket connection:", error);
//     }
//   }, [user?._id, refetch]);

//   const handleNotificationRead = (notificationId) => {
//     // Update the notification's read status locally
//     setNotifications((prevNotifications) =>
//       prevNotifications.map((notification) =>
//         notification._id === notificationId
//           ? { ...notification, isRead: true }
//           : notification
//       )
//     );

//     // Recalculate unread count
//     const updatedCount = notifications.filter(
//       (notification) =>
//         notification._id !== notificationId && !notification.isRead
//     ).length;

//     setUnreadCount(updatedCount);
//   };

//   const handleMarkAllAsRead = () => {
//     // Mark all notifications as read locally
//     setNotifications((prevNotifications) =>
//       prevNotifications.map((notification) => ({
//         ...notification,
//         isRead: true,
//       }))
//     );

//     // Reset unread count
//     setUnreadCount(0);

//     // You would also make an API call here to update the read status on the server
//   };

//   const handlePopoverOpen = () => {
//     setOpen(true);
//     // Optionally pre-fetch the latest notifications when popover is opened
//     refetch();
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
//             <NotificationPopover
//               notifications={notifications}
//               onNotificationRead={handleNotificationRead}
//               onMarkAllAsRead={handleMarkAllAsRead}
//               loading={notificationLoading}
//             />
//           }
//           title={
//             <div className="flex justify-between items-center">
//               <span>Notifications</span>
//               {unreadCount > 0 && (
//                 <span
//                   className="text-blue-500 cursor-pointer text-sm"
//                   onClick={handleMarkAllAsRead}
//                 >
//                   Mark all as read
//                 </span>
//               )}
//             </div>
//           }
//           trigger="click"
//           arrow={false}
//           open={open}
//           // onOpenChange={setOpen}
//           placement="rightTop"
//           overlayClassName="notifications-popover"
//           onOpenChange={(visible) => {
//             setOpen(visible);
//             if (visible) handlePopoverOpen();
//           }}
//         >
//           <div className="relative border rounded-full p-2 cursor-pointer hover:bg-sambaS-dark transition-colors">
//             <FaRegBell size={24} color="white" />
//             {unreadCount > 0 && (
//               <Badge
//                 count={unreadCount}
//                 overflowCount={99}
//                 size="small"
//                 className="absolute top-0 -right-1 pulse-animation"
//               />
//             )}
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
