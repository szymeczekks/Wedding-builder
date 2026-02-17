import { useState } from "react"

export const FormTextarea = ({ defaultValue, label, id, name }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className='font-main relative'>
      <textarea onChange={(e) => setValue(e.target.value)} id={id} name={name} value={value} className='peer text-xs md:text-base w-full rounded-md p-3 border-1 border-main-transparent' ></textarea>
      <label className={`absolute ${value !== '' ? 'top-0' : 'top-5'} text-xs md:text-base left-2 -translate-y-[50%] text-bg-dark bg-white px-1 peer-focus:top-[0] transition-all`} htmlFor={id}>{label}</label>
    </div>
  )
}
