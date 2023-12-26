'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import camera from '@/public/images/camera.png';
import { useFormikContext, useField } from 'formik';

const ImagePicker = () => {
  const [field, meta] = useField('photo');
  const [pickImage, setPickImage] = useState();

  const { values, setFieldValue } = useFormikContext();
  const imageInput = useRef();

  const handleUploadImage = e => {
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

  return (
    <div>
      <div className='flex space-x-5 mb-3'>
        <div className='w-40 h-40 rounded-sm relative'>
          {!pickImage && <Image src={camera} alt='upload hinh' />}
          {pickImage && (
            <Image src={pickImage} alt='The image selected by the user' fill />
          )}
        </div>
        <input
          type='file'
          accept='image/png, image/jpeg'
          className='hidden'
          ref={imageInput}
          onChange={handleImageChange}
        />
        <button
          type='button'
          onClick={handleUploadImage}
          className='bg-gray-300 w-fit h-fit  rounded-sm py-2 px-6'
        >
          Chọn ảnh
        </button>
      </div>
    </div>
  );
};

export default ImagePicker;
