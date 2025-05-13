import React, { useState } from "react";
import { Alert, Button, ConfigProvider, Pagination } from "antd";
import { useNotificationQuery } from "../../../redux/apiSlices/notificationSlice";

import { FaRegBell } from "react-icons/fa";
import Loading from "../../../components/Loading";

const Notifications = () => {
  const [page, setPage] = useState(1);
  const limit = 10; // match the backend default or make it dynamic later if needed

  const {
    data: notifications,
    isLoading,
    isError,
  } = useNotificationQuery({ page });

  const results = notifications?.data?.result || [];
  const meta = notifications?.data?.meta;

  if (isLoading) return <Loading />;
  if (isError)
    return <Alert message="Failed to load Notifications!" type="error" />;
  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-1 text-white">
        <h2 className="text-[22px] mb-2">All Notifications</h2>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {results.map((notification) => (
          <div
            key={notification._id}
            className="border-b pb-2 border-gray-500 flex items-center gap-3"
          >
            <FaRegBell
              size={50}
              className="text-samba bg-[#00000033] p-2 rounded-md"
            />
            <div className="w-full flex items-center justify-between">
              <div>
                <p>{notification.message}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isRead && <Button>Read</Button>}
            </div>
          </div>
        ))}
      </div>

      {meta?.total > limit && (
        <div className="flex items-center justify-center mt-2">
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
              current={meta.page}
              pageSize={meta.limit}
              total={meta.total}
              showSizeChanger={false}
              onChange={(newPage) => setPage(newPage)}
            />
          </ConfigProvider>
        </div>
      )}
    </div>
  );
};

export default Notifications;
