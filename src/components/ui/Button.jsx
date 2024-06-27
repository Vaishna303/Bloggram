

// eslint-disable-next-line react/prop-types
const Button = ({ text, color, bgColor, onClick}) => {
    return (
        <button onClick={onClick} className={`${color} ${bgColor} font-medium border-[1px] duration-200 transition-all ease-in border-black-500  rounded-md text-slate-900 bg-white cursor-pointer px-2 py-2 text-[0.8rem] hover:bg-red-500  bg-transparent hover:text-slate-50 md:text-[1rem] `}> {text} </button>
    )
}

export default Button