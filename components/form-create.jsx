'use client';

import { useState } from 'react';
import supabase from '@/services/supabase';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import SelectInput from './ui/SelectInput';
import TextInput from './ui/TextInput';
import TextAreaInput from './ui/TextAreaInput';
import ImagePicker from './ui/ImagePicker';

const validationSchema = Yup.object({
  category: Yup.string().required('Vui lòng chọn danh mục'),
  state: Yup.string().required('Vui lòng chọn tiểu bang'),
  city: Yup.string().required('Vui lòng chọn thành phố'),
  title: Yup.string()
    .max(200, 'Tiêu đề không dài hơn 200 kí')
    .required('Tiêu đề không được để trống'),
  content: Yup.string().required('Nội dung không được để trống'),
  contact: Yup.string()
    .max(200, 'Thông tin liên hệ không được dài hơn 200 kí tự')
    .required('Thông tin liên hệ không được để trống'),
});

const FormDangTin = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const formData = {
    category: '',
    state: '',
    city: '',
    title: '',
    content: '',
    vip: false,
    photo: null,
  };

  const handleSubmit = async values => {
    const data = {
      category_id: +values.category,
      tieu_bang: values.state,
      thanh_pho: values.city,
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
    // wait 3 seconds before closing modal
  };

  return (
    <>
      <div className='pb-10 mt-10 rounded-sm bg-white mb-3'>
        <div className='space-y-8'>
          {/* <p>{JSON.stringify(pricings)}</p> */}
          <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className='px-10 text-black' encType='multipart/form-data'>
              <div className='mb-4'>
                <SelectInput
                  label='Danh mục'
                  name='category'
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
      </div>
    </>
  );
};

export default FormDangTin;
