import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import supabase from '@/services/supabase.js';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';

const options = [
  { value: 'ti nam', label: 'Nam Tí' },
  { value: 'ti nu', label: 'Nữ Tí' },
  { value: 'suu nam', label: 'Nam Sửu' },
  { value: 'suu nu', label: 'Nữ  Sửu' },
  { value: 'dan nam', label: 'Nam Dần' },
  { value: 'dan nu', label: 'Nữ Dần' },
  { value: 'meo nam', label: 'Nam Mẹo' },
  { value: 'meo nu', label: 'Nữ Mẹo' },
  { value: 'thin nam', label: 'Nam Thìn' },
  { value: 'thin nu', label: 'Nữ Thìn' },
  { value: 'ty nam', label: 'Nam Tỵ' },
  { value: 'ty nu', label: 'Nữ Tỵ' },
  { value: 'ngo nam', label: 'Nam Ngọ' },
  { value: 'ngo nam', label: 'Nữ Ngọ' },
  { value: 'mui nam', label: 'Nam Mùi' },
  { value: 'mui nu', label: 'Nữ Mùi' },
  { value: 'than nam', label: 'Nam Thân' },
  { value: 'than nu', label: 'Nữ Thân' },
  { value: 'dau nam', label: 'Nam Dậu' },
  { value: 'dau nu', label: 'Nữ Dậu' },
  { value: 'tuat nam', label: 'Nam Tuất' },
  { value: 'tuat nu', label: 'Nữ Tuất' },
  { value: 'hoi nam', label: 'Nam Hợi' },
  { value: 'hoi nu', label: 'Nữ Hợi' },
];

export default function FormHoroscope() {
  const [value, setValue] = useState('');
  const [selection, setSelection] = useState(options[0].value);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tu_vi, error } = await supabase
        .from('tu_vi')
        .select('*')
        .eq('name', selection);
      console.log(tu_vi[0].noi_dung);
      setValue(tu_vi[0].noi_dung);
    };

    fetchData();
  }, [selection]);

  const handleSubmit = async event => {
    event.preventDefault();
    // Handle the form submission, value contains the editor content
    const { data, error } = await supabase
      .from('tu_vi')
      .update({ noi_dung: value })
      .eq('id', 1)
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
