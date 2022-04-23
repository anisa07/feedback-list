interface LogoProps {
    title: string;
    text: string;
}

export const Logo = (props: LogoProps) => {
    return (<div className="md:flex md:flex-col md:justify-end p-5 lg:mr-0 md:mb-3 md:pt-10 md:mr-3 bg-gradient-to-br from-indigo-500 via-purple-500 via-pink-500 to-red-400 md:rounded logo text-white">
        <h1 className="font-bold">{props.title}</h1>
        <p className="font-lighter">{props.text}</p>
    </div>)
}
