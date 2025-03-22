// import React, { useState, useEffect } from "react";
// import { Modal, Form, Input, ConfigProvider, Select, message } from "antd";
// import UploadComponent from "./UploadComponent";
// import { MdOutlineArrowDropDown } from "react-icons/md";
// import { useCategoryQuery } from "../../../redux/apiSlices/categorySlice";
// import { useGetSubCategoriesQuery } from "../../../redux/apiSlices/subCategorySlice";
// import {
//   useCreateProductMutation,
//   useUpdateProductMutation,
// } from "../../../redux/apiSlices/productSlice";

// function AddProductModal({
//   isModalOpen,
//   setIsModalOpen,
//   editingProduct,
//   onSuccess,
// }) {
//   const [form] = Form.useForm();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubCategory, setSelectedSCategory] = useState(null);
//   const [categoryID, setCategoryID] = useState(null);
//   const [uploadedFiles, setUploadedFiles] = useState([]);

//   // Use RTK Query mutation hooks
//   const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
//   const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

//   const { data: categoryData } = useCategoryQuery();
//   const { data: subCategoryData, isFetching: isSubCategoryLoading } =
//     useGetSubCategoriesQuery(categoryID, { skip: !categoryID });

//   useEffect(() => {
//     if (editingProduct) {
//       form.setFieldsValue({
//         productName: editingProduct.name,
//         productCategory: editingProduct.categoryId,
//         productSubCategory: editingProduct.subCategoryId,
//         productPrice: editingProduct.price,
//         productCapacity: editingProduct.capacity,
//         productModel: editingProduct.model,
//         productType: editingProduct.type,
//         productPower: editingProduct.power,
//         productDescription: editingProduct.description,
//       });

//       // Handle images if they exist
//       if (editingProduct.images && editingProduct.images.length > 0) {
//         const formattedImages = editingProduct.images.map((img, index) => ({
//           uid: `-${index}`,
//           name: `Image ${index + 2}`,
//           status: "done",
//           url: img, // The image URL
//           originFileObj: img, // Store the URL for backend reference
//         }));
//         setUploadedFiles(formattedImages);
//       } else {
//         setUploadedFiles([]);
//       }

//       // Set category and subcategory if editing
//       if (editingProduct.categoryId) {
//         setSelectedCategory(editingProduct.categoryId);
//         setCategoryID(editingProduct.categoryId);
//       }
//       if (editingProduct.subCategoryId) {
//         setSelectedSCategory(editingProduct.subCategoryId);
//       }
//     } else {
//       form.resetFields();
//       setUploadedFiles([]);
//       setSelectedCategory(null);
//       setSelectedSCategory(null);
//       setCategoryID(null);
//     }
//   }, [editingProduct, form]);

//   const handleCategoryChange = (value) => {
//     setSelectedCategory(value);
//     setCategoryID(value);
//     setSelectedSCategory(null);
//     // Clear subcategory field when changing category
//     form.setFieldsValue({ productSubCategory: undefined });
//   };

//   const handleSubCategoryChange = (value) => {
//     setSelectedSCategory(value);
//   };

//   // Function to handle files from Upload component
//   const handleFileUpload = (files) => {
//     setUploadedFiles(files);
//   };

//   const onFinish = async (values) => {
//     try {
//       const formData = new FormData();

//       // Append all form fields with proper naming for backend
//       formData.append("name", values.productName);
//       formData.append("categoryId", values.productCategory);
//       formData.append("subCategoryId", values.productSubCategory);
//       formData.append("price", values.productPrice);
//       formData.append("capacity", values.productCapacity);
//       formData.append("model", values.productModel);
//       formData.append("type", values.productType);

//       if (values.productPower) {
//         formData.append("power", values.productPower);
//       }

//       formData.append("description", values.productDescription);

//       // Append images - Using the field name expected by the backend
//       uploadedFiles.forEach((file) => {
//         if (file.originFileObj instanceof File) {
//           // Append as 'images' which seems to be what the backend expects based on response
//           formData.append("images", file.originFileObj);
//         }
//       });

//       // If editing and there are existing images to keep
//       if (editingProduct && editingProduct.images) {
//         // Handle existing images according to your backend expectations
//         const existingImageUrls = uploadedFiles
//           .filter((file) => typeof file.url === "string")
//           .map((file) => file.url);

//         if (existingImageUrls.length > 0) {
//           formData.append("existingImages", JSON.stringify(existingImageUrls));
//         }
//       }

//       let response;
//       // Call the appropriate mutation based on whether we're editing or adding
//       if (editingProduct) {
//         response = await updateProduct({
//           id: editingProduct._id,
//           data: formData,
//         }).unwrap();
//       } else {
//         response = await createProduct(formData).unwrap();
//       }

