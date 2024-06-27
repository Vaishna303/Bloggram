const Tag = ({ text, color }) => {
    return (
        <p className={`  ${color} px-2 py-1 rounded-3xl `}> {text} </p>
    )
}

export default Tag