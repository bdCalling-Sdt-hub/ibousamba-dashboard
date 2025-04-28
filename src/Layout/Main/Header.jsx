import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { Badge, Avatar, Popover, message } from "antd";
import { CgMenu } from "react-icons/cg";
import NotificationPopover from "../../Pages/Dashboard/Notification/NotificationPopover";
import { imageUrl } from "../../redux/api/baseApi";
import { io } from "socket.io-client";
import getPageName from "../../components/common/GetPageName";
import { useProfileQuery } from "../../redux/apiSlices/profileSlice";

const Header = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const { data: user } = useProfileQuery();

  const src = `${imageUrl}${user?.data?.image || ""}`;

  useEffect(() => {
    if (!user?.data?.email) return;

    const connectSocket = async () => {
      try {
        const token = localStorage.getItem("token")
          ? JSON.parse(localStorage.getItem("token"))
          : null;

        if (!token) {
          console.error("Authentication token is missing");
          message.error(
            "Cannot connect to notification service: Missing authentication"
          );
          return;
        }

        // Clean up previous socket connection if exists
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        // Create new socket connection
        socketRef.current = io("https://sohag500.binarybards.online", {
          // socketRef.current = io("http://10.0.60.36:5003", {
          auth: {
            token: token,
          },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          randomizationFactor: 0.5,
        });

        // Connection events
        socketRef.current.on("connect", () => {
          // console.log("✅ Socket connected:", socketRef.current.id);
          setSocketConnected(true);
        });

        socketRef.current.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);
          setSocketConnected(false);
          if (reason === "io server disconnect") {
            // Attempt to reconnect after a delay
            setTimeout(() => {
              socketRef.current.connect();
            }, 1000);
          }
        });

        socketRef.current.on("connect_error", (error) => {
          console.error("❌ Socket connection error:", error.message);
          setSocketConnected(false);
          // Attempt reconnection after delay
          setTimeout(() => {
            socketRef.current.connect();
          }, 2000);
        });

        // Notification channel
        const notificationChannel = `notiffication::admin`;

        socketRef.current.on(notificationChannel, (data) => {
          console.log("📬 Received Notification Data:", data);
          let notification = data;

          if (typeof data === "string") {
            try {
              notification = JSON.parse(data);
            } catch (err) {
              console.error("⚠️ Failed to parse notification:", err);
              notification = {
                message: data,
                timestamp: new Date().toISOString(),
              };
            }
          }

          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          message.info("New notification received");
        });

        console.log(
          `👂 Listening for notifications on: ${notificationChannel}`
        );
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        message.error("Failed to connect to notification service");
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        console.log("🧹 Cleaning up socket connection");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketConnected(false);
      }
    };
  }, [user?.email]);

  // Rest of your component remains the same...
  const handleNotificationRead = () => {
    const readNotifications = notifications.map((n) => ({
      ...n,
      isRead: false,
    }));
    setNotifications(readNotifications);
    setUnreadCount(0);
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
            notifications.length > 0 ? (
              <NotificationPopover
                notifications={notifications}
                onNotificationRead={handleNotificationRead}
              />
            ) : (
              <div className="p-4 text-center">No notifications</div>
            )
          }
          title={
            <div className="flex justify-between items-center">
              <span>Notifications</span>
              <span
                className={socketConnected ? "text-green-500" : "text-red-500"}
              >
                {socketConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          }
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
          <p>{user?.data?.fullName}</p>
        </Link>
      </div>
    </div>
  );
};

export default Header;
