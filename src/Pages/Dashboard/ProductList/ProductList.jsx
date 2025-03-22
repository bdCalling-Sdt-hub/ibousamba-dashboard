import React, { useState, useEffect } from "react";
import { Table, Avatar, ConfigProvider, Input, Button } from "antd";
import { FiEdit, FiPlusCircle } from "react-icons/fi";
import AddProductModal from "./AddProductModal";
import { SearchOutlined } from "@ant-design/icons";
import { MdDeleteOutline } from "react-icons/md";
import DeleteModal from "./DeleteModal";
import {
  useProductQuery,
  useDeleteProductMutation,
} from "../../../redux/apiSlices/productSlice";
import { imageUrl } from "../../../redux/api/baseApi";

function ProductList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch products using the useProductQuery hook
  const { data, isLoading, isError, error } = useProductQuery(page);
  console.log("999", data);

  // Add a delete mutation hook
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (data) {
      console.log("Fetched products:", data?.data?.result);
      setProducts(data?.data?.result);
    }

    if (isError) {
      console.error("Error fetching products:", error);
    }
  }, [data, isError, error]);

  const showEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const showAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const addOrUpdateProduct = (product) => {
    if (selectedProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.key === product.key ? product : p))
      );
    } else {
      setProducts((prevProducts) => [...prevProducts, product]);
    }
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const showDetailsModal = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const deleteProductHandler = async () => {
    if (!selectedProduct || !selectedProduct._id) {
      console.error("Product ID is missing or invalid");
      return;
    }

    try {
      await deleteProduct(selectedProduct._id).unwrap();
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.key !== selectedProduct._id)
      );
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };
  // console.log(data?.data?.meta?.limit);

  const showDeleteModal = (product) => {
    if (!product || !product._id) {
      console.error("Invalid product object or missing _id.");
      return;
    }
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const searchableFields = columns(showEditModal, showDeleteModal).map(
    (col) => col.dataIndex
  );

  const filteredData = products.filter((item) =>
    searchableFields.some((field) => {
      if (!item[field]) return false;
      const fieldValue = item[field].toString().toLowerCase();
      const query = searchTerm.toLowerCase();
      if (field === "serial") {
        return fieldValue.includes(query.replace("#", ""));
      }
      return fieldValue.includes(query);
    })
  );

  const dataSource = filteredData.map((item) => ({
    ...item,
    serial: `#${item.serial}`,
  }));

  console.log(page);

  return (
    <div className="px-3 py-4">
      <div className="text-white flex justify-between mb-4">
        <ConfigProvider
          theme={{
            components: {
              Input: {
                colorBgBase: "#1f1f1f",
                colorBgContainer: "#1f1f1f",
                colorBgBaseHover: "#1f1f1f",
                activeBg: "black",
                colorBorder: "transparent",
                colorPrimaryBorder: "transparent",
                boxShadow: "none",
              },
            },
          }}
        >
          <Input
            placeholder="Search here..."
            className="w-1/3 bg-[#1f1f1f] border-none rounded-lg outline-none text-sm text-slate-300"
            prefix={<SearchOutlined className="text-[#5e5e5e] text-lg pl-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </ConfigProvider>
        <button
          className="h-12 w-48 flex items-center text-sm justify-center gap-4 px-5 text-samba bg-sambaSD rounded-lg"
          onClick={showAddModal}
        >
          <FiPlusCircle size={22} />
          Add Product
        </button>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#575858",
              headerSplitColor: "none",
              headerColor: "white",
              borderColor: "#A3A3A3",
              colorBgContainer: "#3a3a3a",
              rowHoverBg: "#4a4a4a",
              colorText: "white",
            },
            Button: {
              defaultBg: "#d99e1e",
              defaultColor: "black",
              defaultBorderColor: "#d99e1e",
              defaultHoverBg: "#d99e1e",
              defaultHoverColor: "black",
              defaultHoverBorderColor: "#d99e1e",
              defaultActiveBg: "#d99e1e",
              defaultActiveColor: "black",
              defaultActiveBorderColor: "#d99e1e",
            },
          },
        }}
      >
        <div className="custom-table">
          <Table
            size="middle"
            dataSource={dataSource}
            columns={columns(showEditModal, showDeleteModal)}
            pagination={{
              onChange: (page) => setPage(page),
              pageSize: data?.data?.meta?.limit,
              total: data?.data?.meta?.total,
            }}
          />
        </div>
        <AddProductModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          addProduct={addOrUpdateProduct}
          editProduct={addOrUpdateProduct}
          editingProduct={selectedProduct}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={deleteProductHandler}
        />
      </ConfigProvider>
    </div>
  );
}

