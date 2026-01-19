export function ProgressBar({ current, max, label }) {
    return <div className="flex flex-col items-center">
        <div className="w-8 h-40 bg-main rounded-full flex items-end p-2">
            <div className="w-full bg-special rounded-full transition-all" style={{ height: `${(current / max) * 100}%` }}
            />
        </div>
        <span className="mt-2 text-xs">{label}</span>
        <span className="font-bold">{current}</span>
    </div>
}