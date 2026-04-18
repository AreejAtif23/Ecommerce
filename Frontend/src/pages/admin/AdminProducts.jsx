// src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import '../../styles/AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Shoes',
    images: [],
    variants: []
  });
  const [imageInput, setImageInput] = useState('');
  const [variantForm, setVariantForm] = useState({ size: '', color: '', stock: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ limit: 100 });
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images,
        variants: product.variants || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Shoes',
        images: [],
        variants: []
      });
    }
    setImageInput('');
    setVariantForm({ size: '', color: '', stock: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({ ...formData, images: [...formData.images, imageInput.trim()] });
      setImageInput('');
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const addVariant = () => {
    if (variantForm.size && variantForm.color && variantForm.stock) {
      setFormData({
        ...formData,
        variants: [...formData.variants, { ...variantForm, stock: parseInt(variantForm.stock) }]
      });
      setVariantForm({ size: '', color: '', stock: '' });
    }
  };

  const removeVariant = (index) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        await createProduct(productData);
      }
      loadProducts();
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

// Inside handleDelete function
const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this product?')) {
    try {
      await deleteProduct(id);
      alert('Product deleted successfully!');
      loadProducts();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Delete failed. Please check console.');
    }
  }
};



  if (loading) return <div>Loading products...</div>;

  return (
    <div className="admin-products">
      <div className="admin-header-actions">
        <h2>Products</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Add Product</button>
      </div>
      <div className="products-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td><img src={product.images[0]} alt={product.name} width="50" /></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>{product.variants.reduce((sum, v) => sum + v.stock, 0)}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleOpenModal(product)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} required></textarea>
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleFormChange}>
                  <option>Shoes</option><option>Clothes</option><option>Watches</option>
                  <option>Purse/Wallet</option><option>Cosmetics</option>
                </select>
              </div>
              <div className="form-group">
                <label>Images (URLs)</label>
                <div className="image-input-group">
                  <input type="text" value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="Image URL" />
                  <button type="button" onClick={addImage}>Add</button>
                </div>
                <div className="image-list">
                  {formData.images.map((img, idx) => (
                    <span key={idx} className="image-tag">{img.substring(0, 30)}... <button type="button" onClick={() => removeImage(idx)}>x</button></span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Variants (Size, Color, Stock)</label>
                <div className="variant-inputs">
                  <input type="text" placeholder="Size" value={variantForm.size} onChange={(e) => setVariantForm({...variantForm, size: e.target.value})} />
                  <input type="text" placeholder="Color" value={variantForm.color} onChange={(e) => setVariantForm({...variantForm, color: e.target.value})} />
                  <input type="number" placeholder="Stock" value={variantForm.stock} onChange={(e) => setVariantForm({...variantForm, stock: e.target.value})} />
                  <button type="button" onClick={addVariant}>Add</button>
                </div>
                <div className="variants-list">
                  {formData.variants.map((v, idx) => (
                    <div key={idx} className="variant-tag">{v.size} / {v.color} (Stock: {v.stock}) <button type="button" onClick={() => removeVariant(idx)}>x</button></div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;