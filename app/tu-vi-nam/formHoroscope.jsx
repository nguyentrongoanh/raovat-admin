'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// import ReactQuill from 'react-quill';
import supabase from '@/services/supabase.js';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const options = [
  { value: 'ti nam', label: 'Tí' },
  { value: 'suu nam', label: 'Sửu' },
  { value: 'dan nam', label: 'Dần' },
  { value: 'meo nam', label: 'Mẹo' },
  { value: 'thin nam', label: 'Thìn' },
  { value: 'ty nam', label: 'Tỵ' },
  { value: 'ngo nam', label: 'Ngọ' },
  { value: 'mui nam', label: 'Mùi' },
  { value: 'than nam', label: 'Thân' },
  { value: 'dau nam', label: 'Dậu' },
  { value: 'tuat nam', label: 'Tuất' },
  { value: 'hoi nam', label: 'Hợi' },
];

export default function FormHoroscope() {
  const [value, setValue] = useState('');
  const [selection, setSelection] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: tu_vi, error } = await supabase
        .from('tu_vi_nam')
        .select('*')
        .eq('name', selection);

      console.log(tu_vi);

      if (tu_vi.length > 0) {
        setValue(tu_vi[0].noi_dung);
      } else {
        setValue('');
      }
    };

    fetchData();
  }, [selection]);

  console.log(selection);

  const handleSubmit = async event => {
    event.preventDefault();
    // Handle the form submission, value contains the editor content
    const { data, error } = await supabase
      .from('tu_vi_nam')
      .update({ noi_dung: value })
      .eq('name', selection)
      .select();
  };

  return (
    <div className='p-4'>
      <label id='selection' className='mb-2'>
        <strong>Mạng</strong>
      </label>
      <Select
        options={options}
        className='w-[200px] mb-4'
        onChange={option => {
          setSelection(option.value);
        }}
        placeholder='Chọn mạng...'
      />
      <form onSubmit={handleSubmit}>
        <label id='noi dung' className='mb-2'>
          <strong>Nội dung</strong>
        </label>
        <ReactQuill value={value} onChange={setValue} className='mb-4' />
        <button
          type='submit'
          className='bg-green-500 px-2 border-green-600 border text-white rounded-sm active:scale-95 '
        >
          Save
        </button>
      </form>
    </div>
  );
}
