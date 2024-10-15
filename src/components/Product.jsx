import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import Notification from "./Notification";

const allStates = ["get", "post"];

const productInitialState = {
  name: "",
  description: "",
  price: "",
  quantity: 0,
  inStock: false,
};

const fetchProducts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const response = await fetch("http://localhost:8080/products");
  if (!response.ok) throw new Error("Network response was not ok");

  return response.json();
};

const postProduct = async (product) => {
  const response = await fetch("http://localhost:8080/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) throw new Error("Network response was not ok");

  return response.json();
};

const updateProduct = async (product) => {
  const updatedProduct = {
    ...product,
    inStock: product.quantity > 0,
  };

  const response = await fetch(
    `http://localhost:8080/products/${updatedProduct.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    }
  );

  if (!response.ok) throw new Error("Failed to update item");
  return response.json();
};

const deleteItem = async (id) => {
  const response = await fetch(`http://localhost:8080/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete item");
};

const Product = () => {
  // for choosing CRUD
  const [state, setState] = useState("get");
  // for error handling
  const [inputRequired, setInputRequired] = useState("");
  // holding a single product
  const [product, setProduct] = useState(productInitialState);
  // message notification
  const [notification, setNotification] = useState("");

  //use Effect
  useEffect(() => {
    if (state === "post") {
      setProduct(productInitialState);
    }
  }, [state]);

  const queryClient = useQueryClient();

  // get
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  //post
  const mutationPost = useMutation({
    mutationFn: postProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setNotification("Product added!");
      setTimeout(() => setNotification(""), 3000);
      setProduct(productInitialState);
      setState("get");
    },
  });

  // put
  const mutationUpdate = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setNotification("Product updated!");
      setTimeout(() => setNotification(""), 3000);
      setProduct(productInitialState);
      setState("get");
    },
  });

  // delete
  const mutationDelete = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setNotification("Product deleted!");
      setTimeout(() => setNotification(""), 3000);
    },
  });

  // handle onchange input
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProdct) => ({
      ...prevProdct,
      [name]: value,
    }));
  };

  // handle delete
  const handleDelete = (id) => {
    mutationDelete.mutate(id);
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product.name || !product.description || +product.price <= 0) {
      if (product.name && product.description && +product.price <= 0)
        setInputRequired("entere the price > then 0");
      else setInputRequired("Please fill in all required fields.");

      setTimeout(() => {
        setInputRequired("");
      }, 2000);

      return;
    }
    mutationPost.mutate(product);
  };

  // handle update stuff
  const handleEdit = (product) => {
    setState("put");
    setProduct(product);
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    mutationUpdate.mutate(product);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {notification && <Notification message={notification} />}
      <p style={{ display: "flex", justifyContent: "space-around" }}>
        {allStates.map((item, index) => (
          <span
            key={index}
            style={{
              marginRight: "10px",
              fontWeight: "700",
              color: "black",
              background: state === item ? "grey" : "lightblue",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "3px",
            }}
            onClick={() => setState(item)}
          >
            {item}
          </span>
        ))}
      </p>

      {state === "get" && (
        <ul style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
          {data.map(({ id, name, description, price, quantity, inStock }) => (
            <li
              key={id}
              style={{
                maxWidth: "195px",
                background: "gray",
                borderRadius: "4px",
                padding: "10px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "row", gap: "10%" }}
              >
                <h4>{name}</h4>
                <span
                  style={{
                    fontWeight: "bold",
                    background: inStock ? "green" : "red",
                    fontSize: "12px",
                    borderRadius: "2px",
                    padding: "5px",
                  }}
                >
                  {inStock ? "in Stock" : "out Of Stock"}
                </span>
              </div>
              <p>{description}</p>
              <p>Price: ${price}</p>
              <p>Quantity: {quantity}</p>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <button
                  style={{
                    padding: "5px 15px",
                    borderRadius: "4px",
                    border: "none",
                    background: "lightblue",
                  }}
                  onClick={() =>
                    handleEdit({
                      id,
                      name,
                      description,
                      price,
                      quantity,
                      inStock,
                    })
                  }
                >
                  Edit
                </button>
                <button
                  style={{
                    padding: "5px 15px",
                    borderRadius: "4px",
                    border: "none",
                    background: "rgba(255, 128, 102)",
                  }}
                  onClick={() => handleDelete(id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {state === "put" && (
        <div
          style={{
            maxWidth: "195px",
            background: "gray",
            borderRadius: "4px",
            padding: "10px",
          }}
        >
          <form onSubmit={handleUpdate}>
            <input
              style={{ textAlign: "center" }}
              name="name"
              type="text"
              value={product.name}
              onChange={(e) => handleOnChange(e)}
            />

            <input
              style={{ textAlign: "center" }}
              name="description"
              type="text"
              value={product.description}
              onChange={(e) => handleOnChange(e)}
            />

            <input
              style={{ textAlign: "center" }}
              name="price"
              type="number"
              value={product.price}
              onChange={(e) => handleOnChange(e)}
            />

            <input
              style={{ textAlign: "center" }}
              name="quantity"
              type="number"
              value={product.quantity}
              onChange={(e) => handleOnChange(e)}
            />
            <button type="submit">update</button>
          </form>
        </div>
      )}

      {state === "post" && (
        <div style={{ marginBottom: "100px" }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h4 style={{ color: "green" }}>-- Add a product --</h4>
            <label>Name: </label>
            <input
              style={{ textAlign: "center" }}
              name="name"
              type="text"
              value={product.name}
              onChange={(e) => handleOnChange(e)}
            />
            <label>Description: </label>
            <input
              style={{ textAlign: "center" }}
              name="description"
              type="text"
              value={product.description}
              onChange={(e) => handleOnChange(e)}
            />
            <label>Price: </label>
            <input
              style={{ textAlign: "center" }}
              name="price"
              type="number"
              value={product.price}
              onChange={(e) => handleOnChange(e)}
            />
            <br />
            <div style={{ display: "flex", flexDirection: "row", gap: "20%" }}>
              <button type="submit">Add</button>
              <button type="button">clear</button>
            </div>
          </form>
          {inputRequired && (
            <p style={{ textAlign: "center", color: "red" }}>{inputRequired}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Product;
