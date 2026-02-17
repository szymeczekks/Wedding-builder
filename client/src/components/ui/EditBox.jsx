export function EditBox({ children, label }) {
    return <div className="border-1 p-3 rounded-md border-main flex-1">
        <p className="mb-1 text-xs md:text-base md:mb-3">{label}</p>
        {children}
    </div>
}