import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  ConfigProvider,
  Select,
  message,
  Upload,
} from "antd";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { PlusOutlined } from "@ant-design/icons";
import { useCategoryQuery } from "../../../redux/apiSlices/categorySlice";
import { useBrandQuery } from "../../../redux/apiSlices/brandSlice";
import { useGetSubCategoriesQuery } from "../../../redux/apiSlices/subCategorySlice";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../redux/apiSlices/productSlice";
import { getImageUrl } from "../../../components/common/ImageUrl";
import { TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import { useGetLocQuery } from "../../../redux/apiSlices/locApi";

function AddProductModal({
  isModalOpen,
  setIsModalOpen,
  editingProduct,
  onSuccess,
}) {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categoryID, setCategoryID] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Use RTK Query mutation hooks
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: categoryData } = useCategoryQuery();
  const { data: brandData } = useBrandQuery();

  const { data: subCategoryData, isFetching: isSubCategoryLoading } =
    useGetSubCategoriesQuery(categoryID, { skip: !categoryID });

  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue({
        productName: editingProduct?.name,
        brandId: editingProduct.brandId?._id,
        productCategory: editingProduct?.categoryId,
        productSubCategory: editingProduct?.subCategoryId,
        productPrice: editingProduct?.price,
        productCapacity: editingProduct?.capacity,
        productModel: editingProduct?.model,
        productType: editingProduct?.type,
        productPower: editingProduct?.power,
        productDescription: editingProduct?.description,
        latitude: editingProduct.location?.coordinates?.[1],
        longitude: editingProduct.location?.coordinates?.[0],
      });

      // Handle images if they exist
      if (editingProduct.images && editingProduct.images.length > 0) {
        const formattedImages = editingProduct.images.map((img, index) => ({
          uid: `-${index}`,
          name: `Image ${index + 1}`,
          status: "done",
          url: getImageUrl(img), // The image URL
        }));
        setFileList(formattedImages);
      } else {
        setFileList([]);
      }

      // Set category and subcategory if editing
      if (editingProduct.categoryId) {
        setSelectedCategory(editingProduct.categoryId);
        setCategoryID(editingProduct.categoryId);
      }
      if (editingProduct.subCategoryId) {
        setSelectedSubCategory(editingProduct.subCategoryId);
      }
      if (editingProduct.brandId && editingProduct.brandId._id) {
        setSelectedBrand(editingProduct.brandId._id);
      }
    } else {
      form.resetFields();
      setFileList([]);
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedBrand(null);
      setCategoryID(null);
    }
  }, [editingProduct, form]);

  // Separate handlers for each select input
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCategoryID(value);
    setSelectedSubCategory(null);
    // Clear subcategory field when changing category
    form.setFieldsValue({ productSubCategory: undefined });
  };

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    // Don't modify the category or subcategory here
  };

  const handleSubCategoryChange = (value) => {
    setSelectedSubCategory(value);
  };

  // Functions for handling image uploads
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt5MB = file.size / 1024 / 1024 < 5;
    if (!isLt5MB) {
      message.error("Image must be smaller than 5MB!");
    }
    return false; // Prevent auto upload
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const uploadButton = (
    <div>
      <PlusOutlined className="text-black" />
      <div style={{ marginTop: 8, color: "black" }}>Upload</div>
    </div>
  );

  // Validate if latitude is in correct format and range
  const validateLatitude = (_, value) => {
    if (!value) return Promise.resolve();

    // Check if it's a valid number
    const num = Number(value);
    if (isNaN(num)) {
      return Promise.reject("Latitude must be a valid number");
    }

    // Check if latitude is in valid range (-90 to 90)
    if (num < -90 || num > 90) {
      return Promise.reject("Latitude must be between -90 and 90 degrees");
    }

    return Promise.resolve();
  };

  // Validate if longitude is in correct format and range
  const validateLongitude = (_, value) => {
    if (!value) return Promise.resolve();

    // Check if it's a valid number
    const num = Number(value);
    if (isNaN(num)) {
      return Promise.reject("Longitude must be a valid number");
    }

    // Check if longitude is in valid range (-180 to 180)
    if (num < -180 || num > 180) {
      return Promise.reject("Longitude must be between -180 and 180 degrees");
    }

    return Promise.resolve();
  };

  // Handle number input formatting
  const handleCoordinateInput = (e) => {
    // Allow only numbers, decimal point, and minus sign
    let value = e.target.value.replace(/[^0-9.-]/g, "");

    // Ensure proper format (prevent multiple decimal points or minus signs)
    const decimalCount = (value.match(/\./g) || []).length;
    const minusCount = (value.match(/-/g) || []).length;

    if (decimalCount > 1 || (minusCount > 0 && value.indexOf("-") !== 0)) {
      value = value.substring(0, value.length - 1);
    }

    e.target.value = value;
  };

  const onFinish = async (values) => {
    try {
      // Create a new FormData object
      const formData = new FormData();

      // Append form fields to FormData
      formData.append("name", values.productName);
      formData.append("brandId", values.brandId);
      formData.append("categoryId", values.productCategory);
      formData.append("subCategoryId", values.productSubCategory);
      formData.append("price", values.productPrice);
      formData.append("capacity", values.productCapacity);
      formData.append("model", values.productModel);

      if (values.productPower) {
        formData.append("power", values.productPower);
      }

      formData.append("description", values.productDescription);

      // Create location GeoJSON point object - send as separate fields for backend to handle properly
      if (values.longitude && values.latitude) {
        // Final validation check before submission
        const lat = parseFloat(values.latitude);
        const lng = parseFloat(values.longitude);

        if (isNaN(lat) || lat < -90 || lat > 90) {
          message.error(
            "Invalid latitude! Must be between -90 and 90 degrees."
          );
          return;
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
          message.error(
            "Invalid longitude! Must be between -180 and 180 degrees."
          );
          return;
        }

        formData.append(
          "location",
          JSON.stringify({
            type: "Point",
            coordinates: [lng, lat],
          })
        );
      }

      // Append the uploaded images to FormData
      fileList.forEach((file) => {
        // Check if this is a new file (has originFileObj) or an existing file (has url)
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      // If editing, handle existing images
      if (editingProduct && editingProduct.images) {
        const existingImageUrls = fileList
          .filter((file) => typeof file.url === "string")
          .map((file) => file.url);

        if (existingImageUrls.length > 0) {
          formData.append("existingImages", JSON.stringify(existingImageUrls));
        }
      }

      // Display all FormData entries
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        if (key === "images") {
          console.log(key, ":", value.name);
        } else {
          console.log(key, ":", value);
        }
      }

      // Call the appropriate mutation based on whether we're editing or adding
      let response;
      if (editingProduct) {
        // Update product
        response = await updateProduct({
          id: editingProduct._id,
          data: formData,
        }).unwrap();
      } else {
        // Create new product
        response = await createProduct(formData).unwrap();
      }

      // Check for success
      if (response.success) {
        message.success(response.message || "Product saved successfully!");

        // Call onSuccess callback if provided
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(response.data);
        }

        // Reset form and state after success
        form.resetFields();
        setFileList([]); // Clear uploaded files
        setIsModalOpen(false); // Close modal
      } else {
        message.error(response.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error creating/updating product:", error);
      const errorMessage =
        error.data?.message || "Failed to save product. Please try again.";
      message.error(errorMessage);

      // Display specific error sources from the backend
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
                rules={[{ required: true, message: "Category is required!" }]}
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
                  {categoryData?.data?.result?.map((category) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Brand"
                name="brandId"
                rules={[{ required: true, message: "Brand is required!" }]}
              >
                <Select
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300 flex items-center rounded-md"
                  suffixIcon={
                    <MdOutlineArrowDropDown size={25} className="text-white" />
                  }
                  placeholder="Select a brand"
                  value={selectedBrand}
                  onChange={handleBrandChange}
                >
                  {brandData?.data?.map((brand) => (
                    <Select.Option key={brand._id} value={brand._id}>
                      {brand.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Product Name"
                name="productName"
                rules={[
                  { required: true, message: "Product Name is required!" },
                ]}
              >
                <Input
                  placeholder="Enter product name"
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300"
                />
              </Form.Item>
              <Form.Item
                label="Product Price"
                name="productPrice"
                rules={[
                  { required: true, message: "Product Price is required!" },
                ]}
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
                label="Capacity"
                name="productCapacity"
                rules={[
                  { required: true, message: "Product Capacity is required!" },
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
                rules={[
                  { required: true, message: "Product Model is required!" },
                ]}
              >
                <Input
                  placeholder="Enter product model"
                  className="bg-[#1f1f1f] border-none h-12 text-slate-300"
                />
              </Form.Item>

              <Form.Item
                label="Power"
                name="productPower"
                rules={[
                  { required: true, message: "Product Power is required!" },
                ]}
              >
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
                rules={[
                  { required: true, message: "Sub-category is required!" },
                ]}
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
                  {subCategoryData?.data?.result?.map((subCategory) => (
                    <Select.Option
                      key={subCategory._id}
                      value={subCategory._id}
                    >
                      {subCategory.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="w-full flex gap-2">
                <Form.Item
                  label={
                    <p className="flex items-center gap-2">
                      Latitude
                      <TbWorldLatitude />
                    </p>
                  }
                  name="latitude"
                  rules={[
                    { required: true, message: "Latitude is required!" },
                    { validator: validateLatitude },
                  ]}
                  className="w-full"
                >
                  <Input
                    placeholder="Enter Latitude (e.g., 40.7128)"
                    className="bg-[#1f1f1f] border-none h-12 w-full text-slate-300"
                    onInput={handleCoordinateInput}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <p className="flex items-center gap-2">
                      Longitude
                      <TbWorldLongitude />
                    </p>
                  }
                  name="longitude"
                  rules={[
                    { required: true, message: "Longitude is required!" },
                    { validator: validateLongitude },
                  ]}
                  className="w-full"
                >
                  <Input
                    placeholder="Enter Longitude (e.g., -74.0060)"
                    className="bg-[#1f1f1f] border-none h-12 w-full text-slate-300"
                    onInput={handleCoordinateInput}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Product Description"
                name="productDescription"
                rules={[
                  {
                    required: true,
                    message: "Product Description is required!",
                  },
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

              <Form.Item
                label="Product Gallery"
                name="productImage"
                rules={[
                  {
                    required: fileList.length === 0,
                    message: "Please upload at least one image!",
                  },
                ]}
              >
                <Upload
                  listType="picture-circle"
                  fileList={fileList}
                  onChange={handleChange}
                  showUploadList={true}
                  beforeUpload={beforeUpload}
                  customRequest={customRequest}
                  multiple={true}
                  maxCount={3} // Maximum number of files allowed
                  accept="image/jpeg,image/png"
                >
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
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
