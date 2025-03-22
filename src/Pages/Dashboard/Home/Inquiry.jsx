import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MdOutlineDateRange } from "react-icons/md";
import { DatePicker, ConfigProvider } from "antd";
import { useInquiryChartDataQuery } from "../../../redux/apiSlices/inquirySlice";

export default function Inquiry() {
  const [selectedYear, setSelectedYear] = useState("2025"); // Default year
  const { data, isLoading, error } = useInquiryChartDataQuery(selectedYear);

  // Handle Year Selection
  const onChange = (date, dateString) => {
    setSelectedYear(dateString || "2025"); // Fallback to 2025 if no date selected
  };

  // Map API Data to Chart Format
  const chartData =
    data?.data?.map((item) => ({
      month: item.month,
      pv: item.value, // API uses "value" instead of "pv"
    })) || [];

  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            hoverBg: "#5e5e5e ",
            hoverBorderColor: "white ",
            activeBg: "#292929 ",
            activeBorderColor: "white ",
          },
        },
      }}
    >
      <div className="flex items-center justify-between px-6">
        <h2 className="text-lg font-medium text-white">Inquiry Overview</h2>

        <DatePicker
          onChange={onChange}
          picker="year"
          className="border-1 h-8 w-28 py-2 rounded-lg mb-4 bg-[#292929] cursor-pointer"
          placeholder="2025"
          style={{ backdropFilter: "red", color: "white" }}
          suffixIcon={
            <div className="rounded-full w-6 h-6 p-1 flex items-center justify-center bg-gray-300">
              <MdOutlineDateRange color="#232323" />
            </div>
          }
        />
      </div>

      {isLoading ? (
        <p className="text-white text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">Error fetching data</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeWidth={0.2}
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis dataKey="month" className="text-[16px]" />
            <YAxis className="text-[16px]" />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#cea043"
              strokeWidth={2}
              fill=""
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ConfigProvider>
  );
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="relative flex items-center ml-4">
        <div className="absolute w-0 h-0 border-t-8 border-transparent border-b-8 border-r-8 border-prince -left-2"></div>
        <div className="bg-white p-2 text-black rounded shadow-md">
          {payload.map((pld, index) => (
            <div key={index}>Total:{pld.value}</div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
