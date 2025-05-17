'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/services/supabase';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';

import ModernTextInput from './ui/ModernTextInput';
import ModernTextAreaInput from './ui/ModernTextAreaInput';
import ModernSelectInput from './ui/ModernSelectInput';
import ModernCheckbox from './ui/ModernCheckbox';
import ModernImagePicker from './ui/ModernImagePicker';
import removeVietnameseTones from '@/lib/transform';

const validationSchema = Yup.object({
  category: Yup.string().required('Vui lòng chọn danh mục'),
  state: Yup.string().required('Vui lòng chọn tiểu bang'),
  city: Yup.array().required('Vui lòng chọn thành phố'),
  subcategory: Yup.array().required('Vui lòng chọn danh mục phụ'),
  title: Yup.string().max(200, 'Tiêu đề không dài hơn 200 kí tự').required('Tiêu đề không được để trống'),
  content: Yup.string().required('Nội dung không được để trống'),
  contact: Yup.string().max(200, 'Thông tin liên hệ không được dài hơn 200 kí tự').required('Thông tin liên hệ không được để trống'),
});

const ModernFormCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const formData = {
    category: '',
    subcategory: [],
    state: '',
    city: [],
    title: '',
    content: '',
    contact: '',
    vip: false,
    active: true,
    photo: null,
  };

  const handleSubmit = async values => {
    setIsSubmitting(true);
    try {
      const data = {
        danh_muc: removeVietnameseTones(values.category).toLowerCase(),
        danh_muc_phu: values.subcategory.toString(),
        tieu_bang: values.state,
        dia_chi: values.state,
        thanh_pho: values.city.toString(),
        tieu_de: values.title,
        noi_dung: values.content,
        lien_he: values.contact,
        search_text: removeVietnameseTones(values.title + ' ' + values.content + ' ' + values.contact + ' ' + values.state + ' ' + values.city).toLowerCase(),
        is_vip: values.vip,
        active: values.active,
      };

      // Insert tin_dang
      const { data: dataTin, error: errorTin } = await supabase
        .from('tin_dang')
        .insert({ ...data })
        .select();

      if (errorTin) {
        throw new Error(errorTin.message);
      }

      const id = dataTin[0].id;

      // Upload image if provided
      if (values.photo) {
        const filename = `${id}/images-1`;
        const { error } = await supabase.storage.from('images').upload(filename, values.photo, {
          cacheControl: '3600',
          upsert: true,
        });

        if (error) {
          console.error('Error uploading image:', error);
        }
      }

      setIsSuccess(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/tin-thuong');
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow border border-gray-100 overflow-hidden'>
      <div className='p-3 border-b border-gray-100'>
        <h2 className='text-xl font-bold text-gray-800'>Tạo tin mới</h2>
        <p className='text-gray-600 text-sm'>Điền thông tin để đăng tin của bạn</p>
      </div>

      <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isValid, dirty }) => (
          <Form className='p-3'>
            <div className='space-y-3'>
              <div className='bg-gray-50 p-3 rounded border border-gray-100'>
                <h3 className='text-base font-medium text-gray-800 mb-2'>Trạng thái</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  <ModernCheckbox label='Kích hoạt' name='active' description='Tin đăng sẽ hiển thị công khai' />
                  <ModernCheckbox label='VIP' name='vip' description='Tin đăng sẽ được ưu tiên hiển thị' />
                </div>
              </div>

              <div className='bg-gray-50 p-3 rounded border border-gray-100'>
                <h3 className='text-base font-medium text-gray-800 mb-2'>Phân loại</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <ModernSelectInput
                    label='Danh mục'
                    name='category'
                    placeholder='Chọn danh mục'
                    hint='Chọn danh mục phù hợp với tin đăng'
                    icon={
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
                      </svg>
                    }
                  />
                  <ModernSelectInput
                    label='Danh mục phụ'
                    name='subcategory'
                    placeholder='Chọn danh mục phụ'
                    hint='Chọn danh mục phụ để phân loại chi tiết hơn'
                    icon={
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path fillRule='evenodd' d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z' clipRule='evenodd' />
                      </svg>
                    }
                  />
                </div>
              </div>

              <div className='bg-gray-50 p-3 rounded border border-gray-100'>
                <h3 className='text-base font-medium text-gray-800 mb-2'>Vị trí</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <ModernSelectInput
                    label='Tiểu bang'
                    name='state'
                    placeholder='Chọn tiểu bang'
                    hint='Chọn tiểu bang nơi đăng tin'
                    icon={
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                      </svg>
                    }
                  />
                  <ModernSelectInput
                    label='Thành phố'
                    name='city'
                    placeholder='Chọn thành phố'
                    hint='Chọn thành phố nơi đăng tin'
                    icon={
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
                      </svg>
                    }
                  />
                </div>
              </div>

              <div className='bg-gray-50 p-3 rounded border border-gray-100'>
                <h3 className='text-base font-medium text-gray-800 mb-2'>Nội dung tin đăng</h3>
                <div className='space-y-3'>
                  <ModernTextInput
                    label='Tiêu đề'
                    name='title'
                    placeholder='Nhập tiêu đề tin đăng'
                    hint='Tiêu đề ngắn gọn, hấp dẫn (tối đa 200 ký tự)'
                    icon={
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                      </svg>
                    }
                  />

                  <ModernTextAreaInput
                    label='Nội dung'
                    name='content'
                    placeholder='Nhập nội dung chi tiết của tin đăng'
                    hint='Mô tả chi tiết, đầy đủ thông tin'
                    rows={5}
                    icon={
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path fillRule='evenodd' d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z' clipRule='evenodd' />
                      </svg>
                    }
                  />

                  <ModernTextAreaInput
                    label='Thông tin liên hệ'
                    name='contact'
                    placeholder='Nhập thông tin liên hệ (số điện thoại, email, địa chỉ...)'
                    hint='Thông tin để người xem có thể liên hệ với bạn'
                    rows={2}
                    icon={
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                      </svg>
                    }
                  />
                </div>
              </div>

              <div className='bg-gray-50 p-3 rounded border border-gray-100'>
                <h3 className='text-base font-medium text-gray-800 mb-2'>Hình ảnh</h3>
                <ModernImagePicker label='Hình ảnh minh họa' hint='Tải lên hình ảnh minh họa cho tin đăng (định dạng JPG, PNG, tối đa 5MB)' />
              </div>
            </div>

            <div className='mt-4 flex justify-end space-x-3'>
              <button type='button' onClick={() => router.back()} className='px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors'>
                Hủy bỏ
              </button>

              <button
                type='submit'
                disabled={isSubmitting || !(isValid && dirty)}
                className={`px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                  isValid && dirty && !isSubmitting ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm hover:shadow focus:ring-indigo-500' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className='flex items-center'>
                    <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Đang xử lý...
                  </div>
                ) : (
                  'Đăng tin'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Success notification */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className='fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-lg z-50'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg className='h-5 w-5 text-green-500' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-green-800'>Đăng tin thành công! Đang chuyển hướng...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernFormCreate;
