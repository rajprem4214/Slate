"use client"

import { EmptyFavourites } from "./empty-favourites";
import { EmptySearch } from "./empty-search";
import { EmptySlates } from "./empty-slates";

interface BoardListProps {
    orgId: string;
    query: {
        search?: string;
        favourites?: string;
    }
}

export const BoardList = ({
    orgId,
    query
}: BoardListProps) => {

    const data = []; // TODO: Change to API call

    if (!data?.length && query.search) {
        return (
           <EmptySearch />
        )
    }

    if (!data.length && query.favourites) {
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
            {JSON.stringify(query)}
        </div>
    )
}