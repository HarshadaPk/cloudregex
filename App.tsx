import { useEffect, useState } from "react";
import "./App.css";

type Product = {
  _id?: string;
  name: string;
  originalPrice: number;
  offerPrice: number;
  finalPrice: number;
  stock: string;
  image: string;
};

const API = "http://localhost:5000/products";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  const [form, setForm] = useState({
    name: "",
    originalPrice: "",
    offerPrice: "",
    stock: "In Stock",
    image: "",
  });

  // ================= FETCH =================
  const fetchProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= INPUT =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalPrice =
      Number(form.originalPrice) - Number(form.offerPrice);

    const newProduct = {
      ...form,
      originalPrice: Number(form.originalPrice),
      offerPrice: Number(form.offerPrice),
      finalPrice,
    };

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    setForm({
      name: "",
      originalPrice: "",
      offerPrice: "",
      stock: "In Stock",
      image: "",
    });

    fetchProducts(); // refresh list
  };

  // ================= DELETE =================
  const deleteProduct = async (id?: string) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  // ================= UI =================
  return (
    <div className="container">
      <h2>Product Catalogue</h2>

      {/* ---------- FORM ---------- */}
      <form onSubmit={handleSubmit} className="card">
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="originalPrice"
          type="number"
          placeholder="Original Price"
          value={form.originalPrice}
          onChange={handleChange}
          required
        />

        <input
          name="offerPrice"
          type="number"
          placeholder="Offer Price"
          value={form.offerPrice}
          onChange={handleChange}
          required
        />

        <select
          name="stock"
          value={form.stock}
          onChange={handleChange}
        >
          <option>In Stock</option>
          <option>Out of Stock</option>
        </select>

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />

        <button>Add Product</button>
      </form>

      {/* ---------- PRODUCTS ---------- */}
      <div className="grid">
        {products.length === 0 && <p>No products added yet</p>}

        {products.map((p) => (
          <div key={p._id} className="product-card">

            <img src={p.image || "https://via.placeholder.com/150"} />

            <h3>{p.name}</h3>

            <p>
              ₹ {p.originalPrice} → <b>₹ {p.finalPrice}</b>
            </p>

            <p style={{ color: p.stock === "In Stock" ? "green" : "red" }}>
              {p.stock}
            </p>

            <button onClick={() => deleteProduct(p._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
