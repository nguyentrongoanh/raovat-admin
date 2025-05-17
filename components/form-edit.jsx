'use client';

import { useEffect, useState } from 'react';
import supabase from '@/services/supabase';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import SelectInput from './ui/SelectInput';
import TextInput from './ui/TextInput';
import TextAreaInput from './ui/TextAreaInput';
import ImagePicker from './ui/ImagePicker';
import Checkbox from './ui/checkbox';
import { useSearchParams } from 'next/navigation';
import { getDetailById } from '@/app/api/apiGetDetailById';

const validationSchema = Yup.object({
  category: Yup.string().required('Vui lòng chọn danh mục'),
  state: Yup.string().required('Vui lòng chọn tiểu bang'),
  city: Yup.array().required('Vui lòng chọn thành phố'),
  subcategory: Yup.array().required('Vui lòng chọn danh mục phụ'),
  title: Yup.string().max(200, 'Tiêu đề không dài hơn 200 kí').required('Tiêu đề không được để trống'),
  content: Yup.string().required('Nội dung không được để trống'),
  contact: Yup.string().max(200, 'Thông tin liên hệ không được dài hơn 200 kí tự').required('Thông tin liên hệ không được để trống'),
});

const FormEdit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const queryString = useSearchParams();
  const id = queryString.get('id');

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const data = await getDetailById(id);
        console.log('Fetched data:', data);

        // Check if data exists and is an array with at least one item
        if (data && Array.isArray(data) && data.length > 0) {
          // Set the first item from the array as the detail
          setDetail(data[0]);
        } else {
          console.error('No data found or invalid data format');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Process city and subcategory fields to ensure they are arrays
  const processStringToArray = value => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(',').map(item => item.trim());
  };

  const formData = {
    category: detail?.danh_muc || '',
    subcategory: processStringToArray(detail?.danh_muc_phu),
    state: detail?.tieu_bang || '',
    city: processStringToArray(detail?.thanh_pho),
    title: detail?.tieu_de || '',
    content: detail?.noi_dung || '',
    contact: detail?.lien_he || '',
    vip: detail?.is_vip || false,
    active: detail?.active || true,
    photo: null,
  };

  const handleSubmit = async values => {
    try {
      setIsSubmitting(true);

      // Prepare data for update
      const data = {
        danh_muc: values.category,
        danh_muc_phu: Array.isArray(values.subcategory) ? values.subcategory.join(',') : values.subcategory,
        tieu_bang: values.state ? values.state.toLowerCase() : '',
        dia_chi: values.state,
        thanh_pho: Array.isArray(values.city) ? values.city.join(',').toLowerCase() : values.city ? values.city.toLowerCase() : '',
        tieu_de: values.title,
        noi_dung: values.content,
        lien_he: values.contact,
        search_text: `${values.title} ${values.content} ${values.contact} ${values.state} ${values.city}`,
        is_vip: values.vip,
        active: values.active,
      };

      // Update the existing record instead of inserting a new one
      const { data: dataTin, error: errorTin } = await supabase.from('tin_dang').update(data).eq('tin_id', id).select();

      if (errorTin) {
        console.error('Error updating record:', errorTin);
        alert('Có lỗi khi cập nhật tin đăng. Vui lòng thử lại.');
        return;
      }

      console.log('Updated data:', dataTin);

      // Only upload image if a new one is provided
      if (values.photo) {
        const recordId = dataTin && dataTin.length > 0 ? dataTin[0].id : id;
        const filename = `${recordId}/images-1`;

        const { data: images, error } = await supabase.storage.from('images').upload(filename, values.photo, {
          cacheControl: '3600',
          upsert: true,
        });

        if (error) {
          console.error('Error uploading image:', error);
        }
      }

      alert('Cập nhật tin đăng thành công!');
      window.history.back();
    } catch (error) {
      console.error('Submission error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='rounded-lg bg-white shadow-sm border border-gray-200'>
        <div className='p-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-6'>Chỉnh sửa tin đăng</h2>

          {isLoading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='flex items-center space-x-3'>
                <svg className='animate-spin h-6 w-6 text-indigo-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                <span className='text-gray-700'>Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : (
            <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
              <Form className='text-gray-700' encType='multipart/form-data'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center space-x-6'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox label='Active' name='active' />
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox label='VIP' name='vip' />
                      </div>
                    </div>

                    <SelectInput label='Danh mục' name='category' placeholder='Chọn danh mục' />

                    <SelectInput label='Tiểu bang' name='state' placeholder='Chọn tiểu bang' />
                  </div>

                  <div className='space-y-4'>
                    <div className='h-10'></div> {/* Spacer to align with checkboxes */}
                    <SelectInput label='Danh mục phụ' name='subcategory' placeholder='Chọn danh mục phụ' />
                    <SelectInput label='Thành phố' name='city' placeholder='Chọn thành phố' />
                  </div>
                </div>

                <div className='mb-4'>
                  <TextInput label='Tiêu đề' name='title' placeholder='Nhập tiêu đề' />
                </div>

                <div className='mb-4'>
                  <TextAreaInput label='Nội dung' name='content' placeholder='Nhập nội dung cần đăng' rows={6} />
                </div>

                <div className='mb-6'>
                  <TextAreaInput label='Liên lạc' name='contact' placeholder='Số điện thoại, email, tên, số nhà ...' rows={3} />
                </div>

                <div className='mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50'>
                  <h3 className='text-sm font-semibold mb-3'>Hình ảnh</h3>
                  <ImagePicker />
                </div>

                <div className='flex justify-end space-x-3'>
                  <button type='button' className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors' onClick={() => window.history.back()}>
                    Hủy
                  </button>
                  <Button className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors' type='submit'>
                    Lưu thay đổi
                  </Button>
                </div>
              </Form>
            </Formik>
          )}
        </div>

        {isSubmitting && (
          <div className='flex items-center justify-center w-full h-full bg-gray-400/75 fixed inset-0 z-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <div className='flex items-center space-x-3'>
                <svg className='animate-spin h-5 w-5 text-indigo-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                <span className='text-gray-700'>Đang xử lý, vui lòng đợi...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FormEdit;
