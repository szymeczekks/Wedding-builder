import { useState } from "react";
import ChevronDown from "../../../assets/chevron-down.svg?react";
import Buttton from "../../../components/ui/Button";
import { Link } from "react-router-dom";

export function SummaryItem({ title, children }) {
    const [ isOpen, setIsOpen ] = useState(true);

    const handleClick = () => {
        setIsOpen(prev => !prev);
    };

    return <div className="bg-white p-4 rounded-md flex flex-col border-1 border-bg-dark">
        <div className="flex">
            <div className="flex gap-2 items-center cursor-pointer flex-1" onClick={handleClick}>
                <ChevronDown className={`fill-main w-6 h-6 ${isOpen ? "rotate-180" : "rotate-0"} transition-all duration-300`}/>
                <h4 className="font-semibold text-lg font-header">{title}</h4>
            </div>
            <Buttton><Link className="p-2">Edytuj</Link></Buttton>
        </div>
        <div className={`grid grid-rows-[${isOpen ? '1fr' : '0fr'}] transition-all duration-300`}>
            <div className="overflow-hidden">
                <hr className="text-bg-dark my-4" />
                {children}
            </div>
        </div>
    </div>
}