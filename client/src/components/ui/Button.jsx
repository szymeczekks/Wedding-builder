export default function Buttton({ onClick, children }) {
    return (
        <button onClick={onClick} className="flex font-bold bg-special text-white rounded-md border-2 border-special cursor-pointer transition-all hover:bg-white hover:text-special">
            {children}
        </button>
    );
}