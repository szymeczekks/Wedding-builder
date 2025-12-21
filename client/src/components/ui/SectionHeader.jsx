export function SectionHeader({ header, subheader, image }) {
    return <div className="flex flex-col gap-2 items-center md:flex-row">
        <div className="flex flex-1 flex-col gap-2 md:gap-5">
            <h1 className="font-header font-semibold text-2xl md:text-4xl">{header}</h1>
            <h2 className="font-header text-base md:text-xl">{subheader}</h2>
        </div>
        <div className="flex flex-1 items-center justify-center w-full">
            <img src={image} alt="" className="max-h-full max-w-md w-full" />
        </div>
    </div>
}