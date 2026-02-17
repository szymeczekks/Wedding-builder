import { Loader } from "./Loader";

export function PseudoLink({ children, handleClick, ref, isLoading }) {
    return <span className={`relative border-b-1 border-special border-dashed rounded-md inline-block overflow-hidden text-special text-lg md:text-2xl ${isLoading ? 'cursor-progress' : 'cursor-pointer'}`} onClick={handleClick} ref={ref}>
        {isLoading && <Loader />}
        {children}
    </span>
}