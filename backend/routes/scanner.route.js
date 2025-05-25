import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Mock aisle data (in a real app, this would come from a database)
const aisleData = {
    'A1': 'Main Entrance → Turn right → Aisle 1',
    'A2': 'Main Entrance → Turn right → Aisle 2',
    'B1': 'Main Entrance → Go straight → First left → Aisle 3',
    'B2': 'Main Entrance → Go straight → Second left → Aisle 4',
    'C1': 'Main Entrance → Turn left → First right → Aisle 5',
    'C2': 'Main Entrance → Turn left → Second right → Aisle 6'
};

// Store scanned items in memory (in a real app, this would be in a database)
let currentScanSession = {
    items: [],
    isScanning: false
};

// Start scanning
router.post('/start', protectRoute, (req, res) => {
    if (currentScanSession.isScanning) {
        return res.status(400).json({ message: 'Scanning is already in progress' });
    }
    currentScanSession.isScanning = true;
    currentScanSession.items = [];
    res.json({ message: 'Scanning started' });
});

// Stop scanning
router.post('/stop', protectRoute, (req, res) => {
    if (!currentScanSession.isScanning) {
        return res.status(400).json({ message: 'No scanning session in progress' });
    }
    currentScanSession.isScanning = false;
    res.json({ message: 'Scanning stopped' });
});

// Generate bill
router.get('/generate-bill', protectRoute, (req, res) => {
    const items = currentScanSession.items;
    const uniqueCode = Math.random().toString(36).substring(7);
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price, 0);
    
    // Format bill with aisle navigation
    const bill = `
    === SHOPPING BILL ===
    Date: ${new Date().toLocaleString()}
    
    Items:
    ${items.map(item => `
    ${item.name.padEnd(20)} $${item.price.toFixed(2)}
    📍 Location: ${item.aisle}
    🚶 Navigation: ${item.navigation}
    `).join('\n')}
    
    Total: $${total.toFixed(2)}
    ==================
    `;
    
    res.json({ bill, uniqueCode });
});

// Simulate item scan (in a real app, this would come from actual scanner hardware)
router.post('/scan-item', protectRoute, (req, res) => {
    if (!currentScanSession.isScanning) {
        return res.status(400).json({ message: 'No active scanning session' });
    }
    
    const { barcode } = req.body;
    // In a real app, you would look up the barcode in a database
    const aisleKeys = Object.keys(aisleData);
    const randomAisle = aisleKeys[Math.floor(Math.random() * aisleKeys.length)];
    
    const mockItem = {
        name: `Item ${currentScanSession.items.length + 1}`,
        price: Math.random() * 100,
        barcode,
        aisle: randomAisle,
        navigation: aisleData[randomAisle]
    };
    
    currentScanSession.items.push(mockItem);
    res.json({ message: 'Item scanned', item: mockItem });
});

export default router; 