
// eslint-disable-next-line react/prop-types
const Icon = ({ icon, bgColor, color }) => {
    return (
        <p className={`${color} , ${bgColor} p-2 rounded-full`}> {icon} </p>
    )
}

export default Icon