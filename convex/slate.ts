import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const images = [
    "/placeholders/1.svg",
    "/placeholders/2.svg",
    "/placeholders/3.svg",
    "/placeholders/4.svg",
    "/placeholders/5.svg",
    "/placeholders/6.svg",
    "/placeholders/7.svg",
    "/placeholders/8.svg",
    "/placeholders/9.svg",
    "/placeholders/10.svg",
]

export const create = mutation({
    args: {
        orgId: v.string(),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const randomImage = images[Math.floor(Math.random() * images.length)];

        const slate = await ctx.db.insert("slates", {
            title: args.title,
            orgId: args.orgId,
            authorId: identity.subject,
            authorName: identity.name!,
            imageUrl: randomImage,
        })

        return slate;
    }
})

export const remove = mutation({
    args: { id: v.id("slates") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const userId = identity.subject;

        const existingFavourite = await ctx.db
            .query("userFavourites")
            .withIndex("by_user_slate", (q) =>
                q
                    .eq("userId", userId)
                    .eq("slateId", args.id)
            )
            .unique();

        if (existingFavourite) {
            await ctx.db.delete(existingFavourite._id);
        }

        await ctx.db.delete(args.id);
    },
});

export const update = mutation({
    args: { id: v.id("slates"), title: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const title = args.title.trim();

        if (!title) {
            throw new Error("Title is required");
        }

        if (title.length > 60) {
            throw new Error("Title cannot be longer than 60 characters")
        }

        const slate = await ctx.db.patch(args.id, {
            title: args.title,
        });

        return slate;
    },
});


export const favourite = mutation({
    args: { id: v.id("slates"), orgId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const slate = await ctx.db.get(args.id);

        if (!slate) {
            throw new Error("Slate not found");
        }

        const userId = identity.subject;

        const existingFavourite = await ctx.db
            .query("userFavourites")
            .withIndex("by_user_slate", (q) =>
                q
                    .eq("userId", userId)
                    .eq("slateId", slate._id)
            )
            .unique();

        if (existingFavourite) {
            throw new Error("Slate already favourited");
        }

        await ctx.db.insert("userFavourites", {
            userId,
            slateId: slate._id,
            orgId: args.orgId,
        });

        return slate;
    },
});

export const unFavourite = mutation({
    args: { id: v.id("slates") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const slate = await ctx.db.get(args.id);

        if (!slate) {
            throw new Error("Slate not found");
        }

        const userId = identity.subject;

        const existingFavourite = await ctx.db
            .query("userFavourites")
            .withIndex("by_user_slate", (q) =>
                q
                    .eq("userId", userId)
                    .eq("slateId", slate._id)
            )
            .unique();

        if (!existingFavourite) {
            throw new Error("Favourited slate not found");
        }

        await ctx.db.delete(existingFavourite._id);

        return slate;
    },
});


export const get = query({
    args: { id: v.id("slates") },
    handler: async (ctx, args) => {
        const board = ctx.db.get(args.id);

        return board;
    },
});