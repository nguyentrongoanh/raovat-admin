import { FC } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';

interface PreviewImagesModalProps {
  image: string;
  onClose: any;
}

const PreviewImagesModal: FC<PreviewImagesModalProps> = ({
  image,
  onClose,
}) => {
  const handleCloseModal = (e: any) => {
    onClose();
  };

  return (
    <>
      {ReactDOM.createPortal(
        <div
          className='bg-gray-700 bg-opacity-70 flex justify-center items-center fixed inset-0 z-10'
          onClick={handleCloseModal}
        >
          <div
            className='w-8 h-8 absolute flex items-center justify-center right-4 top-4  z-40 bg-white opacity-90 rounded-full hover:cursor-pointer'
            onClick={handleCloseModal}
          >
            <span className='text-base hover:cursor-pointer'>X</span>
          </div>
          <Image src={image} alt='image' fill />
        </div>,

        document.getElementById('previewImageModal')!
      )}
    </>
  );
};

export default PreviewImagesModal;