export default ProductList;

const columns = (showEditModal, showDeleteModal) => [
  {
    title: "Sl#",
    dataIndex: "_id",
    key: "_id",
    render: (item, record, index) => <>{`#${index + 1}`}</>,
  },
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_, record) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar
            shape="square"
            size="default"
            src={`${imageUrl}${record?.images}`}
            alt={record.name}
            onError={(e) => {
              console.error("Image failed to load:", record.productImg);
            }}
          />
          <span>{record.name}</span>
        </div>
      );
    },
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Model",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "Capacity",
    dataIndex: "capacity",
    key: "capacity",
  },
  {
    title: "Power",
    dataIndex: "power",
    key: "power",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (_, record) => {
      let statusColor =
        record.status === true
          ? "text-green-600"
          : record.status === false
          ? "text-red-600"
          : "text-[#f4e1b9]";

      return (
        <span className={`${statusColor} text-sm font-semibold`}>
          {record.status === true ? "In Stock" : "Stock Out"}
        </span>
      );
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <div className="flex items-center gap-4">
        <button onClick={() => showEditModal(record)}>
          <FiEdit size={24} />
        </button>
        <button onClick={() => showDeleteModal(record)}>
          <MdDeleteOutline size={25} className="text-red-600" />
        </button>
      </div>
    ),
  },
];

// import React, { useState, useEffect } from "react";
// import { Table, Avatar, ConfigProvider, Input, Button, Spin } from "antd"; // Import Spin
// import { FiEdit, FiPlusCircle } from "react-icons/fi";
// import AddProductModal from "./AddProductModal";
// import { SearchOutlined } from "@ant-design/icons";
// import { MdDeleteOutline } from "react-icons/md";
// import DeleteModal from "./DeleteModal";
// import {
//   useProductQuery,
//   useDeleteProductMutation,
// } from "../../../redux/apiSlices/productSlice";
// import { imageUrl } from "../../../redux/api/baseApi";
// import Loading from "../../../components/Loading";

// function ProductList() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [page, setPage] = useState(1);

//   // Fetch products using the useProductQuery hook
//   const { data, isLoading, isError, error } = useProductQuery(page);

//   const [deleteProduct] = useDeleteProductMutation();

//   useEffect(() => {
//     if (data) {
//       setProducts(data?.data?.result);
//     }

//     if (isError) {
//       console.error("Error fetching products:", error);
//     }
//   }, [data, isError, error]);

//   const showEditModal = (product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const showAddModal = () => {
//     setSelectedProduct(null);
//     setIsModalOpen(true);
//   };

//   const addOrUpdateProduct = (product) => {
//     if (selectedProduct) {
//       setProducts((prevProducts) =>
//         prevProducts.map((p) => (p.key === product.key ? product : p))
//       );
//     } else {
//       setProducts((prevProducts) => [...prevProducts, product]);
//     }
//     setSelectedProduct(null);
//     setIsModalOpen(false);
//   };

//   const showDetailsModal = (product) => {
//     setSelectedProduct(product);
//     setIsDetailsModalOpen(true);
//   };

//   const deleteProductHandler = async () => {
//     if (!selectedProduct || !selectedProduct._id) {
//       console.error("Product ID is missing or invalid");
//       return;
//     }

//     try {
//       await deleteProduct(selectedProduct._id).unwrap();
//       setProducts((prevProducts) =>
//         prevProducts.filter((product) => product.key !== selectedProduct._id)
//       );
//       setIsDeleteModalOpen(false);
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     }
//   };

//   const showDeleteModal = (product) => {
//     if (!product || !product._id) {
//       console.error("Invalid product object or missing _id.");
//       return;
//     }
//     setSelectedProduct(product);
//     setIsDeleteModalOpen(true);
//   };

//   const searchableFields = columns(showEditModal, showDeleteModal).map(
//     (col) => col.dataIndex
//   );

//   const filteredData = products.filter((item) =>
//     searchableFields.some((field) => {
//       if (!item[field]) return false;
//       const fieldValue = item[field].toString().toLowerCase();
//       const query = searchTerm.toLowerCase();
//       if (field === "serial") {
//         return fieldValue.includes(query.replace("#", ""));
//       }
//       return fieldValue.includes(query);
//     })
//   );

//   const dataSource = filteredData.map((item) => ({
//     ...item,
//     serial: `#${item.serial}`,
//   }));

