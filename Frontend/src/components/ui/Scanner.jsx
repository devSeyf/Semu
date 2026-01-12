import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import productsData from '../../data/products.json';

const Scanner = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productStatus, setProductStatus] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setProductStatus(null);
    }
  };

  const handleScan = () => {
    if (!image) return;
    setIsLoading(true);

    Tesseract.recognize(
      image,
      'eng'
    ).then(({ data: { text } }) => {
      checkProduct(text);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  };

  const checkProduct = (text) => {
    const lowerText = text.toLowerCase();
    const foundProduct = productsData.find(product => 
      lowerText.includes(product.name.toLowerCase())
    );

    if (foundProduct) {
      setProductStatus(foundProduct);
    } else {
      setProductStatus({ status: "safe" });
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Ürün Tarayıcı</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '20px' }} />

      {image && (
        <div style={{ marginBottom: '20px' }}>
          <img src={image} alt="Preview" style={{ width: '100%', borderRadius: '10px', maxHeight: '300px' }} />
          <button 
            onClick={handleScan} 
            disabled={isLoading}
            style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}
          >
            {isLoading ? 'Taranıyor...' : 'Analiz Et'}
          </button>
        </div>
      )}

      {productStatus && (
        <div style={{ 
          marginTop: '20px', padding: '15px', borderRadius: '8px',
          backgroundColor: productStatus.status === 'boycott' ? '#ffebee' : '#e8f5e9'
        }}>
          {productStatus.status === 'boycott' ? (
            <>
              <h3 style={{ color: '#d32f2f' }}>⚠️ Bu Ürün Boykot Listesinde!</h3>
              <p><strong>Marka:</strong> {productStatus.name}</p>
              <h4> Alternatif: {productStatus.alternative}</h4>
            </>
          ) : (
            <h3 style={{ color: '#2e7d32' }}> Güvenli Ürün</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Scanner;
