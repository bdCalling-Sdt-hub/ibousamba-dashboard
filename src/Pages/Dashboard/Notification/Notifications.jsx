import React, { useState } from "react";
import { ConfigProvider, Pagination } from "antd";
import {
  useNotificationQuery,
  useReadMutation,
} from "../../../redux/apiSlices/notificationSlice";
import toast from "react-hot-toast";
import { FaRegBell } from "react-icons/fa";
const Notifications = () => {
  const [page, setPage] = useState(1);

  const { data: notifications } = useNotificationQuery();
  const [read] = useReadMutation();
  const date = new Date();
  const handleRead = async () => {
    try {
      await read()
        .unwrap()
        .then(({ status, message }) => {
          if (status) {
            toast.success(message);
          }
        });
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3 text-white">
        <h2 className="text-[22px] ">All Notifications</h2>
        <button className="bg-gtdandy  h-10 rounded-md" onClick={handleRead}>
          Read All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {[...Array(8).keys()].map((notification, index) => {
          return (
            <div
              key={index}
              className="border-b-[1px] pb-2 border-gray-500 flex items-center gap-3"
            >
              <FaRegBell
                size={50}
                className="text-samba bg-[#00000033] p-2 rounded-md"
              />
              <div>
                <p>Your order is Confirmed. Thank you, shop again!</p>
                <p style={{ color: "gray", marginTop: "4px" }}>
                  {date.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
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
            current={parseInt(page)}
            total={50}
            onChange={(page) => setPage(page)}
            showQuickJumper={false}
            showSizeChanger={false}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Notifications;
