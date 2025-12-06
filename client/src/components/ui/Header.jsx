export function Header({ children, className }) {
    return <h1 className={`text-xl font-semibold mb-5 md:text-2xl font-header text-main ${className}`}>{ children }</h1>
}