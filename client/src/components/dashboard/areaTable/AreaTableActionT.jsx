import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "../../ui/button";
import { 
  MoreHorizontal, 
  Eye, 
  Download,
  Copy,
  ExternalLink,
  AlertCircle,
  Loader2,
  Receipt,
  FileText,
  Mail,
  CreditCard,
  CheckCircle2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { toast } from "react-toastify";
import axios from "axios";

const AreaTableActionT = ({ transactionId, onUpdate }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReceipt, setIsSendingReceipt] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const fetchTransactionDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/paypal/transaction/${transactionId}`);
      setTransactionDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch transaction details:", error);
      toast.error("Failed to load transaction details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async () => {
    setShowDropdown(false);
    await fetchTransactionDetails();
    setShowDetailsDialog(true);
  };

  const handleViewProperty = () => {
    setShowDropdown(false);
    if (transactionDetails?.listing?.id) {
      navigate(`/property/${transactionDetails.listing.id}`);
    } else {
      toast.error("Property information not available");
    }
  };

  const handleCopyTransactionId = () => {
    setShowDropdown(false);
    navigator.clipboard.writeText(transactionId);
    toast.success("Transaction ID copied to clipboard!");
  };

  const handleDownloadReceipt = async () => {
    setShowDropdown(false);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/paypal/transaction/${transactionId}/receipt`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      console.error("Failed to download receipt:", error);
      toast.error("Failed to download receipt. Please try again.");
    }
  };

  const handleSendReceipt = async () => {
    setShowDropdown(false);
    setIsSendingReceipt(true);
    
    try {
      await axios.post(`http://localhost:3000/api/paypal/transaction/${transactionId}/send-receipt`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success("Receipt sent to customer email successfully!");
    } catch (error) {
      console.error("Failed to send receipt:", error);
      toast.error("Failed to send receipt. Please try again.");
    } finally {
      setIsSendingReceipt(false);
    }
  };

  const handleOpenExternal = () => {
    setShowDropdown(false);
    window.open(`/transaction/${transactionId}`, '_blank');
  };

  const handleViewInvoice = () => {
    setShowDropdown(false);
    navigate(`/transaction/${transactionId}/invoice`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDropdown}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="More actions"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </Button>
        
        {showDropdown && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="py-2">
              {/* View Details */}
              <button
                onClick={handleViewDetails}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group"
              >
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">View Details</span>
              </button>

              {/* View Invoice */}
              <button
                onClick={handleViewInvoice}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group"
              >
                <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">View Invoice</span>
              </button>

              {/* Download Receipt */}
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group"
              >
                <Download className="h-4 w-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Download Receipt</span>
              </button>

              {/* Send Receipt */}
              <button
                onClick={handleSendReceipt}
                disabled={isSendingReceipt}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingReceipt ? (
                  <>
                    <Loader2 className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-spin" />
                    <span className="font-medium">Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Send Receipt</span>
                  </>
                )}
              </button>

              {/* Copy Transaction ID */}
              <button
                onClick={handleCopyTransactionId}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group"
              >
                <Copy className="h-4 w-4 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Copy Transaction ID</span>
              </button>

              {/* Open in New Tab */}
              <button
                onClick={handleOpenExternal}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group"
              >
                <ExternalLink className="h-4 w-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Open in New Tab</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Dialog */}
      <AlertDialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <AlertDialogTitle className="text-xl">Transaction Details</AlertDialogTitle>
            </div>
          </AlertDialogHeader>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Loading transaction details...</p>
            </div>
          ) : transactionDetails ? (
            <div className="space-y-6">
              {/* Transaction Status */}
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">Payment Successful</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {formatDate(transactionDetails.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(transactionDetails.amount)}
                  </p>
                </div>
              </div>

              {/* Transaction Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                    {transactionDetails.id}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transactionDetails.paymentMethod || 'PayPal'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              {transactionDetails.listing && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Property Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Property Name:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {transactionDetails.listing.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {transactionDetails.listing.city}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Regular Price:</span>
                      <span className="font-medium text-gray-900 dark:text-white line-through">
                        {formatCurrency(transactionDetails.listing.regularPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Owner Email:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {transactionDetails.listing.userEmail}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {transactionDetails.userId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Savings Calculation */}
              {transactionDetails.listing && transactionDetails.listing.regularPrice > transactionDetails.amount && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-orange-900 dark:text-orange-100">
                        Total Savings
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        {(((transactionDetails.listing.regularPrice - transactionDetails.amount) / transactionDetails.listing.regularPrice) * 100).toFixed(1)}% discount applied
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(transactionDetails.listing.regularPrice - transactionDetails.amount)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Failed to load transaction details</p>
            </div>
          )}

          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel>Close</AlertDialogCancel>
            {transactionDetails?.listing && (
              <AlertDialogAction onClick={handleViewProperty}>
                View Property
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

AreaTableActionT.propTypes = {
  transactionId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
};

export default AreaTableActionT;