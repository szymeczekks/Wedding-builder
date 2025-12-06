export function Subheader({ children, className }) {
    return <h2 className={`text-xs font-medium mb-2 md:text-base font-header text-bg-dark uppercase ${className}`}>{ children }</h2>
}