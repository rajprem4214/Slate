import Image from "next/image"

export const EmptyFavourites = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image 
              src="./empty-favourites.svg"
              height={140}
              width={140}
              alt="Empty"
            />
            <h2 className="text-2xl font-semibold mt-6">
                No favourites slates!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Try favouriting a slate
            </p>
        </div>
    )
}