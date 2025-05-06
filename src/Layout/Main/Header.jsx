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
        socketRef.current = io("https://socket.atlanticmachineryequip.com/", {
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

// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { FaRegBell } from "react-icons/fa6";
// import { Badge, Avatar, Popover, message } from "antd";
// import { CgMenu } from "react-icons/cg";
// import NotificationPopover from "../../Pages/Dashboard/Notification/NotificationPopover";
// import { imageUrl } from "../../redux/api/baseApi";
// import { io } from "socket.io-client";
// import getPageName from "../../components/common/GetPageName";
// import { useProfileQuery } from "../../redux/apiSlices/profileSlice";

// const Header = ({ toggleSidebar }) => {
//   const [open, setOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState("Disconnected");
//   const socketRef = useRef(null);
//   const { data: user } = useProfileQuery();

//   const src = `${imageUrl}${user?.data?.image || ""}`;

//   // Simplified connection with better debugging
//   useEffect(() => {
//     if (!user?.data?.email) return;

//     const connectSocket = async () => {
//       try {
//         const token = localStorage.getItem("token")
//           ? JSON.parse(localStorage.getItem("token"))
//           : null;

//         if (!token) {
//           console.error("Authentication token is missing");
//           setConnectionStatus("No Auth Token");
//           return;
//         }

//         // Clean up previous socket connection if exists
//         if (socketRef.current) {
//           socketRef.current.disconnect();
//           socketRef.current = null;
//         }

//         console.log("🔄 Attempting to connect to socket server");
//         setConnectionStatus("Connecting...");

//         // Create new socket connection with debugging
//         socketRef.current = io("https://api.atlanticmachineryequip.com/", {
//           auth: { token },
//           // Try both transport methods
//           transports: ["polling", "websocket"],
//           // Disable automatic reconnection to handle it manually
//           reconnection: false,
//           // Set longer timeout
//           timeout: 15000,
//           // Add debug mode
//           debug: true,
//         });

//         // Log socket engine state changes for debugging
//         const engine = socketRef.current.io.engine;

//         if (engine) {
//           engine.on("open", () => {
//             console.log(
//               "✅ Transport connection opened with:",
//               engine.transport.name
//             );
//           });

//           engine.on("close", (reason) => {
//             console.log("❌ Transport connection closed:", reason);
//           });

//           engine.on("error", (err) => {
//             console.error("⚠️ Transport error:", err);
//             setConnectionStatus(`Transport Error: ${err.message}`);
//           });

//           engine.on("upgrade", (transport) => {
//             console.log("🔄 Transport upgraded to:", transport);
//           });
//         }

//         // Connection events
//         socketRef.current.on("connect", () => {
//           console.log("✅ Socket connected:", socketRef.current.id);
//           setSocketConnected(true);
//           setConnectionStatus("Connected");
//         });

//         socketRef.current.on("disconnect", (reason) => {
//           console.log("❌ Socket disconnected:", reason);
//           setSocketConnected(false);
//           setConnectionStatus(`Disconnected: ${reason}`);
//         });

//         socketRef.current.on("connect_error", (error) => {
//           console.error("❌ Socket connection error:", error.message);
//           setSocketConnected(false);
//           setConnectionStatus(`Error: ${error.message}`);
//         });

//         // Notification channel
//         const notificationChannel = `notiffication::admin`;

//         socketRef.current.on(notificationChannel, (data) => {
//           console.log("📬 Received Notification Data:", data);
//           let notification = data;

//           if (typeof data === "string") {
//             try {
//               notification = JSON.parse(data);
//             } catch (err) {
//               console.error("⚠️ Failed to parse notification:", err);
//               notification = {
//                 message: data,
//                 timestamp: new Date().toISOString(),
//               };
//             }
//           }

//           setNotifications((prev) => [notification, ...prev]);
//           setUnreadCount((prev) => prev + 1);
//           message.info("New notification received");
//         });

//         console.log(
//           `👂 Listening for notifications on: ${notificationChannel}`
//         );
//       } catch (error) {
//         console.error("Failed to initialize socket:", error);
//         setConnectionStatus(`Init Error: ${error.message}`);
//       }
//     };

//     connectSocket();

//     return () => {
//       if (socketRef.current) {
//         console.log("🧹 Cleaning up socket connection");
//         socketRef.current.disconnect();
//         socketRef.current = null;
//         setSocketConnected(false);
//       }
//     };
//   }, [user?.data?.email]);

//   const handleNotificationRead = () => {
//     const readNotifications = notifications.map((n) => ({
//       ...n,
//       isRead: false,
//     }));
//     setNotifications(readNotifications);
//     setUnreadCount(0);
//   };

//   // Manual reconnect function
//   const handleManualReconnect = () => {
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current.connect();
//       setConnectionStatus("Reconnecting...");
//       message.info("Attempting to reconnect...");
//     }
//   };

//   // HTTP Fallback - Check server availability
//   const checkServerAvailability = () => {
//     setConnectionStatus("Checking server...");

//     // Simple HTTP request to check if server is reachable at all
//     fetch("https://api.atlanticmachineryequip.com/health", {
//       method: "GET",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => {
//         if (response.ok) {
//           setConnectionStatus("Server reachable, but WebSocket failed");
//         } else {
//           setConnectionStatus(`Server returned ${response.status}`);
//         }
//       })
//       .catch((error) => {
//         setConnectionStatus(`Server unreachable: ${error.message}`);
//       });
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
//             <>
//               {notifications.length > 0 ? (
//                 <NotificationPopover
//                   notifications={notifications}
//                   onNotificationRead={handleNotificationRead}
//                 />
//               ) : (
//                 <div className="p-4 text-center">No notifications</div>
//               )}

//               {/* Connection status and controls */}
//               <div className="p-4 border-t">
//                 <div className="mb-2 flex justify-between items-center">
//                   <span>Connection status:</span>
//                   <span
//                     className={
//                       socketConnected ? "text-green-500" : "text-red-500"
//                     }
//                   >
//                     {connectionStatus}
//                   </span>
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleManualReconnect}
//                     className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
//                   >
//                     Reconnect
//                   </button>

//                   <button
//                     onClick={checkServerAvailability}
//                     className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
//                   >
//                     Check Server
//                   </button>
//                 </div>
//               </div>
//             </>
//           }
//           title="Notifications"
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
//           <p>{user?.data?.fullName}</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Header;
