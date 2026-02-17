import { useState } from "react";

export const FormInput = ({ label, id, name }) => {
  const [value, setValue] = useState('');

  return (
    <div className='font-main relative'>
      <input onChange={(e) => setValue(e.target.value)} id={id} value={value} className='peer text-xs md:text-base w-full rounded-md p-3 border-1 border-main-transparent' type="text" name={name} ></input>
      <label className={`absolute ${value !== '' ? 'top-0' : 'top-5'} left-2 -translate-y-[50%] text-bg-dark bg-white px-1 peer-focus:top-[0] transition-all`} htmlFor={id}>{label}</label>
    </div>
  )
}
