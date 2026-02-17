import { Loader } from "./Loader";

export default function Button({ onClick, children, isLoading = false, disabled = false, className, variant = 'solid' }) {

    const variants = {
        solid: 'bg-special text-white hover:bg-transparent hover:text-special',
        outline: 'bg-transparent text-special hover:bg-special hover:text-white'
    }

    return (
        <button onClick={onClick} disabled={disabled || isLoading} className={`group relative p-1 font-bold font-main-sans rounded-md border-2 border-special ${isLoading ? 'cursor-progress' : 'cursor-pointer'} transition-colors overflow-hidden ${variants[variant]} ${className}`}>
            {isLoading && <Loader/>}
            {children}
        </button>
    );
}