//   return (
//     <div className="px-3 py-4">
//       <div className="text-white flex justify-between mb-4">
//         <ConfigProvider
//           theme={{
//             components: {
//               Input: {
//                 colorBgBase: "#1f1f1f",
//                 colorBgContainer: "#1f1f1f",
//                 colorBgBaseHover: "#1f1f1f",
//                 activeBg: "black",
//                 colorBorder: "transparent",
//                 colorPrimaryBorder: "transparent",
//                 boxShadow: "none",
//               },
//             },
//           }}
//         >
//           <Input
//             placeholder="Search here..."
//             className="w-1/3 bg-[#1f1f1f] border-none rounded-lg outline-none text-sm text-slate-300"
//             prefix={<SearchOutlined className="text-[#5e5e5e] text-lg pl-4" />}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </ConfigProvider>
//         <button
//           className="h-12 w-48 flex items-center text-sm justify-center gap-4 px-5 text-samba bg-sambaSD rounded-lg"
//           onClick={showAddModal}
//         >
//           <FiPlusCircle size={22} />
//           Add Product
//         </button>
//       </div>

//       <ConfigProvider
//         theme={{
//           components: {
//             Table: {
//               headerBg: "#575858",
//               headerSplitColor: "none",
//               headerColor: "white",
//               borderColor: "#A3A3A3",
//               colorBgContainer: "#3a3a3a",
//               rowHoverBg: "#4a4a4a",
//               colorText: "white",
//             },
//             Button: {
//               defaultBg: "#d99e1e",
//               defaultColor: "black",
//               defaultBorderColor: "#d99e1e",
//               defaultHoverBg: "#d99e1e",
//               defaultHoverColor: "black",
//               defaultHoverBorderColor: "#d99e1e",
//               defaultActiveBg: "#d99e1e",
//               defaultActiveColor: "black",
//               defaultActiveBorderColor: "#d99e1e",
//             },
//           },
//         }}
//       >
//         <div className="custom-table">
//           {isLoading ? (
//             <Loading />
//           ) : (
//             <Table
//               size="middle"
//               dataSource={dataSource}
//               columns={columns(showEditModal, showDeleteModal)}
//               pagination={{
//                 onChange: (page) => setPage(page),
//                 pageSize: data?.data?.meta?.limit,
//                 total: data?.data?.meta?.total,
//               }}
//             />
//           )}
//         </div>
//         <AddProductModal
//           isModalOpen={isModalOpen}
//           setIsModalOpen={setIsModalOpen}
//           addProduct={addOrUpdateProduct}
//           editProduct={addOrUpdateProduct}
//           editingProduct={selectedProduct}
//         />
//         <DeleteModal
//           isOpen={isDeleteModalOpen}
//           onClose={() => setIsDeleteModalOpen(false)}
//           onConfirm={deleteProductHandler}
//         />
//       </ConfigProvider>
//     </div>
//   );
// }

// export default ProductList;

// const columns = (showEditModal, showDeleteModal) => [
//   {
//     title: "Sl#",
//     dataIndex: "_id",
//     key: "_id",
//     render: (item, record, index) => <>{`#${index + 1}`}</>,
//   },
//   {
//     title: "Product Name",
//     dataIndex: "name",
//     key: "name",
//     render: (_, record) => {
//       return (
//         <div className="flex items-center gap-2">
//           <Avatar
//             shape="square"
//             size="default"
//             src={`${imageUrl}${record?.images}`}
//             alt={record.name}
//             onError={(e) => {
//               console.error("Image failed to load:", record.productImg);
//             }}
//           />
//           <span>{record.name}</span>
//         </div>
//       );
//     },
//   },
//   {
//     title: "Price",
//     dataIndex: "price",
//     key: "price",
//   },
//   {
//     title: "Model",
//     dataIndex: "model",
//     key: "model",
//   },
//   {
//     title: "Capacity",
//     dataIndex: "capacity",
//     key: "capacity",
//   },
//   {
//     title: "Power",
//     dataIndex: "power",
//     key: "power",
//   },
//   {
//     title: "Status",
//     dataIndex: "status",
//     key: "status",
//     render: (_, record) => {
//       let statusColor =
//         record.status === true
//           ? "text-green-600"
//           : record.status === false
//           ? "text-red-600"
//           : "text-[#f4e1b9]";

//       return (
//         <span className={`${statusColor} text-sm font-semibold`}>
//           {record.status === true ? "In Stock" : "Stock Out"}
//         </span>
//       );
//     },
//   },
//   {
//     title: "Actions",
//     key: "actions",
//     render: (_, record) => (
//       <div className="flex items-center gap-4">
//         <button onClick={() => showEditModal(record)}>
//           <FiEdit size={24} />
//         </button>
//         <button onClick={() => showDeleteModal(record)}>
//           <MdDeleteOutline size={25} className="text-red-600" />
//         </button>
//       </div>
//     ),
//   },
// ];
