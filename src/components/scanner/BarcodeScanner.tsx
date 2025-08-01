import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CameraOff, Zap, X, HandMetal, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  title?: string;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ 
  onScan, 
  onClose,
  title = "Scan Barcode" 
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  useEffect(() => {
    // Check if camera permissions are already granted
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setPermissionState('granted');
        initializeScanner();
      })
      .catch((error) => {
        if (error.name === 'NotAllowedError') {
          setPermissionState('denied');
        }
        setHasCamera(false);
      });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionState('granted');
      initializeScanner();
    } catch (error) {
      console.error('Camera permission error:', error);
      setPermissionState('denied');
      toast.error('Camera access denied. Please enable it in your browser settings.');
    }
  };

  const initializeScanner = async () => {
    try {
      // Check if camera is available
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setHasCamera(true);
        
        // Initialize scanner
        const scannerId = 'barcode-scanner';
        const scanner = new Html5Qrcode(scannerId);
        scannerRef.current = scanner;
        
        // Start scanning
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250
            },
            aspectRatio: 1.0
          },
          (decodedText) => {
            // On successful scan
            const successSound = new Audio('/success-sound.mp3');
            successSound.play().catch(() => {
              // Silent fail if audio can't play
            });
            
            // Vibrate if available
            if (navigator.vibrate) {
              navigator.vibrate(100);
            }
            
            // Pass the barcode to parent
            onScan(decodedText);
            
            // Show toast
            toast.success('Scan successful');
          },
          (errorMessage) => {
            // Silent error handling during scanning
            console.debug(errorMessage);
          }
        );
      } else {
        setHasCamera(false);
      }
    } catch (error) {
      console.error('Error initializing scanner:', error);
      setHasCamera(false);
    }
  };

  const toggleTorch = async () => {
    if (!scannerRef.current) return;
    
    try {
      if (torchOn) {
        await scannerRef.current.disableTorch();
      } else {
        await scannerRef.current.enableTorch();
      }
      setTorchOn(!torchOn);
    } catch (error) {
      toast.error('Torch not supported on this device');
    }
  };

  const handleManualEntry = () => {
    const barcode = prompt('Enter barcode manually:');
    if (barcode) {
      onScan(barcode);
    }
  };

  const renderContent = () => {
    if (permissionState === 'prompt') {
      return (
        <div className="p-8 text-center">
          <Camera size={48} className="mx-auto mb-4 text-primary-500" />
          <h3 className="text-lg font-medium mb-2">Camera Access Required</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Please allow camera access to scan barcodes
          </p>
          <button
            onClick={requestCameraPermission}
            className="btn btn-primary w-full"
          >
            Enable Camera
          </button>
        </div>
      );
    }

    if (permissionState === 'denied' || !hasCamera) {
      return (
        <div className="p-8 text-center">
          <CameraOff size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Camera Not Available</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {permissionState === 'denied' 
              ? 'Camera access was denied. Please enable it in your browser settings.'
              : 'No camera detected on your device.'}
          </p>
          <button
            onClick={handleManualEntry}
            className="btn btn-primary w-full"
          >
            Enter Barcode Manually
          </button>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="scanner-container aspect-video bg-black">
          <div id="barcode-scanner" className="w-full h-full"></div>
          
          <div className="scan-area">
            <div className="corner corner-top-left"></div>
            <div className="corner corner-top-right"></div>
            <div className="corner corner-bottom-left"></div>
            <div className="corner corner-bottom-right"></div>
            <div className="scan-line"></div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <button
            onClick={toggleTorch}
            className={`btn ${torchOn ? 'btn-accent' : 'btn-outline'}`}
          >
            <Zap size={18} />
            {torchOn ? 'Torch On' : 'Torch'}
          </button>
          
          <button
            onClick={handleManualEntry}
            className="btn btn-outline"
          >
            <HandMetal size={18} />
            Manual Entry
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-card w-full max-w-sm overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="p-4 bg-primary-500 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BarcodeScanner;