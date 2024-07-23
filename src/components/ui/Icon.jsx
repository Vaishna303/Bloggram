
const Icon = ({ icon, bgColor, color }) => {
    return (
        <p className={`${color} , ${bgColor} p-2 rounded-full hover:bg-purple-900`}> {icon} </p>
    )
}

export default Icon