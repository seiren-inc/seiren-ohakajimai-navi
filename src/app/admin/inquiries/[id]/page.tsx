import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { InquiryDetail } from "@/components/features/admin/inquiry-detail"

// Correct type definition for params in Next.js 15
type PageProps = {
    params: Promise<{ id: string }>
}

export default async function InquiryDetailPage(props: PageProps) {
    const params = await props.params
    const inquiry = await prisma.inquiry.findUnique({
        where: { id: params.id },
    })

    if (!inquiry) {
        notFound()
    }

    return <InquiryDetail inquiry={inquiry} />
}
