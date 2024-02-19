'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/services/supabase.js';

export default function FormWeek() {
  const [from, setFrom] = useState('');
  const [until, setUntil] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('tuan')
        .select('*')
        .eq('id', '1');
      console.log(data);
      if (data.length > 0) {
        setFrom(data[0].from);
        setUntil(data[0].until);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    // Handle the form submission, value contains the editor content
    const { data, error } = await supabase
      .from('tuan')
      .update({ from: from, until: until })
      .eq('id', 1)
      .select();
  };

  return (
    <div className='p-4'>
      <label id='selection' className='mb-2'>
        <strong>Tuần</strong>
      </label>
      <form onSubmit={handleSubmit}>
        <div className='flex space-x-3 mb-4'>
          <input
            placeholder='Từ ngày'
            name='from'
            className='border rounded-sm p-2'
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
          <input
            placeholder='Đến ngày'
            name='until'
            className='border rounded-sm p-2'
            value={until}
            onChange={e => setUntil(e.target.value)}
          />
        </div>
        <button
          type='submit'
          className='bg-green-500 px-2 border-green-600 border text-white rounded-sm active:scale-95 '
        >
          Lưu
        </button>
      </form>
    </div>
  );
}
