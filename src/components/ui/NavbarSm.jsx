
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";
import Icon from "./Icon";
const NavbarSm = () => {
    return (
        <div className="w-full  grid place-items-center  fixed bottom-10">
            <div className="flex py-2 rounded-3xl border-2 w-[20rem] gap-7 items-center justify-center ">
                <Icon icon={<FaFacebookF />} color={"text-slate-50"} bgColor={"bg-indigo-700"} />
                <Icon icon={<FaXTwitter />} color={"text-slate-50"} bgColor={"bg-indigo-700"} />
                <Icon icon={<AiFillInstagram />} color={"text-slate-50"} bgColor={"bg-indigo-700"} />
                <Icon icon={<FaLinkedin />} color={"text-slate-50"} bgColor={"bg-indigo-700"} />
                <Icon icon={<IoLogoWhatsapp />} color={"text-slate-50"} bgColor={"bg-indigo-700"} />
            </div>
        </div>
    )
}

export default NavbarSm