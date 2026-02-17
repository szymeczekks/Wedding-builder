import { useRef, useState } from "react";
import ChevronDown from "../../assets/chevron-down.svg?react";
import Ellipsis from "../../assets/ellipsis-vertical.svg?react";
import { AnchoredPortal } from "../portals/AnchoredPortal";
import Button from "../../components/ui/Button"

export function ExpandableContent({ children, title, actions, open = false }) {
    const [ isOpen, setIsOpen ] = useState(open);
    const [ actionsVisible, setActionsVisible ] = useState(false);
    const actionsRef = useRef(null);

    const handleClick = () => {
        setIsOpen(prev => !prev);
    };

    return <>
        <div className="bg-white p-2 md:p-4 rounded-md flex flex-col border-1 border-bg-dark group/card" >
            <div className="flex items-center gap-2 md:gap-4">
                <div className="flex gap-2 items-center cursor-pointer flex-1" onClick={handleClick}>
                    <ChevronDown className={`fill-main w-6 h-6 ${isOpen ? "rotate-180" : "rotate-0"} transition-all duration-300`}/>
                    <h4 className="font-semibold md:text-lg font-header">{title}</h4>
                </div>
                {actions && <Button onClick={() => setActionsVisible(true)} className={`${actionsVisible ? 'visible' : 'visible lg:invisible'} group-hover/card:visible`}><Ellipsis ref={actionsRef} className='w-6 h-6 fill-white group-hover:fill-special' /></Button> }
            </div>
            <div className={`grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-all duration-300`}>
                <div className="overflow-hidden">
                    <hr className="text-bg-dark my-4" />
                    {children}
                </div>
            </div>
        </div>
        {actionsVisible && <AnchoredPortal anchorRef={actionsRef} onRequestClose={() => setActionsVisible(false)}>
            <ul className="flex flex-col gap-1">
                {actions.map(action => <li key={action.name}><button onClick={() => {
                    action.action();
                    setActionsVisible(false);
                }} className="w-full text-left transition-all px-2 py-1 cursor-pointer rounded-md font-semibold text-main hover:bg-special hover:text-white">{action.name}</button></li>)}
            </ul>
        </AnchoredPortal>}
    </> 
}
