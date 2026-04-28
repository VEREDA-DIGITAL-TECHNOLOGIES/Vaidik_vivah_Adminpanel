import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import { FiUpload, FiTrash2, FiX, FiImage, FiPlus } from 'react-icons/fi';

const AdminBannerSection = () => {
  const [banners, setBanners] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get('admin/banner/getBanner');
      setBanners(response.data.photos || []);
    } catch (err) {
      toast.error('Failed to fetch banner images');
    }
  };

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
      setDragActive(false);
    }
  }, []);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('bannerImages', file);
    });

    setIsUploading(true);
    try {
      const res = await axiosInstance.post('admin/banner/uploadBanner', formData);
      setBanners(res.data.photos || []);
      setSelectedFiles([]);
      toast.success('Images uploaded successfully!');
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (url) => {
    try {
      await axiosInstance.delete('admin/banner/deleteBanner', {
        data: { imageUrl: url },
      });
      toast.success('Image deleted');
      setBanners((prev) => prev.filter((img) => img !== url));
      if (previewUrl === url) setPreviewUrl(null);
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('This will permanently delete all banners. Are you sure?')) return;
    setIsDeletingAll(true);
    try {
      const res = await axiosInstance.delete('admin/banner/deleteAllBanners');
      setBanners([]);
      setPreviewUrl(null);
      toast.success(res.data.message || 'All banners deleted');
    } catch {
      toast.error('Failed to delete all banners');
    } finally {
      setIsDeletingAll(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-[#f8e1e7] via-[#fff9fb] to-[#f8e1e7] flex items-center justify-center py-12 px-4"
      onDrop={handleFileDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
    >
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#FFB3C5',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(255, 179, 197, 0.3)'
          }
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-5xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
            Banner Management
          </h2>
          {banners.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleDeleteAll}
              disabled={banners.length === 0 || isDeletingAll}
              className={`px-5 py-2 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 ${
                isDeletingAll || banners.length === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'
              }`}
            >
              <FiTrash2 size={18} />
              {isDeletingAll ? 'Deleting...' : 'Delete All'}
            </motion.button>
          )}
        </div>

        {/* Upload Section */}
        <div className="space-y-6">
          {/* Drag & Drop */}
          <motion.div
            className={`relative border-3 ${
              dragActive ? 'border-pink-500 bg-pink-50/60' : 'border-dashed border-pink-300'
            } rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group`}
            whileHover={{ scale: 1.005 }}
            layout
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-4 bg-pink-100 rounded-full group-hover:bg-pink-200 transition-colors">
                <FiUpload className="text-pink-500 text-2xl" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {dragActive ? 'Drop your files here' : 'Drag & drop images here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse files (JPEG, PNG, WEBP)
                </p>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </motion.div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-pink-50 rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-pink-700 flex items-center gap-2">
                  <FiImage /> {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
                </h3>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-pink-500 hover:text-pink-700 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden border border-pink-200">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Preview ${idx + 1}`} 
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                disabled={isUploading}
                onClick={handleUpload}
                className={`mt-4 w-full py-3 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 ${
                  isUploading
                    ? 'bg-pink-300 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
                }`}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload size={18} />
                    Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Banner Gallery */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiImage className="text-pink-500" />
            Current Banners ({banners.length})
          </h3>
          
          {banners.length === 0 ? (
            <div className="bg-pink-50 rounded-2xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-pink-100 rounded-full inline-block mb-4">
                  <FiPlus className="text-pink-500 text-2xl" />
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">No banners uploaded yet</h4>
                <p className="text-gray-500">
                  Upload some images to display as banners on your homepage.
                  Drag and drop files above or click to select.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {banners.map((url, idx) => (
                  <motion.div
                    key={url}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img 
                      src={url} 
                      alt={`Banner ${idx + 1}`} 
                      className="w-full h-40 object-cover cursor-pointer"
                      onClick={() => setPreviewUrl(url)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(url);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-all transform translate-y-2 group-hover:translate-y-0"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewUrl(null)}
                className="absolute -top-12 right-0 text-white hover:text-pink-300 transition-colors"
              >
                <FiX size={28} />
              </button>
              <img 
                src={previewUrl} 
                alt="Banner Preview" 
                className="w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBannerSection;