import { v } from "convex/values";
import { getAllOrThrow } from "convex-helpers/server/relationships";

import { query } from "./_generated/server";

export const get = query({
    args: {
        orgId: v.string(),
        search: v.optional(v.string()),
        favourites: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        if (args.favourites) {
            const FavouritedSlates = await ctx.db
                .query("userFavourites")
                .withIndex("by_user_org", (q) =>
                    q
                        .eq("userId", identity.subject)
                        .eq("orgId", args.orgId)
                )
                .order("desc")
                .collect();

            const ids = FavouritedSlates.map((b) => b.slateId);

            const slates = await getAllOrThrow(ctx.db, ids);

            return slates.map((slate) => ({
                ...slate,
                isFavourite: true,
            }));
        }

        const title = args.search as string;
        let slates = [];

        if (title) {
            slates = await ctx.db
                .query("slates")
                .withSearchIndex("search_title", (q) =>
                    q
                        .search("title", title)
                        .eq("orgId", args.orgId)
                )
                .collect();
        } else {
            slates = await ctx.db
                .query("slates")
                .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
                .order("desc")
                .collect();
        }

        const slatesWithFavouriteRelation = slates.map((slate) => {
            return ctx.db
                .query("userFavourites")
                .withIndex("by_user_slate", (q) =>
                    q
                        .eq("userId", identity.subject)
                        .eq("slateId", slate._id)
                )
                .unique()
                .then((Favourite) => {
                    return {
                        ...slate,
                        isFavourite: !!Favourite,
                    };
                });
        });

        const slatesWithFavouriteBoolean = Promise.all(slatesWithFavouriteRelation);

        return slatesWithFavouriteBoolean;
    },
});