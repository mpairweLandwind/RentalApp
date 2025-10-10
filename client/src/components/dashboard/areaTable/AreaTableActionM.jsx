import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "../../ui/button";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Copy,
  ExternalLink,
  AlertCircle,
  Loader2,
  Wrench,
  FileText
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

const AreaTableActionM = ({ maintenanceId, onUpdate }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
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

  const handleView = () => {
    setShowDropdown(false);
    navigate(`/maintenance/${maintenanceId}`);
  };

  const handleEdit = () => {
    setShowDropdown(false);
    navigate(`/update-maintenance/${maintenanceId}`);
  };

  const handleDuplicate = async () => {
    setShowDropdown(false);
    setIsDuplicating(true);

    try {
      const response = await axios.get(`http://localhost:3000/api/maintenance/get/${maintenanceId}`);
      const originalMaintenance = response.data;

      // Create a copy with modified name
      const duplicatedMaintenance = {
        ...originalMaintenance,
        name: `${originalMaintenance.name} (Copy)`,
        id: undefined, // Remove ID to create new maintenance record
      };

      await axios.post('http://localhost:3000/api/maintenance/create', duplicatedMaintenance, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success("Maintenance record duplicated successfully!");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to duplicate maintenance record:", error);
      toast.error("Failed to duplicate maintenance record. Please try again.");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleOpenExternal = () => {
    setShowDropdown(false);
    window.open(`/maintenance/${maintenanceId}`, '_blank');
  };

  const handleDeleteClick = () => {
    setShowDropdown(false);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      await axios.delete(`http://localhost:3000/api/maintenance/delete/${maintenanceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success("Maintenance record deleted successfully!");
      setShowDeleteDialog(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to delete maintenance record:", error);
      toast.error("Failed to delete maintenance record. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewReport = () => {
    setShowDropdown(false);
    // Navigate to maintenance report page
    navigate(`/maintenance/${maintenanceId}/report`);
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
                onClick={handleView}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group"
              >
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">View Details</span>
              </button>

              {/* View Report */}
              <button
                onClick={handleViewReport}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group"
              >
                <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">View Report</span>
              </button>

              {/* Edit */}
              <button
                onClick={handleEdit}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group"
              >
                <Edit className="h-4 w-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Edit Record</span>
              </button>

              {/* Duplicate */}
              <button
                onClick={handleDuplicate}
                disabled={isDuplicating}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDuplicating ? (
                  <>
                    <Loader2 className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-spin" />
                    <span className="font-medium">Duplicating...</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Duplicate</span>
                  </>
                )}
              </button>

              {/* Open in New Tab */}
              <button
                onClick={handleOpenExternal}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left group"
              >
                <ExternalLink className="h-4 w-4 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Open in New Tab</span>
              </button>

              {/* Divider */}
              <hr className="my-2 border-gray-200 dark:border-gray-700" />

              {/* Delete */}
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left group"
              >
                <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Delete Record</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="text-xl">Delete Maintenance Record?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete this maintenance record? This action cannot be undone. 
              All associated data including maintenance history will be permanently removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="mt-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Record
                </span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

AreaTableActionM.propTypes = {
  maintenanceId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
};

export default AreaTableActionM;