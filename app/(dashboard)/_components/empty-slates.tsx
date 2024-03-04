"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useOrganization } from "@clerk/nextjs"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const EmptySlates = () => {
    const router = useRouter();

    const { organization } = useOrganization();
    const { mutate, pending } = useApiMutation(api.slate.create)

    const onClick = () => {
        if (!organization) return;

        mutate({
            orgId: organization.id,
            title: "Untitled"
        })
            .then((id) => {
                toast.success("Slate created");
                router.push(`/slate/${id}`)

            })
            .catch(() => toast.error("Failed to create slate"))
    }


    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="./note.svg"
                height={110}
                width={110}
                alt="Empty"
            />
            <h2 className="text-2xl font-semibold mt-6">
                Create your first slate!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Start by creating a slate for your organization
            </p>
            <div className="mt-6">
                <Button disabled={pending} onClick={onClick} size="lg">
                    Create Slate
                </Button>
            </div>
        </div>
    )
}