import Image from "next/image"

export const ImageCard = ({w,h,src}:{w:number,h:number,src:string}) => {

        return <Image src={src} alt="Social Circle" loading="eager" width={w} height={h} / >

}