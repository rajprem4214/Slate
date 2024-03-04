"use client"

import { EmptyFavourites } from "./empty-favourites";
import { EmptySearch } from "./empty-search";
import { EmptySlates } from "./empty-slates";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SlateCard } from "./slate-card";
import { NewSlateButton } from "./new-slate-button";

interface SlateListProps {
    orgId: string;
    query: {
        search?: string;
        favourites?: string;
    }
}

export const SlateList = ({
    orgId,
    query
}: SlateListProps) => {

    const data = useQuery(api.slates.get, {
        orgId,
        ...query
    });

    if(data === undefined)
    {
        return (
        <div>
            Loading..
        </div>)
    }

    if (!data?.length && query.search) {
        return (
           <EmptySearch />
        )
    }

    if (!data?.length && query.favourites) {
        return (
            <EmptyFavourites />
        )
    }

    if (!data?.length) {
        return (
            <EmptySlates />
        )
    }

    return (
        <div>
            <h2 className="text-3xl">
                {query.favourites ? "Favourite slates" : "Team slates"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                <NewSlateButton orgId={orgId} />
                {data?.map((slate) => (
                    <SlateCard
                        key={slate._id}
                        id={slate._id}
                        title={slate.title}
                        imageUrl={slate.imageUrl}
                        authorId={slate.authorId}
                        authorName={slate.authorName}
                        createdAt={slate._creationTime}
                        orgId={slate.orgId}
                        isFavourite={slate.isFavourite}
                    />
                ))}
            </div>
        </div>
    )
}