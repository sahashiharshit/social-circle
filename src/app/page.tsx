import { ImageCard } from "../components/ImageCard";

// import SignupForm from "./ui/signup-form";

export default function LandingPage() {



    return (
        <div className="flex flex-row flex-wrap p-5 items-center justify-center">
            <div className="flex-1 min-w-[300px] flex justify-center">
                {/* <ImageCard w={500} h={500} src="/landingImage.png" /> */}
            </div>
            <div className="flex-1 min-w-[300px] max-w-md flex flex-col gap-4 justify-center items-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Signup Form
                </h2>
                {/* <SignupForm /> */}
            </div>
        </div>
    )
}