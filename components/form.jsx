'use client';

import { useRouter } from 'next/navigation';

import { FC, isValidElement, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import supabase from '@/services/supabase';
import * as Yup from 'yup';

// import UploadImage from '../upload/UploadImage';
import Input from '@/components/ui/input';
import Select from 'react-select';

import { Oval } from 'react-loader-spinner';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';

// interface FormCreateProps {}

const FormCreate = ({}) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      selectedCategory: null,
      selectedSubcategory: null,
      title: '',
      desc: '',
      contact: '',
      address: '',
      isActive: true,
      isVip: false,
      selectedPricing: null,
    },

    validationSchema: Yup.object({
      selectedCategory: Yup.object()
        .shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
        .nonNullable()
        .required('Vui lòng chọn một danh mục'),
      title: Yup.string('Vui lòng chọn một danh mục')
        .max(200, 'Tiêu đề không dài hơn 200 kí')
        .required('Tiêu đề không được để trống'),
      desc: Yup.string()
        .max(300, 'Nội dung không được dài hơn 300 kí tự')
        .required('Nội dung không được để trống'),
      contact: Yup.string()
        .max(200, 'Thông tin liên hệ không được dài hơn 200 kí tự')
        .required('Thông tin liên hệ không được để trống'),
      address: Yup.string()
        .max(200, 'Địa chỉ không được dài hơn 200 kí tự')
        .required('Địa chỉ không được để trống'),
      isVip: Yup.boolean().required(),
      isActive: Yup.boolean().notRequired(),
    }),
    validate: () => {},
    onSubmit: async values => {
      const ad = {
        tieu_de: values.title,
        noi_dung: values.desc,
        dia_chi: values.address,
        lien_he: values.contact,
        category_id: +values.selectedCategory.value,
        sub_category_id: +values.selectedSubcategory.value,
        search_text:
          values.title +
          ' ' +
          values.desc +
          ' ' +
          values.contact +
          ' ' +
          values.address,
        is_vip: formik.values.isVip,
        active: formik.values.isActive,
      };

      const { data, error } = await supabase
        .from('tin_dang')
        .insert([{ ...ad }])
        .select();

      if (error) console.error(error);

      console.log('something');
      await new Promise(resolve => setTimeout(resolve, 3000));
      formik.resetForm();
    },
  });

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        console.error('Error fetching categories', error);
      } else {
        const categoriesData = data.map(category => ({
          value: category.id,
          label: category.category_name,
        }));

        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchSubcategories = async categoryId => {
    try {
      const { data, error } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('category_id', categoryId);
      if (error) {
        console.error('Error fetching subcategories', error);
      } else {
        const subcategoriesData = data.map(subcategory => ({
          value: subcategory.id,
          label: subcategory.name,
        }));
        setSubcategories(subcategoriesData);
      }
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formik.values.selectedCategory) {
      fetchSubcategories(formik.values.selectedCategory.value);
    }
  }, [formik.values.selectedCategory]);

  const handleCategoryChange = selectedOption => {
    formik.setFieldValue('selectedCategory', selectedOption);
    formik.setFieldValue('selectedSubcategory', null);
  };

  const handleSubcategoryChange = selectedOption => {
    formik.setFieldValue('selectedSubcategory', selectedOption);
  };

  const handleActiveCheckbox = () => {
    formik.setFieldValue('isActive', !formik.values.isActive);
  };

  const handleVipCheckbox = () => {
    formik.setFieldValue('isVip', !formik.values.isVip);
  };

  const colorStyles = {
    control: styles => ({
      ...styles,
      marginTop: '3px',
    }),
  };

  return (
    <div className='flex-col'>
      <form>
        <div className='flex space-x-4 items-center mb-3'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='active'
              value={formik.values.isActive}
              checked={formik.values.isActive}
              onClick={handleActiveCheckbox}
            />
            <label
              htmlFor='active'
              className='text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Active
            </label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='vip'
              value={formik.values.isVip}
              checked={formik.values.isVip}
              onClick={handleVipCheckbox}
            />
            <label
              htmlFor='vip'
              className='text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              VIP
            </label>
          </div>
        </div>
        <div className='flex space-x-3 mb-2'>
          <div className='flex-1 mb-3'>
            <label
              className={`font-semibold ${
                formik.errors.selectedCategory &&
                formik.touched.selectedCategory
                  ? 'text-red-400'
                  : ''
              }`}
              htmlFor='category'
            >
              {formik.errors.selectedCategory && formik.touched.selectedCategory
                ? formik.errors.selectedCategory
                : 'Danh mục chính'}
            </label>
            <Select
              name='selectedCategory'
              placeholder='Lựa chọn danh mục'
              styles={colorStyles}
              options={categories}
              onChange={handleCategoryChange}
              value={formik.values.selectedCategory}
              onBlur={() => {
                formik.setFieldTouched('selectedCategory');
              }}
            />
          </div>
          <div className='flex-1 mb-3'>
            <label className='font-semibold'>
              Danh mục phụ (không bắt buộc)
            </label>
            <Select
              id='danh muc phu'
              placeholder='Lựa chọn danh mục'
              styles={colorStyles}
              options={subcategories}
              isDisabled={!formik.values.selectedCategory}
              onChange={handleSubcategoryChange}
              value={formik.values.selectedSubcategory}
            />
          </div>
        </div>
        <Input>
          <label
            htmlFor='title'
            className={`font-semibold ${
              formik.errors.title && formik.touched.title ? 'text-red-400' : ''
            }`}
          >
            {formik.errors.title && formik.touched.title
              ? formik.errors.title
              : 'Tiêu đề'}
          </label>
          <input
            className='border p-2 w-full mt-1 rounded-md'
            type='text'
            name='title'
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Input>
        <div className='mb-3'>
          <label
            className={`font-semibold ${
              formik.errors.desc && formik.touched.desc ? 'text-red-400' : ''
            }`}
            htmlFor='desc'
          >
            {formik.errors.desc && formik.touched.desc
              ? formik.errors.desc
              : 'Nội dung tin đăng'}
          </label>
          <textarea
            rows={8}
            className='block w-full border mb-2 p-2 mt-1 rounded-md'
            name='desc'
            value={formik.values.desc}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div>
          <label
            className={`font-semibold ${
              formik.errors.address && formik.touched.address
                ? 'text-red-400'
                : ''
            }`}
            htmlFor='address'
          >
            {formik.errors.address && formik.touched.address
              ? formik.errors.address
              : 'Địa chỉ'}
          </label>
          <Input>
            <textarea
              placeholder='Số nhà, thành phố, tiểu bang, zipcode'
              className='border p-2 w-full mt-1 rounded-md'
              name='address'
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Input>
        </div>
        <div>
          <label
            className={`font-semibold ${
              formik.errors.contact && formik.touched.contact
                ? 'text-red-400'
                : ''
            }`}
            htmlFor='contact'
          >
            {formik.errors.contact && formik.touched.contact
              ? formik.errors.contact
              : 'Thông tin liên hệ'}
          </label>
          <Input>
            <textarea
              placeholder='Tên, số điện thoại liên lạc'
              className='border p-2 w-full mt-1 rounded-md'
              name='contact'
              value={formik.values.contact}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Input>
        </div>
        <div className='flex justify-end space-x-4 p-4'>
          <Button
            className='bg-[#457B9D] text-white font-semibold'
            onClick={() => {
              router.push('/');
            }}
            type='button'
          >
            Cancel
          </Button>
          <div className='flex space-x-2'>
            <Button
              className='bg-green-700 text-white font-semibold'
              onClick={formik.handleSubmit}
              type='submit'
            >
              {formik.isSubmitting && (
                <Oval width={20} strokeWidth={5} color='red' />
              )}
              Create
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormCreate;