//       // Check if the response indicates success
//       if (response.success) {
//         message.success(response.message || "Product saved successfully!");

//         // Call the success callback if provided
//         if (onSuccess && typeof onSuccess === "function") {
//           onSuccess(response.data);
//         }

//         // Reset form and state
//         form.resetFields();
//         setUploadedFiles([]);
//         setIsModalOpen(false);
//       } else {
//         message.error(response.message || "Operation failed");
//       }
//     } catch (error) {
//       console.error("Error creating/updating product:", error);
//       const errorMessage =
//         error.data?.message || "Failed to save product. Please try again.";
//       message.error(errorMessage);

//       // If there are specific error sources from the backend
//       if (error.data?.errorSources?.length > 0) {
//         error.data.errorSources.forEach((err) => {
//           message.error(`${err.path}: ${err.message}`);
//         });
//       }
//     }
//   };

//   return (
//     <ConfigProvider
//       theme={{
//         components: {
//           Modal: {
//             contentBg: "#292929",
//             headerBg: "#292929",
//             titleColor: "#ffffff",
//             titleFontSize: 24,
//           },
//           Form: { labelColor: "#efefef" },
//           Input: {
//             colorBgBase: "#1f1f1f",
//             colorBgContainer: "#1f1f1f",
//             colorBorder: "transparent",
//             boxShadow: "none",
//           },
//         },
//       }}
//     >
//       <Modal
//         title={editingProduct ? "Edit Product Details" : "Add Product Details"}
//         open={isModalOpen}
//         width={1000}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         centered
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           style={{ padding: 5, marginBlockStart: 15 }}
//           onFinish={onFinish}
//         >
//           <div className="flex gap-4">
//             <div className="w-1/2">
//               <Form.Item
//                 label="Category"
//                 name="productCategory"
//                 rules={[{ required: true, message: "Category required!" }]}
//               >
//                 <Select
//                   className="bg-[#1f1f1f] border-none h-12 text-slate-300 flex items-center rounded-md"
//                   suffixIcon={
//                     <MdOutlineArrowDropDown size={25} className="text-white" />
//                   }
//                   placeholder="Select a Category"
//                   value={selectedCategory}
//                   onChange={handleCategoryChange}
//                 >
//                   {categoryData?.data?.map((category) => (
//                     <Select.Option key={category._id} value={category._id}>
//                       {category.name}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 label="Product Name"
//                 name="productName"
//                 rules={[{ required: true, message: "Product Name required!" }]}
//               >
//                 <Input
//                   placeholder="Enter product name"
//                   className="bg-[#1f1f1f] border-none h-12 text-slate-300"
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Capacity"
//                 name="productCapacity"
//                 rules={[
//                   { required: true, message: "Product Capacity required!" },
//                 ]}
//               >
//                 <Input
//                   placeholder="Enter product capacity"
//                   className="bg-[#1f1f1f] border-none h-12 text-slate-300"
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Model"
//                 name="productModel"
//                 rules={[{ required: true, message: "Product Model required!" }]}
//               >
//                 <Input
//                   placeholder="Enter product model"
//                   className="bg-[#1f1f1f] border-none h-12 text-slate-300"
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Type"
//                 name="productType"
//                 rules={[{ required: true, message: "Product Type required!" }]}
//               >
//                 <Input
//                   placeholder="Enter product type"
//                   className="bg-[#1f1f1f] border-none h-12 text-slate-300"
//                 />
//               </Form.Item>

//               <Form.Item label="Power" name="productPower">
//                 <Input
//                   placeholder="Enter product power"
//                   className="bg-[#1f1f1f] border-none h-12 text-slate-300"
//                 />
//               </Form.Item>
//             </div>

//             <div className="w-1/2">
//               <Form.Item
//                 label="Sub-category"
//                 name="productSubCategory"
//                 rules={[{ required: true, message: "Sub-category required!" }]}
//               >
//                 <Select
//                   className="bg-[#1f1f1f] border-none h-12 text-slate-300 flex items-center rounded-md"
//                   suffixIcon={
//                     <MdOutlineArrowDropDown size={25} className="text-white" />
//                   }
//                   placeholder="Select a Sub-category"
//                   value={selectedSubCategory}
//                   onChange={handleSubCategoryChange}
//                   disabled={isSubCategoryLoading || !categoryID}
//                   loading={isSubCategoryLoading}
//                 >
//                   {subCategoryData?.data?.map((subCategory) => (
//                     <Select.Option
//                       key={subCategory._id}
//                       value={subCategory._id}
//                     >
//                       {subCategory.name}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 label="Product Price"
//                 name="productPrice"
//                 rules={[{ required: true, message: "Product Price required!" }]}
//               >
//                 <Input
//                   placeholder="Enter product price"
//                   className="bg-[#1f1f1f] border-none h-12 text-slate-300"
//                   onInput={(e) =>
//                     (e.target.value = e.target.value.replace(/[^0-9.]/g, ""))
//                   }
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Product Description"
//                 name="productDescription"
//                 rules={[
//                   { required: true, message: "Product Description required!" },
//                 ]}
//               >
//                 <Input.TextArea
//                   placeholder="Write product description"
//                   className="border-none text-slate-300"
//                   style={{
//                     resize: "none",
//                     height: "175px",
//                     overflowY: "scroll",
//                     scrollbarWidth: "none",
//                   }}
//                 />
//               </Form.Item>

