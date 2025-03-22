import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaHandHoldingDollar,
  FaQuoteRight,
  FaUsers,
} from "react-icons/fa6";
import { TbBellBolt, TbDashboard, TbListDetails } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { BiCategoryAlt } from "react-icons/bi";

import { FiLogOut, FiUsers } from "react-icons/fi";
import { FaCodeBranch, FaRegListAlt } from "react-icons/fa";
import { RiMoneyDollarCircleLine, RiSettings5Line } from "react-icons/ri";
import atlanticLogo from "../../assets/samba/atlanticLogo.png";
import brand from "../../assets/samba/brand.png";
import { LuBoxes } from "react-icons/lu";
import { MdOutlinePermContactCalendar } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { GrLocationPin } from "react-icons/gr";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("logout");
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: <RxDashboard size={24} />,
      label: isCollapsed ? (
        <Link to="/">Overview</Link>
      ) : (
        <Link to="/">Overview</Link>
      ),
    },
    {
      key: "subMenuSetting2",
      icon: <BiCategoryAlt size={25} />,
      label: isCollapsed ? null : "Manage Category",
      children: isCollapsed
        ? [
            {
              key: "/main-category",
              icon: <GrLocationPin size={24} />,
              label: (
                <Link to="/main-category" className="text-white">
                  Main Category
                </Link>
              ),
            },
            {
              key: "/sub-category",
              icon: <FaCodeBranch size={24} />,
              label: (
                <Link to="/sub-category" className="text-white">
                  Sub Category
                </Link>
              ),
            },
          ]
        : [
            {
              key: "/main-category",
              icon: <GrLocationPin size={24} />,
              label: (
                <Link to="/main-category" className="text-white">
                  Main Category
                </Link>
              ),
            },
            {
              key: "/sub-category",
              icon: <FaCodeBranch size={24} />,
              label: (
                <Link to="/sub-category" className="text-white">
                  Sub Category
                </Link>
              ),
            },
          ],
    },
    {
      key: "/products",
      icon: <LuBoxes size={25} />,
      label: isCollapsed ? (
        <Link to="/products">Products</Link>
      ) : (
        <Link to="/products">Products</Link>
      ),
    },
    {
      key: "/all-brands",
      icon: <img src={brand} width={25} />,
      label: isCollapsed ? (
        <Link to="/all-brands">Brands</Link>
      ) : (
        <Link to="/all-brands">Brands</Link>
      ),
    },

    {
      key: "/inquiry",
      icon: <FaClipboardList size={25} />,
      label: isCollapsed ? (
        <Link to="/inquiry">Inquiry</Link>
      ) : (
        <Link to="/inquiry">Inquiry</Link>
      ),
    },

    {
      key: "subMenuSetting1",
      icon: <RiSettings5Line size={25} />,
      label: isCollapsed ? null : "Settings",
      children: isCollapsed
        ? [
            {
              key: "/faq",
              icon: <FaQuoteRight size={25} />,
              label: isCollapsed ? (
                <Link to="/faq">Faq</Link>
              ) : (
                <Link to="/faq">Faq</Link>
              ),
            },
            {
              key: "/return-policy",
              icon: <FaHandHoldingDollar size={24} />,
              label: (
                <Link to="/return-policy" className="text-white">
                  Return Policy
                </Link>
              ),
            },
            {
              key: "/privacy-policy",
              icon: <FaRegListAlt size={24} />,
              label: (
                <Link to="/privacy-policy" className="text-white">
                  Privacy Policy
                </Link>
              ),
            },
            {
              key: "/terms-and-conditons",
              icon: <IoNewspaperOutline size={24} />,
              label: (
                <Link to="/terms-and-conditons" className="text-white">
                  Terms and Conditions
                </Link>
              ),
            },
            {
              key: "/about-us",
              icon: <MdOutlinePermContactCalendar size={24} />,
              label: (
                <Link to="/about-us" className="text-white">
                  About Us
                </Link>
              ),
            },
          ]
        : [
            {
              key: "/faq",
              icon: <FaQuoteRight size={25} />,
              label: isCollapsed ? (
                <Link to="/faq">Faq</Link>
              ) : (
                <Link to="/faq">Faq</Link>
              ),
            },
            {
              key: "/return-policy",
              icon: <FaHandHoldingDollar size={24} />,
              label: (
                <Link to="/return-policy" className="text-white">
                  Return Policy
                </Link>
              ),
            },
            {
              key: "/privacy-policy",
              icon: <FaRegListAlt size={24} />,
              label: (
                <Link to="/privacy-policy" className="text-white">
                  Privacy Policy
                </Link>
              ),
            },
            {
              key: "/terms-and-conditons",
              icon: <IoNewspaperOutline size={24} />,
              label: (
                <Link to="/terms-and-conditons" className="text-white">
                  Terms and Conditions
                </Link>
              ),
            },
            {
              key: "/about-us",
              icon: <MdOutlinePermContactCalendar size={24} />,
              label: (
                <Link to="/about-us" className="text-white">
                  About Us
                </Link>
              ),
            },
          ],
    },

    {
      key: "/contact",
      icon: <FaUsers size={25} />,
      label: isCollapsed ? (
        <Link to="/contact">Contact</Link>
      ) : (
        <Link to="/contact">Contact</Link>
      ),
    },
  ];

  useEffect(() => {
    setSelectedKey(path);
  }, [path]);

  return (
    <div
      className={`bg-sambaSD h-[95%] shadow-md transition-all duration-300 mt-5 rounded-2xl overflow-x-hidden verflow-y-scroll  flex flex-col items-center [&::-webkit-scrollbar]:w-0
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ml-4 ${
                      isCollapsed ? "w-[80px]" : "w-[280px]"
                    }`}
    >
      <Link
        to="/"
        className="flex items-center justify-center py-4 text-white mt-10"
      >
        <div className="w-full flex text-green-600 items-center justify-center px-4 py-3 gap-3 rounded-lg">
          {/* <TbDashboard size={30} className="text-white" />
          {!isCollapsed && <p className="text-xl font-semibold">Dashboard</p>} */}
          <img src={atlanticLogo} />
        </div>
      </Link>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        // style={{ background: "#232323" }}
        items={menuItems}
        inlineCollapsed={isCollapsed}
        className="text-white  bg-sambaSD my-auto"
      />
      <Link
        to="/auth/login"
        className="text-sm text-red-600 flex items-center border border-transparent gap-2 mt-40 mb-8 hover:border hover:border-red-600 rounded-lg px-3 py-1"
        onClick={handleLogout}
      >
        {isCollapsed ? (
          <FiLogOut size={25} />
        ) : (
          <div className="flex gap-2">
            <FiLogOut size={25} /> Log Out
          </div>
        )}
      </Link>
    </div>
  );
};

export default Sidebar;
