'use client';

import supabase from '@/services/supabase';
import Image from 'next/image';
import { Container, Form, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';

const CDNURL = process.env.NEXT_PUBLIC_SUPABASE_CDN;

export default function UploadBanner({ name }) {
  const banner = name;

  const [images, setImages] = useState([]);

  async function getImages() {
    const { data, error } = await supabase.storage
      .from('images')
      .list(banner + '/', {
        sortBy: {
          column: 'created_at',
          order: 'desc',
        },
      });

    if (data !== null) {
      setImages(data);
    } else {
      alert('Error loading images');
      console.log(error);
    }
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    console.log(file);

    const { data, error } = await supabase.storage
      .from('images')
      .upload(banner + '/' + uuidv4(), file);

    if (data) {
      getImages();
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await getImages();
    }
    fetchData();
  }, []);

  return (
    <Container align='center' className='container-sm mt-4 flex items-center'>
      <Form.Group className='mb-3' style={{ maxWidth: '500px' }}>
        <Form.Control
          type='file'
          accept='image/png, image/jpeg, image/gif'
          onChange={e => uploadImage(e)}
        />
      </Form.Group>
      <Image
        src={CDNURL + banner + '/' + images[0]?.name}
        width={400}
        height={200}
        alt={banner}
        objectFit
      />
    </Container>
  );
}
