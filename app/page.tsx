"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [typeButton, setTypeButton] = useState<string>("add");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formAddOrUpdate, setFormAddOrUpdate] = useState<Product>({
    id: 0,
    productName: "",
    price: 0,
    image: "",
    quantity: 0,
  });

  const fetchProducts = (query = "") => {
    const url = query
      ? `http://localhost:3000/api/products?productName=${query}`
      : "http://localhost:3000/api/products";
    axios
      .get(url)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = () => {
    fetchProducts(searchTerm);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormAddOrUpdate((prev) => ({
      ...prev,
      [id]: id === "quantity" || id === "price" ? parseInt(value, 10) : value,
    }));
  };

  const handleEdit = (id: number) => {
    const productToEdit = products.find((product) => product.id === id);
    if (productToEdit) {
      setFormAddOrUpdate(productToEdit);
      setTypeButton("edit");
    }
  };

  const handleAddorUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeButton === "add") {
      axios
        .post("http://localhost:3000/api/products", formAddOrUpdate)
        .then((response) => {
          console.log(response.data.message);
          fetchProducts();
          setFormAddOrUpdate({
            id: 0,
            productName: "",
            price: 0,
            image: "",
            quantity: 0,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (typeButton === "edit") {
      const confirmed = window.confirm(
        "Bạn có chắc muốn cập nhật sản phẩm này không?"
      );
      if (confirmed) {
        axios
          .put(
            `http://localhost:3000/api/products/${formAddOrUpdate.id}`,
            formAddOrUpdate
          )
          .then((response) => {
            console.log(response.data.message);
            fetchProducts();
            setFormAddOrUpdate({
              id: 0,
              productName: "",
              price: 0,
              image: "",
              quantity: 0,
            });
            setTypeButton("add");
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");
    if (confirmed) {
      axios
        .delete(`http://localhost:3000/api/products/${id}`)
        .then(() => {
          fetchProducts();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control mb-2"
            placeholder="Tìm kiếm sản phẩm..."
          />
          <button onClick={handleSearch} className="btn btn-primary mb-4">
            Tìm kiếm
          </button>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.productName}</td>
                  <td className="text-center">
                    <img
                      className="img-fluid"
                      src={product.image}
                      alt={product.productName}
                      style={{ maxWidth: "100px", height: "auto" }}
                    />
                  </td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="btn btn-warning me-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-danger"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-4">
          <form onSubmit={handleAddorUpdate}>
            <h4 className="text-center mb-4">{typeButton === "add" ? "Thêm mới sản phẩm" : "Cập nhật sản phẩm"}</h4>
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">
                Tên
              </label>
              <input
                id="productName"
                className="form-control"
                type="text"
                value={formAddOrUpdate.productName}
                onChange={handleOnChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Hình ảnh
              </label>
              <input
                id="image"
                className="form-control"
                type="text"
                value={formAddOrUpdate.image}
                onChange={handleOnChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Giá
              </label>
              <input
                id="price"
                className="form-control"
                type="number"
                value={formAddOrUpdate.price}
                onChange={handleOnChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">
                Số lượng
              </label>
              <input
                id="quantity"
                className="form-control"
                type="number"
                value={formAddOrUpdate.quantity}
                onChange={handleOnChange}
              />
            </div>
            <button
              type="submit"
              className={`btn ${
                typeButton === "add" ? "btn-primary" : "btn-success"
              } w-100`}
            >
              {typeButton === "add" ? "Thêm" : "Cập nhật"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
