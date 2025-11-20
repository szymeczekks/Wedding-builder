import { Link } from "react-router-dom"

export default function Website({ name, id }) {
    return <Link to={`/panel/websites/edit/${id}`} className="shadow-lg shadow-bg-light p-5 rounded-4xl text-main font-semibold border-main border-2"> 
        {name}
    </Link>
}