'use client';
import { FC, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import toBase64 from '@/lib/toBase64';
import PreviewImagesModal from './previewImagesModal';

interface ImagesThumbnailProps {
  files: FileList;
}

const ImagesThumbnail: FC<ImagesThumbnailProps> = ({ files }) => {
  const [images, setImages] = useState<any[]>([]);
  const [image, setImage] = useState('');
  const [openViewImageModal, setOpenViewImageModal] = useState(false);

  useEffect(() => {
    const forLoop = async (files: FileList) => {
      const imagesToBase64: any[] = [];
      for (let i = 0; i < files.length; i++) {
        imagesToBase64.push(await toBase64(files[i]));
      }
      return imagesToBase64;
    };
    forLoop(files).then(result => setImages(result));
  }, [files]);

  const handleViewImageModal = (e: any) => {
    setImage(e.target.src);
    setOpenViewImageModal(!openViewImageModal);
  };

  const handleCloseModel = () => {
    setOpenViewImageModal(false);
  };

  return (
    <div className='flex flex-wrap mb-2 space-x-3 space-y-3'>
      {images.map((image, idx) => (
        <Image
          key={idx}
          src={image}
          alt='preview image'
          width={80}
          height={63}
          onClick={handleViewImageModal}
          className='hover:cursor-pointer'
        />
      ))}
      {openViewImageModal && (
        <PreviewImagesModal image={image} onClose={handleCloseModel} />
      )}
    </div>
  );
};

export default ImagesThumbnail;
