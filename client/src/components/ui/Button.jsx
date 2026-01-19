import { Loader } from "./Loader";

export default function Button({ onClick, children, isLoading = false, disabled = false }) {

    return (
        <button onClick={onClick} disabled={disabled || isLoading} className={`group relative p-1 font-bold font-main-sans bg-special text-white rounded-md border-2 border-special ${isLoading ? 'cursor-progress' : 'cursor-pointer'} transition-all overflow-hidden hover:bg-transparent hover:text-special`}>
            {isLoading && <Loader/>}
            {children}
        </button>
    );
}