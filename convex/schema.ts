import { v } from "convex/values"
import { defineSchema, defineTable } from "convex/server"

export default defineSchema({
    slates: defineTable({
        title: v.string(),
        orgId: v.string(),
        authorId: v.string(),
        authorName: v.string(),
        imageUrl: v.string()
    })
        .index("by_org", ["orgId"])
        .searchIndex("search_title", {
            searchField: "title",
            filterFields: ["orgId"]
        }),
    userFavourites: defineTable({
        orgId: v.string(),
        userId: v.string(),
        slateId: v.id("slates")
    })
        .index("by_slate", ["slateId"])
        .index("by_user_org", ["userId", "orgId"])
        .index("by_user_slate", ["userId", "slateId"])
        .index("by_user_slate_org", ["userId", "slateId", "orgId"])    
});
