import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const List = ({ token }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/product/list"
      );

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const response = await axios.delete(
        backendUrl + "/api/product/remove/" + id,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Products
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {products.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl p-4 shadow"
          >

            {/* PRODUCT IMAGE */}
            <img
              src={item.image?.[0]}
              alt={item.name}
              className="w-full h-52 object-cover rounded-lg"
            />

            <h3 className="font-semibold text-lg mt-3">
              {item.name}
            </h3>

            <p className="text-gray-500">
              ${item.price}
            </p>

            <div className="flex gap-3 mt-4">

              <Link
                to={`/edit/${item._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit
              </Link>

              <button
                onClick={() => removeProduct(item._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default List;
