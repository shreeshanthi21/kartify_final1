import React from 'react';

const styles = {
  storeMap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '5px',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    fontSize: '14px',
  },
  aisleCell: (isActive) => ({
    padding: '8px',
    borderRadius: '4px',
    background: isActive ? '#000000' : 'rgba(0, 0, 0, 0.7)',
    border: isActive ? '2px solid #FFF' : '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    color: 'white',
  }),
  entrance: {
    gridColumn: '1 / -1',
    padding: '8px',
    background: '#000000',
    borderRadius: '4px',
    marginBottom: '10px',
    textAlign: 'center',
    color: 'white',
  },
  mapContainer: {
    background: 'rgba(0, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '8px',
  }
};

const StoreMap = ({ activeAisle, size = 'normal' }) => {
  const containerStyle = {
    ...styles.mapContainer,
    fontSize: size === 'small' ? '12px' : '14px',
    padding: size === 'small' ? '5px' : '10px',
  };

  const mapStyle = {
    ...styles.storeMap,
    gap: size === 'small' ? '2px' : '5px',
  };

  return (
    <div style={containerStyle}>
      <div style={styles.entrance}>📍 Main Entrance</div>
      <div style={mapStyle}>
        <div style={styles.aisleCell(activeAisle === 'A1')}>A1</div>
        <div style={styles.aisleCell(activeAisle === 'A2')}>A2</div>
        <div style={styles.aisleCell(false)}>Storage</div>
        <div style={styles.aisleCell(activeAisle === 'B1')}>B1</div>
        <div style={styles.aisleCell(activeAisle === 'B2')}>B2</div>
        <div style={styles.aisleCell(false)}>Service</div>
        <div style={styles.aisleCell(activeAisle === 'C1')}>C1</div>
        <div style={styles.aisleCell(activeAisle === 'C2')}>C2</div>
        <div style={styles.aisleCell(false)}>Checkout</div>
      </div>
    </div>
  );
};

export default StoreMap; 