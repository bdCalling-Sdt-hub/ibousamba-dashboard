import React from "react";
import { FaBoxOpen, FaFolderOpen } from "react-icons/fa6";

import Inquiry from "./Inquiry";
import { useProductCountQuery } from "../../../redux/apiSlices/productSlice";
import { useInquiryCountQuery } from "../../../redux/apiSlices/inquirySlice";

import LatestInquiryList from "./LatestInquiryList";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading";

const Card = ({ item }) => (
  <div className="flex w-full items-center justify-start pl-10 h-28 rounded-xl bg-quilocoP gap-5">
    <div
      className={`${item.bg} w-20 h-20 flex items-center justify-center rounded-full`}
    >
      {item.icon}
    </div>
    <div className="flex flex-col">
      <h1 className="text-[24px] text-white font-normal mb-1">{item.label}</h1>
      <p className="text-[32px] text-white font-medium">{item.value}</p>
    </div>
  </div>
);
const Home = () => {
  const {
    data: productCount,
    isError: productError,
    isLoading: productLoading,
  } = useProductCountQuery();
  const {
    data: inquiryCount,
    isError: inquiryError,
    isLoading: inquiryLoading,
  } = useInquiryCountQuery();

  if (productLoading || inquiryLoading) return <Loading />;
  if (productError || inquiryError) return <div>Error fetching data</div>;

  const stats = [
    {
      label: "Total Inquiry",
      value: inquiryCount?.data?.total,
      icon: <FaFolderOpen size={60} className="text-white" />,
      bg: "bg-quilocoS",
    },
    {
      label: "Total Products",
      value: productCount?.data?.total,
      icon: <FaBoxOpen size={60} className="text-white" />,
      bg: "bg-quilocoS",
    },
  ];

  return (
    <div className="px-3">
      <div className="flex flex-col flex-wrap items-end gap-5 justify-between w-full bg-transparent rounded-md">
        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-5 w-full">
          {stats.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-5 w-full">
          <div className="w-full p-4 bg-quilocoP rounded-lg">
            <Inquiry />
          </div>
        </div>
        <div className="w-full">
          <div className="w-full flex items-center justify-between mb-2 text-white">
            <h3 className=" text-[24px] text-samba font-bold">
              Latest inquiry list:
            </h3>
            <Link className="underline cursor-pointer" to="/inquiry">
              See all
            </Link>
          </div>

          <div
            className="h-[] overflow-y-scroll rounded-lg bg-quilocoP [&::-webkit-scrollbar]:w-0
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          >
            <LatestInquiryList />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
