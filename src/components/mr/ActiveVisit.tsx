import { useState, useEffect } from 'react';
import { Clock, DollarSign, Wallet, Gift, CheckCircle, Plus, Trash2, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { saveVisit, generateId, type POBProduct } from '../../utils/dataStorage';
import { getAllUsers } from '../../utils/authStorage';

interface ActiveVisitProps {
  visit: {
    doctorName: string;
    specialty: string;
    startTime: Date;
  };
  onEndVisit: () => void;
  userName: string;
}

interface Product {
  id: string;
  name: string;
  rate: number;
}

interface AddedProduct {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  total: number;
}

// Mock product data - in production this would come from database
const initialProducts: Product[] = [
  { id: '1', name: 'Paracetamol 500mg (Strip of 10)', rate: 45 },
  { id: '2', name: 'Amoxicillin 250mg (Strip of 10)', rate: 120 },
  { id: '3', name: 'Azithromycin 500mg (Strip of 3)', rate: 85 },
  { id: '4', name: 'Metformin 500mg (Strip of 10)', rate: 25 },
  { id: '5', name: 'Atorvastatin 10mg (Strip of 10)', rate: 95 },
  { id: '6', name: 'Amlodipine 5mg (Strip of 10)', rate: 35 },
  { id: '7', name: 'Omeprazole 20mg (Strip of 10)', rate: 55 },
  { id: '8', name: 'Cetirizine 10mg (Strip of 10)', rate: 18 },
];

const initialStockists = [
  'Reliable Pharma Distributors',
  'MedSupply Solutions',
  'HealthCare Stockiest Pvt Ltd',
  'Premium Medical Distributors',
  'City Pharma Stockiest',
];

export default function ActiveVisit({ visit, onEndVisit, userName }: ActiveVisitProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [collectionAmount, setCollectionAmount] = useState('');
  const [giftName, setGiftName] = useState('');
  const [giftQuantity, setGiftQuantity] = useState('');
  
  // Product-wise POB states
  const [selectedStockist, setSelectedStockist] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [addedProducts, setAddedProducts] = useState<AddedProduct[]>([]);
  
  // Stockist management
  const [stockistList, setStockistList] = useState<string[]>(initialStockists);
  const [showAddStockistDialog, setShowAddStockistDialog] = useState(false);
  const [newStockistName, setNewStockistName] = useState('');
  
  // Product management
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductRate, setNewProductRate] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - visit.startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [visit.startTime]);

  // Auto-fill rate when product is selected
  useEffect(() => {
    if (selectedProduct) {
      const product = productList.find((p) => p.id === selectedProduct);
      if (product) {
        setRate(product.rate.toString());
      }
    }
  }, [selectedProduct, productList]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddProduct = () => {
    if (!selectedStockist) {
      toast.error('Please select a stockist first');
      return;
    }
    if (!selectedProduct || !quantity || !rate) {
      toast.error('Please fill product, quantity and rate');
      return;
    }

    const product = productList.find((p) => p.id === selectedProduct);
    if (!product) return;

    const newProduct: AddedProduct = {
      id: Date.now().toString(),
      productId: selectedProduct,
      productName: product.name,
      quantity: Number(quantity),
      rate: Number(rate),
      total: Number(quantity) * Number(rate),
    };

    setAddedProducts([...addedProducts, newProduct]);
    setSelectedProduct('');
    setQuantity('');
    setRate('');
    toast.success('Product added to POB');
  };

  const handleRemoveProduct = (id: string) => {
    setAddedProducts(addedProducts.filter((p) => p.id !== id));
    toast.success('Product removed');
  };

  const totalPOB = addedProducts.reduce((sum, product) => sum + product.total, 0);

  const handleStockistChange = (value: string) => {
    if (value === '__ADD_NEW__') {
      setShowAddStockistDialog(true);
    } else {
      setSelectedStockist(value);
    }
  };

  const handleAddNewStockist = () => {
    if (!newStockistName.trim()) {
      toast.error('Please enter stockist name');
      return;
    }
    
    // Check if stockist already exists
    if (stockistList.some(s => s.toLowerCase() === newStockistName.trim().toLowerCase())) {
      toast.error('Stockist already exists');
      return;
    }
    
    // Add new stockist to list
    const updatedList = [...stockistList, newStockistName.trim()];
    setStockistList(updatedList);
    setSelectedStockist(newStockistName.trim());
    
    // Close dialog and reset
    setShowAddStockistDialog(false);
    setNewStockistName('');
    
    toast.success('New stockist added successfully');
  };

  const handleProductChange = (value: string) => {
    if (value === '__ADD_NEW__') {
      setShowAddProductDialog(true);
    } else {
      setSelectedProduct(value);
    }
  };

  const handleAddNewProduct = () => {
    if (!newProductName.trim()) {
      toast.error('Please enter product name');
      return;
    }
    
    if (!newProductRate.trim() || Number(newProductRate) <= 0) {
      toast.error('Please enter valid product rate');
      return;
    }
    
    // Check if product already exists
    if (productList.some(p => p.name.toLowerCase() === newProductName.trim().toLowerCase())) {
      toast.error('Product already exists');
      return;
    }
    
    // Generate new ID
    const newId = (Math.max(...productList.map(p => Number(p.id))) + 1).toString();
    
    // Add new product to list
    const newProduct: Product = {
      id: newId,
      name: newProductName.trim(),
      rate: Number(newProductRate),
    };
    
    const updatedList = [...productList, newProduct];
    setProductList(updatedList);
    setSelectedProduct(newId);
    
    // Close dialog and reset
    setShowAddProductDialog(false);
    setNewProductName('');
    setNewProductRate('');
    
    toast.success('New product added successfully');
  };

  const handleCheckOut = () => {
    // Get current user details
    const users = getAllUsers();
    const currentUser = users.find(u => u.name === userName);
    
    if (!currentUser) {
      toast.error('User not found');
      return;
    }

    // Calculate duration
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - visit.startTime.getTime()) / 1000);

    // Save visit data to localStorage
    const visitData = {
      id: generateId(),
      mrId: currentUser.id,
      mrName: currentUser.name,
      mrUsername: currentUser.username,
      doctorName: visit.doctorName,
      specialty: visit.specialty,
      startTime: visit.startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      
      // POB Details
      stockist: selectedStockist || undefined,
      pobProducts: addedProducts as POBProduct[],
      totalPOB: totalPOB,
      
      // Collection
      collectionAmount: collectionAmount ? Number(collectionAmount) : 0,
      
      // Gift
      giftName: giftName || undefined,
      giftQuantity: giftQuantity || undefined,
      
      // Metadata
      date: new Date().toISOString().split('T')[0],
      location: undefined,
    };

    saveVisit(visitData);
    
    // Build visit summary message based on what was entered
    let summaryParts = [];
    
    if (selectedStockist && addedProducts.length > 0) {
      summaryParts.push(`POB: ₹${totalPOB.toLocaleString()}`);
    }
    
    if (collectionAmount) {
      summaryParts.push(`Collection: ₹${collectionAmount}`);
    }
    
    if (giftName && giftQuantity) {
      summaryParts.push(`Gift: ${giftName} (${giftQuantity})`);
    }
    
    // Show appropriate success message
    const message = summaryParts.length > 0 
      ? `Visit completed & saved! ${summaryParts.join(' | ')}`
      : 'Visit completed & saved successfully!';
    
    toast.success(message);
    
    // Small delay to ensure toast is visible before closing
    setTimeout(() => {
      onEndVisit();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
            <Clock size={32} />
          </div>
        </div>
        <h1 className="text-white text-center mb-2">Active Visit</h1>
        <p className="text-center text-sm opacity-90">{visit.doctorName}</p>
        <p className="text-center text-sm opacity-75">{visit.specialty}</p>
        
        <div className="mt-6 text-center">
          <p className="text-sm opacity-90 mb-2">Visit Duration</p>
          <div className="text-4xl tracking-wider">{formatTime(elapsedTime)}</div>
        </div>
      </div>

      {/* Visit Details Form */}
      <div className="p-4 space-y-4">
        {/* Stockist Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Package size={20} className="text-[#2563EB]" />
            <h3 className="text-[#1F2937]">Select Stockist</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stockist">Stockist Name</Label>
            <Select value={selectedStockist} onValueChange={handleStockistChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose stockist" />
              </SelectTrigger>
              <SelectContent>
                {stockistList.map((stockist, index) => (
                  <SelectItem key={index} value={stockist}>
                    {stockist}
                  </SelectItem>
                ))}
                <SelectItem value="__ADD_NEW__" className="text-[#2563EB]">
                  <div className="flex items-center gap-2">
                    <Plus size={16} />
                    <span>Add New Stockist</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Entry Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={20} className="text-[#10B981]" />
            <h3 className="text-[#1F2937]">Add Products to POB</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Select Product</Label>
              <Select value={selectedProduct} onValueChange={handleProductChange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {productList.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="__ADD_NEW__" className="text-[#2563EB]">
                    <div className="flex items-center gap-2">
                      <Plus size={16} />
                      <span>Add New Product</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter qty"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rate">Rate (₹)</Label>
                <Input
                  id="rate"
                  type="number"
                  placeholder="Rate per unit"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            {selectedProduct && quantity && rate && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Product Total</p>
                <p className="text-[#1F2937]">₹{(Number(quantity) * Number(rate)).toLocaleString()}</p>
              </div>
            )}

            <Button
              type="button"
              onClick={handleAddProduct}
              className="w-full bg-[#10B981] hover:bg-green-600"
            >
              <Plus size={20} className="mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Added Products List */}
        {addedProducts.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-[#1F2937] mb-4">Added Products ({addedProducts.length})</h3>
            <div className="space-y-3">
              {addedProducts.map((product) => (
                <div key={product.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-[#1F2937] mb-1">{product.productName}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Qty: {product.quantity}</span>
                      <span>Rate: ₹{product.rate}</span>
                      <span className="text-[#10B981]">Total: ₹{product.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveProduct(product.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <span>Total POB Amount:</span>
                <span className="text-xl">₹{totalPOB.toLocaleString()}</span>
              </div>
              <p className="text-xs opacity-75 mt-1">Stockist: {selectedStockist}</p>
            </div>
          </div>
        )}

        {/* Collection Amount */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-[#1F2937] mb-4">Collection Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="collection">Collection Amount (₹)</Label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="collection"
                type="number"
                placeholder="Enter collection amount"
                value={collectionAmount}
                onChange={(e) => setCollectionAmount(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>
          
          <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <Gift size={20} className="text-[#8B5CF6]" />
              <h4 className="text-[#1F2937]">Gift Details (Optional)</h4>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="giftName">Gift Product Name</Label>
              <Input
                id="giftName"
                type="text"
                placeholder="Enter gift product name (e.g., Sample Pack)"
                value={giftName}
                onChange={(e) => setGiftName(e.target.value)}
                className="h-12 bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="giftQty">Gift Quantity</Label>
              <Input
                id="giftQty"
                type="number"
                placeholder="Enter quantity"
                value={giftQuantity}
                onChange={(e) => setGiftQuantity(e.target.value)}
                className="h-12 bg-white"
              />
            </div>
            
            {giftName && giftQuantity && (
              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-xs text-gray-500 mb-1">Gift Summary</p>
                <p className="text-sm text-[#1F2937]">{giftName} - Qty: {giftQuantity}</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Card */}
        {addedProducts.length > 0 && collectionAmount && (
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 shadow-sm">
            <h3 className="text-[#1F2937] mb-4">Visit Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Stockist:</span>
                <span className="text-[#1F2937]">{selectedStockist}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Products:</span>
                <span className="text-[#1F2937]">{addedProducts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">POB Amount:</span>
                <span className="text-[#1F2937]">₹{totalPOB.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Collection:</span>
                <span className="text-[#1F2937]">₹{collectionAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Outstanding:</span>
                <span className="text-[#1F2937]">₹{(totalPOB - Number(collectionAmount)).toLocaleString()}</span>
              </div>
              {giftName && giftQuantity && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Gift:</span>
                  <span className="text-[#1F2937]">{giftName} (Qty: {giftQuantity})</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Check-Out Button */}
        <Button
          type="button"
          onClick={handleCheckOut}
          className="w-full h-14 bg-[#10B981] hover:bg-green-600"
        >
          <CheckCircle size={20} className="mr-2" />
          Complete Visit & Check-Out
        </Button>
      </div>

      {/* Add New Stockist Dialog */}
      <Dialog open={showAddStockistDialog} onOpenChange={setShowAddStockistDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Stockist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newStockist">Stockist Name</Label>
              <Input
                id="newStockist"
                placeholder="Enter stockist name"
                value={newStockistName}
                onChange={(e) => setNewStockistName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNewStockist();
                  }
                }}
                className="h-12"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddStockistDialog(false);
                setNewStockistName('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddNewStockist}
              className="bg-[#2563EB] hover:bg-blue-600"
            >
              <Plus size={16} className="mr-2" />
              Add Stockist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Product Dialog */}
      <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newProductName">Product Name</Label>
              <Input
                id="newProductName"
                placeholder="e.g., Aspirin 100mg (Strip of 10)"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="h-12"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newProductRate">Rate (₹)</Label>
              <Input
                id="newProductRate"
                type="number"
                placeholder="Enter product rate"
                value={newProductRate}
                onChange={(e) => setNewProductRate(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNewProduct();
                  }
                }}
                className="h-12"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddProductDialog(false);
                setNewProductName('');
                setNewProductRate('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddNewProduct}
              className="bg-[#2563EB] hover:bg-blue-600"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
