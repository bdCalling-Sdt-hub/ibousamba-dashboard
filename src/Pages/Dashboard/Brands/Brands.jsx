import React, { useState, useEffect } from "react";
import { FiEdit, FiPlusCircle } from "react-icons/fi";
import { RiDeleteBin4Line } from "react-icons/ri";
import AddBrandModal from "./AddBrandModal";
import {
  useBrandQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} from "../../../redux/apiSlices/brandSlice";
import { imageUrl } from "../../../redux/api/baseApi";
import { message, Tooltip } from "antd";
import Loading from "../../../components/Loading";

function Brands() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);

  // API hooks
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  // Fetch brands
  const { data: brandData, isLoading, error, refetch } = useBrandQuery();

  // Store brands in state
  const [brandList, setBrandList] = useState([]);

  useEffect(() => {
    if (brandData?.data) {
      setBrandList(brandData.data);
    }
  }, [brandData]);

  // Open modal to add brand
  const handleAddBrand = () => {
    setCurrentBrand(null);
    setIsModalOpen(true);
  };

  // Open modal to edit brand
  const handleEditBrand = (brand) => {
    setCurrentBrand({
      _id: brand._id,
      name: brand.name,
      brandUrl: brand.brandUrl,
      category: brand.category || [],
      image: `${imageUrl}${brand.image || ""}`,
    });
    setIsModalOpen(true);
  };

  // Delete a brand
  const handleDelete = async (id) => {
    setIsProcessing(true);
    try {
      const response = await deleteBrand(id).unwrap();
      if (response.success) {
        message.success("Brand deleted successfully!");
        setBrandList(brandList.filter((brand) => brand._id !== id));
        refetch();
      }
    } catch (error) {
      console.error("❌ Delete Brand Error:", error);
      message.error("Failed to delete brand");
    } finally {
      setIsProcessing(false);
    }
  };

  // Save brand (add or update)
  const handleSaveBrand = async (brandData) => {
    setIsProcessing(true);

    try {
      const formdata = new FormData();

      // Prepare form data
      formdata.append("brandUrl", brandData.brandUrl);
      formdata.append("name", brandData.name);

      // Add category data
      if (brandData.category && brandData.category.length > 0) {
        formdata.append("category", JSON.stringify(brandData.category));
      }

      // Only append image if a new one is provided
      if (brandData.imageFile) {
        formdata.append("image", brandData.imageFile);
      }

      let response;

      if (currentBrand) {
        response = await updateBrand({
          id: currentBrand._id,
          data: formdata,
        }).unwrap();

        if (response.success) {
          message.success("Brand updated successfully!");
          setBrandList(
            brandList.map((brand) =>
              brand._id === currentBrand._id ? response.data : brand
            )
          );
        }
      } else {
        response = await createBrand(formdata).unwrap();
        if (response.success) {
          message.success("Brand added successfully!");
          setBrandList([...brandList, response.data]);
        }
      }

      setIsModalOpen(false); // Close the modal after successful save
      refetch(); // Refetch to get updated data from the API
    } catch (error) {
      console.error("❌ Save Brand Error:", error);
      message.error(`Failed to ${currentBrand ? "update" : "save"} brand!`);
    } finally {
      setIsProcessing(false);
      setCurrentBrand(null);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading brands</div>;

  return (
    <div className="flex items-center justify-start gap-2 flex-wrap px-3 py-4">
      {/* Add New Brand Button */}
      <div
        onClick={handleAddBrand}
        className="flex flex-col items-center justify-center gap-1 w-44 h-40 border-2 rounded-lg border-dashed cursor-pointer"
      >
        <FiPlusCircle size={40} className="text-white" />
        <p>Add New</p>
      </div>

      {/* Brand List */}
      {brandList.map((brand) => (
        <BrandItem
          key={brand._id}
          brand={brand}
          onDelete={handleDelete}
          onEdit={() => handleEditBrand(brand)}
        />
      ))}

      {/* Add/Edit Brand Modal */}
      <AddBrandModal
        isModalOpen={isModalOpen}
        handleClose={() => {
          setIsModalOpen(false);
          setCurrentBrand(null);
        }}
        handleSave={handleSaveBrand}
        isLoading={isProcessing}
        initialBrand={currentBrand}
      />
    </div>
  );
}

function BrandItem({ brand, onDelete, onEdit }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip
      trigger={"hover"}
      title={
        <div className="text-xs">
          <div>
            <strong>Name:</strong> {brand.name}
          </div>
          <div>
            <strong>URL:</strong> {brand.brandUrl}
          </div>
        </div>
      }
      placement="bottom"
    >
      <div
        className="flex items-center justify-center gap-4 w-44 h-40 border rounded-lg relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={`${imageUrl}${brand?.image || ""}`}
          width={150}
          height={120}
          alt={brand.brandUrl || "Brand"}
          style={{ objectFit: "contain" }}
        />
        {isHovered && (
          <div className="w-full h-full flex gap-2.5 items-center justify-center absolute top-0 left-0 rounded-lg backdrop-blur-sm bg-black bg-opacity-50">
            <FiEdit className="text-white cursor-pointer" onClick={onEdit} />
            <RiDeleteBin4Line
              className="text-white cursor-pointer"
              onClick={() => onDelete(brand._id)}
            />
          </div>
        )}
      </div>
    </Tooltip>
  );
}

export default Brands;
