import { useField } from 'formik';
import { useState } from 'react';

const ModernTextAreaInput = ({ label, icon, ...props }) => {
  const [field, meta] = useField(props);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = e => {
    field.onBlur(e);
    setIsFocused(false);
  };

  return (
    <div className='mb-3'>
      <label className={`block text-sm font-medium transition-all duration-200 mb-1 ${meta.touched && meta.error ? 'text-red-500' : isFocused ? 'text-indigo-600' : 'text-gray-700'}`} htmlFor={props.id || props.name}>
        {label}
      </label>

      <div className='relative'>
        {icon && <div className='absolute top-2 left-0 pl-2 flex items-start pointer-events-none'>{icon}</div>}

        <textarea
          {...field}
          {...props}
          className={`block w-full ${icon ? 'pl-8' : 'pl-3'} pr-3 py-2 bg-white/70 backdrop-blur-sm border rounded shadow-sm transition-all duration-200 focus:ring-1 focus:ring-offset-0 focus:outline-none ${
            meta.touched && meta.error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
          }`}
          rows={props.rows || 4}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {meta.touched && meta.error && (
          <div className='absolute top-2 right-0 pr-2 flex items-start pointer-events-none'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-red-500' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
            </svg>
          </div>
        )}
      </div>

      {meta.touched && meta.error ? <div className='mt-0.5 text-xs text-red-500 animate-fadeIn'>{meta.error}</div> : props.hint ? <div className='mt-0.5 text-xs text-gray-500 h-4'>{props.hint}</div> : null}
    </div>
  );
};

export default ModernTextAreaInput;
