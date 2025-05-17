import { useField } from 'formik';
import { useState } from 'react';

const ModernCheckbox = ({ label, description, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = e => {
    field.onBlur(e);
    setIsFocused(false);
  };

  return (
    <div className='relative flex items-start mb-2'>
      <div className='flex items-center h-4'>
        <input
          type='checkbox'
          {...field}
          {...props}
          className={`h-4 w-4 rounded border-gray-300 text-indigo-600 transition duration-150 ease-in-out
            focus:ring-1 focus:ring-offset-0 focus:outline-none ${isFocused ? 'focus:ring-indigo-500' : ''} ${meta.touched && meta.error ? 'border-red-300' : ''}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      <div className='ml-2 text-sm'>
        <label htmlFor={props.id || props.name} className={`font-medium ${meta.touched && meta.error ? 'text-red-500' : field.checked ? 'text-indigo-600' : 'text-gray-700'} cursor-pointer`}>
          {label}
        </label>
        {description && <p className='text-xs text-gray-500'>{description}</p>}
        {meta.touched && meta.error ? <div className='mt-0.5 text-xs text-red-500 animate-fadeIn'>{meta.error}</div> : null}
      </div>
    </div>
  );
};

export default ModernCheckbox;
