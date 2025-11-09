export default function Buttton({ onClick, children }) {
    return (
        <button onClick={onClick} className="px-2 py-1 border-rose-700 border-1 rounded-md text-rose-700 text-sm font-medium cursor-pointer hover:bg-rose-700 hover:text-white transition duration-300 ease-in-out">
            {children}
        </button>
    );
}