import { FC } from 'react';

interface InputProps {
  children: React.ReactNode;
}

const Input: FC<InputProps> = ({ children }) => {
  return <div className='mb-5'>{children}</div>;
};

export default Input;
