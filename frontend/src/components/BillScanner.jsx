import React, { useState, useRef, useCallback } from 'react';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';
import Webcam from 'react-webcam';

const styles = {
  cart: {
    background: 'linear-gradient(to right, #4CAF50, #2E7D32)',
    color: 'white',
    padding: '40px 20px',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '1000px',
    margin: '40px auto',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: '2rem',
    marginBottom: '30px',
  },
  buttonContainer: {
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  button: (enabled) => ({
    backgroundColor: enabled ? '#2E7D32' : '#A5D6A7',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: enabled ? 'pointer' : 'not-allowed',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    minWidth: '150px',
  }),
  bill: {
    marginTop: '30px',
    background: 'rgba(255, 255, 255, 0.15)',
    padding: '20px',
    borderRadius: '8px',
    color: 'white',
    textAlign: 'left',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
  },
  billTitle: {
    marginBottom: '10px',
    fontSize: '1.5rem',
  },
  status: {
    marginTop: '20px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  webcamContainer: {
    marginTop: '20px',
    width: '100%',
    maxWidth: '640px',
    margin: '0 auto',
    position: 'relative',
  },
  webcam: {
    width: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  lastScanned: {
    marginTop: '20px',
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '20px auto',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
  },
  productInfo: {
    flex: '1',
    textAlign: 'left',
  },
  locationMap: {
    flex: '1',
    background: 'rgba(0, 0, 0, 0.1)',
    padding: '15px',
    borderRadius: '8px',
    minWidth: '300px',
  },
  navigationInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px',
    padding: '10px',
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '6px',
  },
  icon: {
    fontSize: '24px',
  },
  storeMap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '5px',
    marginTop: '10px',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
  },
  aisleCell: (isActive) => ({
    padding: '10px',
    borderRadius: '4px',
    background: isActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.1)',
    border: isActive ? '2px solid #FFF' : '1px solid rgba(255, 255, 255, 0.2)',
    fontSize: '14px',
  }),
  entrance: {
    gridColumn: '1 / -1',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  scannedItems: {
    marginTop: '20px',
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '20px auto',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  itemCard: {
    display: 'flex',
    gap: '15px',
    background: 'rgba(0, 0, 0, 0.1)',
    padding: '15px',
    borderRadius: '8px',
    alignItems: 'center',
  }
};

const StoreMap = ({ activeAisle }) => (
  <div>
    <div style={styles.entrance}>📍 Main Entrance</div>
    <div style={styles.storeMap}>
      <div style={styles.aisleCell(activeAisle === 'A1')}>Aisle A1</div>
      <div style={styles.aisleCell(activeAisle === 'A2')}>Aisle A2</div>
      <div style={styles.aisleCell(false)}>Storage</div>
      <div style={styles.aisleCell(activeAisle === 'B1')}>Aisle B1</div>
      <div style={styles.aisleCell(activeAisle === 'B2')}>Aisle B2</div>
      <div style={styles.aisleCell(false)}>Service</div>
      <div style={styles.aisleCell(activeAisle === 'C1')}>Aisle C1</div>
      <div style={styles.aisleCell(activeAisle === 'C2')}>Aisle C2</div>
      <div style={styles.aisleCell(false)}>Checkout</div>
    </div>
  </div>
);

const BillScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [bill, setBill] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  const [status, setStatus] = useState('');
  const [lastScannedItem, setLastScannedItem] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const webcamRef = useRef(null);

  const startScanning = async () => {
    try {
      setScanning(true);
      setScannedItems([]);
      const res = await axios.post('/scanner/start');
      setStatus('Scanning started... Please scan your items.');
      toast.success('Scanning started');
    } catch (err) {
      console.error('Error starting scanning:', err);
      setScanning(false);
      setStatus('Error starting scanner');
      toast.error('Failed to start scanning');
    }
  };

  const stopScanning = async () => {
    try {
      const res = await axios.post('/scanner/stop');
      setScanning(false);
      setStatus('Scanning stopped');
      toast.success('Scanning stopped');
    } catch (err) {
      console.error('Error stopping scanning:', err);
      setStatus('Error stopping scanner');
      toast.error('Failed to stop scanning');
    }
  };

  const generateBill = async () => {
    try {
      const res = await axios.get('/scanner/generate-bill');
      setBill(res.data.bill);
      setUniqueCode(res.data.uniqueCode);
      setStatus('Bill generated successfully');
      toast.success('Bill generated successfully');
    } catch (err) {
      console.error('Error generating bill:', err);
      setStatus('Error generating bill');
      toast.error('Failed to generate bill');
    }
  };

  const handleScan = useCallback(async () => {
    if (!scanning || !webcamRef.current) return;

    try {
      const screenshot = webcamRef.current.getScreenshot();
      const mockBarcode = Math.random().toString(36).substring(7);
      
      const response = await axios.post('/scanner/scan-item', { barcode: mockBarcode });
      const newItem = response.data.item;
      setLastScannedItem(newItem);
      setScannedItems(prev => [...prev, newItem]);
      toast.success('Item scanned successfully');
    } catch (err) {
      console.error('Error scanning item:', err);
      toast.error('Failed to scan item');
    }
  }, [scanning]);

  return (
    <div style={styles.cart}>
      <h1 style={styles.title}>🛒 Bill Scanning System</h1>
      
      {scanning && (
        <div style={styles.webcamContainer}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={styles.webcam}
            onClick={handleScan}
          />
          <p className="text-sm mt-2">Click on the camera view to scan an item</p>
        </div>
      )}

      {lastScannedItem && (
        <div style={styles.lastScanned}>
          <div style={styles.productInfo}>
            <h3>Last Scanned Item</h3>
            <p>{lastScannedItem.name} - ${lastScannedItem.price.toFixed(2)}</p>
            <div style={styles.navigationInfo}>
              <span style={styles.icon}>📍</span>
              <div>
                <strong>Location: </strong> {lastScannedItem.aisle}
              </div>
            </div>
            <div style={styles.navigationInfo}>
              <span style={styles.icon}>🚶</span>
              <div>
                <strong>Navigation: </strong> {lastScannedItem.navigation}
              </div>
            </div>
          </div>
          <div style={styles.locationMap}>
            <h3>Store Map</h3>
            <StoreMap activeAisle={lastScannedItem.aisle} />
          </div>
        </div>
      )}

      {scannedItems.length > 0 && (
        <div style={styles.scannedItems}>
          <h3>All Scanned Items</h3>
          <div style={styles.itemsList}>
            {scannedItems.map((item, index) => (
              <div key={index} style={styles.itemCard}>
                <div style={{ flex: 1 }}>
                  <p><strong>{item.name}</strong> - ${item.price.toFixed(2)}</p>
                  <small>📍 {item.aisle}</small>
                </div>
                <StoreMap activeAisle={item.aisle} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.buttonContainer}>
        <button
          onClick={startScanning}
          disabled={scanning}
          style={styles.button(!scanning)}
        >
          Start Scanning
        </button>
        <button
          onClick={stopScanning}
          disabled={!scanning}
          style={styles.button(scanning)}
        >
          Stop Scanning
        </button>
        <button
          onClick={generateBill}
          disabled={scanning}
          style={styles.button(!scanning)}
        >
          Generate Bill
        </button>
      </div>
      
      {status && (
        <div style={styles.status}>
          {status}
        </div>
      )}
      
      {bill && (
        <div style={styles.bill}>
          <h2 style={styles.billTitle}>Bill</h2>
          <pre>{bill}</pre>
          <p>Unique Code: {uniqueCode}</p>
        </div>
      )}
    </div>
  );
};

export default BillScanner;