import { Link } from "react-router-dom"

export function Project({ children }) {
    return <article className="w-[calc(50%_-_6px)] border-1 rounded-md overflow-hidden border-(--color-bg-dark) shadow-md shadow-(color:--color-main-transparent) relative hover:-translate-y-1 hover:shadow-xl transition-all md:w-[calc(33.33%_-_13.4px)] md:rounded-2xl xl:w-[calc(25%_-_15px)]">
        {children}
    </article>
}