import HomePageSlide from "../slide/HomePageSlide"

const Home = () => {
    return (
        <div className="w-full min-h-screen">
            <HomePageSlide />
            <div className="w-full flex items-center justify-between flex-col gap-5 text-2xl b">
                <h1 className="text-2xl font-bold pt-4 underline">About Us</h1>
                <p className="w-1/2 font-light">Your Blog is a space for  writers and thinkers to share their ideas with the  world.
                     Whether you're passionate technology, literature, lifestyle, or anything in between, we provide a 
                     platform to showcase your creativity and expertise.
                </p>
                <div className="w-full h-16">
                    
                    </div>
            </div>
        </div>
    )
}

export default Home