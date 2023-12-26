import { Formik, Form, useField } from 'formik';

const Checkbox = ({ label, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <div className='flex items-center mb-4'>
      <label className='text-black mr-2'>{label}</label>
      <input
        className='w-4 h-4 cursor-pointerb bg-gren'
        type='checkbox'
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </div>
  );
};
export default Checkbox;
