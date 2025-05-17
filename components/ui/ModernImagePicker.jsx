'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useFormikContext, useField } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';

const ModernImagePicker = ({ label, hint }) => {
  const [field, meta] = useField('photo');
  const [pickImage, setPickImage] = useState();
  const [isDragging, setIsDragging] = useState(false);

  const { values, setFieldValue } = useFormikContext();
  const imageInput = useRef();

  const handleUploadImage = () => {
    imageInput.current.click();
  };

  const handleImageChange = e => {
    const file = e.target.files[0];

    if (!file) {
      setPickImage(null);
      return;
    }

    setFieldValue('photo', file);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    setFieldValue('photo', file);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPickImage(null);
    setFieldValue('photo', null);
  };

  return (
    <div className='mb-3'>
      <label className='block text-sm font-medium text-gray-700 mb-1'>{label || 'Hình ảnh'}</label>

      <div
        className={`relative border border-dashed rounded p-3 transition-all duration-200 ${isDragging ? 'border-indigo-500 bg-indigo-50' : pickImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-gray-100'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type='file' accept='image/png, image/jpeg, image/webp' className='hidden' ref={imageInput} onChange={handleImageChange} />

        <AnimatePresence mode='wait'>
          {!pickImage ? (
            <motion.div key='upload' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex flex-col items-center justify-center text-center py-2'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-10 w-10 text-gray-400 mb-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              <p className='text-sm text-gray-600 mb-2'>Kéo và thả hình ảnh vào đây hoặc</p>
              <button
                type='button'
                onClick={handleUploadImage}
                className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 transition-colors'
              >
                Chọn hình ảnh
              </button>
              <p className='text-xs text-gray-500 mt-1'>PNG, JPG, WEBP (tối đa 5MB)</p>
            </motion.div>
          ) : (
            <motion.div key='preview' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='relative'>
              <div className='relative w-full h-48 rounded overflow-hidden'>
                <Image src={pickImage} alt='Preview' fill className='object-contain' />
              </div>
              <button type='button' onClick={removeImage} className='absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 transition-colors'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                  <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {meta.touched && meta.error ? <div className='mt-0.5 text-xs text-red-500 animate-fadeIn'>{meta.error}</div> : hint ? <div className='mt-0.5 text-xs text-gray-500'>{hint}</div> : null}
    </div>
  );
};

export default ModernImagePicker;
