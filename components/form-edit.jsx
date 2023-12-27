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
  title: Yup.string()
    .max(200, 'Tiêu đề không dài hơn 200 kí')
    .required('Tiêu đề không được để trống'),
  content: Yup.string().required('Nội dung không được để trống'),
  contact: Yup.string()
    .max(200, 'Thông tin liên hệ không được dài hơn 200 kí tự')
    .required('Thông tin liên hệ không được để trống'),
});

const FormDangTin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const queryString = useSearchParams();
  const id = queryString.get('id');

  useEffect(() => {
    setIsLoading(false);

    const fetchData = async () => {
      const data = await getDetailById(id);
      console.log(data);
      setDetail(...data);
    };
    fetchData();
    setIsLoading(false);
  }, []);

  const formData = {
    category: detail?.danh_muc,
    subcategory: detail?.danh_muc_phu,
    state: detail?.tieu_bang,
    city: detail?.thanh_pho,
    title: detail?.tieu_de,
    content: detail?.noi_dung,
    contact: detail?.lien_he,
    vip: detail?.is_vip,
    active: detail?.active,
    photo: null,
  };

  const handleSubmit = async values => {
    setIsSubmitting(true);
    const data = {
      // danh_muc: removeVietnameseTones(values.category).toLowerCase(),
      danh_muc: values.category,
      danh_muc_phu: values.subcategory.toString(),
      tieu_bang: values.state.toLowerCase(),
      dia_chi: values.state,
      thanh_pho: values.city.toString().toLowerCase(),
      tieu_de: values.title,
      noi_dung: values.content,
      lien_he: values.contact,
      search_text:
        values.title +
        ' ' +
        values.content +
        ' ' +
        values.contact +
        ' ' +
        values.state +
        ' ' +
        values.city,
      is_vip: values.vip,
      active: values.active,
    };

    // Update or insert tin_dang
    const { data: dataTin, error: errorTin } = await supabase
      .from('tin_dang')
      .insert({ ...data })
      .select();

    const id = dataTin[0].id;

    const filename = `${id}/images-1`;

    const { data: images, error } = await supabase.storage
      .from('images')
      .upload(filename, values.photo, {
        cacheControl: '3600',
        upsert: true,
      });
    // // wait 3 seconds before closing modal
    setTimeout(() => {
      setIsSubmitting(false), 5000;
    });
  };

  return (
    <>
      <div className='pb-10 mt-10 rounded-sm bg-white mb-3'>
        <div className='space-y-8'>
          <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            key={Math.random()}
          >
            <Form className='px-10 text-black' encType='multipart/form-data'>
              <div className='flex space-x-10 mb-4'>
                <Checkbox label='Active' name='active' />
                <Checkbox label='VIP' name='vip' />
              </div>
              <div className='flex justify-between space-x-4 mb-4'>
                <SelectInput
                  label='Danh mục'
                  name='category'
                  placeholder='Chọn danh mục'
                />
                <SelectInput
                  label='Danh mục phụ'
                  name='subcategory'
                  placeholder='Chọn danh mục'
                />
              </div>
              <div className='flex justify-between space-x-4 mb-4'>
                <SelectInput
                  label='Tiểu bang'
                  name='state'
                  placeholder='Chọn tiểu bang'
                />
                <SelectInput
                  label='Thành phố'
                  name='city'
                  placeholder='Chọn thành phố'
                />
              </div>
              <TextInput
                label='Tiêu đề'
                name='title'
                placeholder='Nhập tiêu đề'
              />
              <TextAreaInput
                label='Nội dung'
                name='content'
                placeholder='Nhập nội dung cần đăng'
              />
              <TextAreaInput
                label='Liên lạc'
                name='contact'
                placeholder='Số điện thoại, email, tên, số nhà ...'
              />
              <div className='mt-5'>
                <ImagePicker />
              </div>
              <div className='flex justify-end space-x-2 text-white'>
                <Button
                  className='bg-green-600 hover:bg-opacity-80 hover:bg-regular'
                  type='submit'
                >
                  Đăng tin
                </Button>
              </div>
            </Form>
          </Formik>
        </div>
        {isSubmitting && (
          <div className=' flex items-center justify-center w-full h-full bg-gray-400 m-auto absolute inset-0 text-2xl opacity-75 uppercase text-red-800'>
            <span>Thí chủ vui lòng đợi trong giây lát ...</span>
          </div>
        )}
      </div>
    </>
  );
};

export default FormDangTin;
