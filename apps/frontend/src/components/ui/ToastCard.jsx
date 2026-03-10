// OrderStatusModal.jsx
import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

export default function OrderStatusModal ({ 
  isOpen, 
  onClose,
  type = 'success', // 'success', 'error', 'warning'
  title,
  message,
  highlightText,
  deliveryTime = '4 days',
  showDeliveryTime = true,
  buttonText = 'OK',
  onButtonClick
}) {
  if (!isOpen) return null;

  // Default messages based on type
  const getDefaultTitle = () => {
    switch(type) {
      case 'success':
        return 'Order Received';
      case 'error':
        return 'Order Failed';
      case 'warning':
        return 'Payment Pending';
      default:
        return 'Order Received';
    }
  };

  const getDefaultMessage = () => {
    switch(type) {
      case 'success':
        return "You can always track your orders in the";
      case 'error':
        return "We couldn't process your order.";
      case 'warning':
        return "Your payment is still pending.";
      default:
        return "You can always track your orders in the";
    }
  };

  const getDefaultHighlight = () => {
    switch(type) {
      case 'success':
        return '"Orders" section under profile.';
      case 'error':
        return 'Please check your payment method.';
      case 'warning':
        return 'Complete payment within 24 hours.';
      default:
        return '"Orders" section under profile.';
    }
  };

  // Icons for different types
  const getIcon = () => {
    switch(type) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1.5} />;
      case 'error':
        return <AlertCircle className="w-16 h-16 text-red-500" strokeWidth={1.5} />;
      case 'warning':
        return <AlertTriangle className="w-16 h-16 text-yellow-500" strokeWidth={1.5} />;
      default:
        return <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1.5} />;
    }
  };

  // Background colors for icons
  const getIconBgColor = () => {
    switch(type) {
      case 'success':
        return 'bg-green-50 ring-green-50/50';
      case 'error':
        return 'bg-red-50 ring-red-50/50';
      case 'warning':
        return 'bg-yellow-50 ring-yellow-50/50';
      default:
        return 'bg-green-50 ring-green-50/50';
    }
  };

  // Title colors
  const getTitleColor = () => {
    switch(type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  // Button colors
  const getButtonColor = () => {
    switch(type) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600 shadow-green-200';
      case 'error':
        return 'bg-red-500 hover:bg-red-600 shadow-red-200';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200';
      default:
        return 'bg-green-500 hover:bg-green-600 shadow-green-200';
    }
  };

  // Delivery time message based on type
  const getDeliveryMessage = () => {
    switch(type) {
      case 'success':
        return `Your order will be delivered in ${deliveryTime}.`;
      case 'error':
        return 'Please try again or contact support.';
      case 'warning':
        return 'Order will be processed after payment.';
      default:
        return `Your order will be delivered in ${deliveryTime}.`;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200 z-10">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`rounded-full p-3 ring-8 ${getIconBgColor()}`}>
            {getIcon()}
          </div>
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold mb-4 text-center ${getTitleColor()}`}>
          {title || getDefaultTitle()}
        </h2>
        
        {/* Message */}
        <div className="space-y-3 mb-8 text-center">
          <p className="text-gray-700">
            {message || getDefaultMessage()}
          </p>
          <p className="text-gray-700 font-medium">
            {highlightText || getDefaultHighlight()}
          </p>
          
          {/* Delivery Time Message */}
          {showDeliveryTime && (
            <p className="text-gray-700 mt-2">
              {getDeliveryMessage()}
            </p>
          )}
        </div>

        {/* OK Button */}
        <button
          onClick={onButtonClick || onClose}
          className={`w-full py-3.5 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg ${getButtonColor()}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}