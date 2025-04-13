import React, { useState } from "react";
import { Button, ConfigProvider, Pagination } from "antd";
import {
  useNotificationQuery,
  useReadMutation,
} from "../../../redux/apiSlices/notificationSlice";
import toast from "react-hot-toast";
import { FaRegBell } from "react-icons/fa";

const Notifications = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // ✅ make limit state if you want dynamic limit later
  const { data: notifications, isFetching } = useNotificationQuery({
    page,
    limit,
  }); // ✅ pass object for cleaner queries
  const [read] = useReadMutation();

  const handleRead = async () => {
    try {
      const { status, message } = await read().unwrap();
      if (status) {
        toast.success(message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-1 text-white">
        <h2 className="text-[22px]">All Notifications</h2>
        <button className="bg-gtdandy h-10 rounded-md" onClick={handleRead}>
          Read All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {notifications?.data?.result?.map((notification) => (
          <div
            key={notification._id}
            className="border-b-[1px] pb-2 border-gray-500 flex items-center gap-3"
          >
            <FaRegBell
              size={50}
              className="text-samba bg-[#00000033] p-2 rounded-md"
            />
            <div className="w-full flex items-center justify-between gap-1">
              <div>
                <p>{notification.message}</p>
                <p style={{ color: "gray", marginTop: "4px" }}>
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>

              {!notification.isread && <Button>Read</Button>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-6">
        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                itemActiveBg: "#FFC301",
                itemBg: "black",
                borderRadius: "50px",
                colorText: "white",
              },
            },
            token: {
              colorPrimary: "white",
            },
          }}
        >
          <Pagination
            current={page}
            onChange={(newPage) => setPage(newPage)}
            showSizeChanger={false}
            pageSize={limit}
            total={notifications?.data?.pagination?.total || 0}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Notifications;