//               <Form.Item label="Product Gallery" name="productImage">
//                 <UploadComponent
//                   onFileUpload={handleFileUpload}
//                   existingFiles={uploadedFiles}
//                 />
//               </Form.Item>
//             </div>
//           </div>

//           <Form.Item>
//             <button
//               type="submit"
//               className="w-full h-12 bg-samba hover:bg-samba/90 text-white text-[18px] font-medium rounded-lg"
//               disabled={isCreating || isUpdating}
//             >
//               {isCreating || isUpdating ? (
//                 <span>Processing...</span>
//               ) : editingProduct ? (
//                 "Update Product"
//               ) : (
//                 "Add Product"
//               )}
//             </button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </ConfigProvider>
//   );
// }

// export default AddProductModal;

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, ConfigProvider, Select, message } from "antd";
import UploadComponent from "./UploadComponent";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useCategoryQuery } from "../../../redux/apiSlices/categorySlice";
import { useGetSubCategoriesQuery } from "../../../redux/apiSlices/subCategorySlice";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../redux/apiSlices/productSlice";

function AddProductModal({
  isModalOpen,
  setIsModalOpen,
  editingProduct,
  onSuccess,
}) {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSCategory] = useState(null);
  const [categoryID, setCategoryID] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Use RTK Query mutation hooks
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: categoryData } = useCategoryQuery();
  const { data: subCategoryData, isFetching: isSubCategoryLoading } =
    useGetSubCategoriesQuery(categoryID, { skip: !categoryID });

  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue({
        productName: editingProduct.name,
        productCategory: editingProduct.categoryId,
        productSubCategory: editingProduct.subCategoryId,
        productPrice: editingProduct.price,
        productCapacity: editingProduct.capacity,
        productModel: editingProduct.model,
        productType: editingProduct.type,
        productPower: editingProduct.power,
        productDescription: editingProduct.description,
      });

      // Handle images if they exist
      if (editingProduct.images && editingProduct.images.length > 0) {
        const formattedImages = editingProduct.images.map((img, index) => ({
          uid: `-${index}`,
          name: `Image ${index + 2}`,
          status: "done",
          url: img, // The image URL
          originFileObj: img, // Store the URL for backend reference
        }));
        setUploadedFiles(formattedImages);
      } else {
        setUploadedFiles([]);
      }

      // Set category and subcategory if editing
      if (editingProduct.categoryId) {
        setSelectedCategory(editingProduct.categoryId);
        setCategoryID(editingProduct.categoryId);
      }
      if (editingProduct.subCategoryId) {
        setSelectedSCategory(editingProduct.subCategoryId);
      }
    } else {
      form.resetFields();
      setUploadedFiles([]);
      setSelectedCategory(null);
      setSelectedSCategory(null);
      setCategoryID(null);
    }
  }, [editingProduct, form]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCategoryID(value);
    setSelectedSCategory(null);
    // Clear subcategory field when changing category
    form.setFieldsValue({ productSubCategory: undefined });
  };

  const handleSubCategoryChange = (value) => {
    setSelectedSCategory(value);
  };

  // Function to handle files from Upload component
  const handleFileUpload = (files) => {
    setUploadedFiles(files);
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      // Append all form fields with proper naming for backend
      formData.append("name", values.productName);
      formData.append("categoryId", values.productCategory);
      formData.append("subCategoryId", values.productSubCategory);
      formData.append("price", values.productPrice);
      formData.append("capacity", values.productCapacity);
      formData.append("model", values.productModel);
      formData.append("type", values.productType);

      if (values.productPower) {
        formData.append("power", values.productPower);
      }

      formData.append("description", values.productDescription);

      // Append images - Using the field name expected by the backend
      uploadedFiles.forEach((file) => {
        if (file.originFileObj instanceof File) {
          // Append as 'images' which seems to be what the backend expects based on response
          formData.append("images", file.originFileObj);
        }
      });

      // If editing and there are existing images to keep
      if (editingProduct && editingProduct.images) {
        // Handle existing images according to your backend expectations
        const existingImageUrls = uploadedFiles
          .filter((file) => typeof file.url === "string")
          .map((file) => file.url);

        if (existingImageUrls.length > 0) {
          formData.append("existingImages", JSON.stringify(existingImageUrls));
        }
      }

      let response;
      // Call the appropriate mutation based on whether we're editing or adding
      if (editingProduct) {
        response = await updateProduct({
          id: editingProduct._id,
          data: formData,
        }).unwrap();
      } else {
        response = await createProduct(formData).unwrap();
      }

      // Check if the response indicates success
      if (response.success) {
        message.success(response.message || "Product saved successfully!");

        // Call the success callback if provided
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(response.data);
        }

        // Reset form and state
        form.resetFields();
        setUploadedFiles([]);
        setIsModalOpen(false);
      } else {
        message.error(response.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error creating/updating product:", error);
      const errorMessage =
        error.data?.message || "Failed to save product. Please try again.";
      message.error(errorMessage);

      // If there are specific error sources from the backend
      if (error.data?.errorSources?.length > 0) {
        error.data.errorSources.forEach((err) => {
          message.error(`${err.path}: ${err.message}`);
        });
      }
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: "#292929",
            headerBg: "#292929",
            titleColor: "#ffffff",
            titleFontSize: 24,
          },
          Form: { labelColor: "#efefef" },
          Input: {
            colorBgBase: "#1f1f1f",
            colorBgContainer: "#1f1f1f",
            colorBorder: "transparent",
            boxShadow: "none",
          },
        },
      }}
    >
      <Modal
        title={editingProduct ? "Edit Product Details" : "Add Product Details"}
        open={isModalOpen}
        width={1000}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          style={{ padding: 5, marginBlockStart: 15 }}
          onFinish={onFinish}
        >
          <div className="flex gap-4">
            <div className="w-1/2">
              <Form.Item
                label="Category"
                name="productCategory"
                rules={[{ required: true, message: "Category required!" }]}
              >
                <Select
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300 flex items-center rounded-md"
                  suffixIcon={
                    <MdOutlineArrowDropDown size={25} className="text-white" />
                  }
                  placeholder="Select a Category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categoryData?.data?.map((category) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Product Name"
                name="productName"
                rules={[{ required: true, message: "Product Name required!" }]}
              >
                <Input
                  placeholder="Enter product name"
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300"
                />
              </Form.Item>

              <Form.Item
                label="Capacity"
                name="productCapacity"
                rules={[
                  { required: true, message: "Product Capacity required!" },
                ]}
              >
                <Input
                  placeholder="Enter product capacity"
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300"
                />
              </Form.Item>

              <Form.Item
                label="Model"
                name="productModel"
                rules={[{ required: true, message: "Product Model required!" }]}
              >
                <Input
                  placeholder="Enter product model"
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300"
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="productType"
                rules={[{ required: true, message: "Product Type required!" }]}
              >
                <Input
                  placeholder="Enter product type"
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300"
                />
              </Form.Item>

              <Form.Item label="Power" name="productPower">
                <Input
                  placeholder="Enter product power"
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300"
                />
              </Form.Item>
            </div>

            <div className="w-1/2">
              <Form.Item
                label="Sub-category"
                name="productSubCategory"
                rules={[{ required: true, message: "Sub-category required!" }]}
              >
                <Select
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300 flex items-center rounded-md"
                  suffixIcon={
                    <MdOutlineArrowDropDown size={25} className="text-white" />
                  }
                  placeholder="Select a Sub-category"
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  disabled={isSubCategoryLoading || !categoryID}
                  loading={isSubCategoryLoading}
                >
                  {subCategoryData?.data?.map((subCategory) => (
                    <Select.Option
                      key={subCategory._id}
                      value={subCategory._id}
                    >
                      {subCategory.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Product Price"
                name="productPrice"
                rules={[{ required: true, message: "Product Price required!" }]}
              >
                <Input
                  placeholder="Enter product price"
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/[^0-9.]/g, ""))
                  }
                />
              </Form.Item>

              <Form.Item
                label="Product Description"
                name="productDescription"
                rules={[
                  { required: true, message: "Product Description required!" },
                ]}
              >
                <Input.TextArea
                  placeholder="Write product description"
                  className="border-none text-slate-300"
                  style={{
                    resize: "none",
                    height: "175px",
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                  }}
                />
              </Form.Item>

              <Form.Item label="Product Gallery" name="productImage">
                <UploadComponent
                  onFileUpload={handleFileUpload}
                  existingFiles={uploadedFiles}
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <button
              type="submit"
              className="w-full h-12 bg-samba hover:bg-samba/90 text-white text-[18px] font-medium rounded-lg"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <span>Processing...</span>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}

export default AddProductModal;
