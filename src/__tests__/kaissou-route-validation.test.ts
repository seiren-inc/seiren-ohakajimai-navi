import { beforeEach, describe, expect, it, vi } from "vitest"
import { findPrefectureSlug, isValidPrefectureSlug } from "@/lib/prefectures"
import prefecturePage, { generateMetadata as generatePrefectureMetadata } from "@/app/kaissou/[prefecture]/page"
import municipalityPage, { generateMetadata as generateMunicipalityMetadata } from "@/app/kaissou/[prefecture]/[municipality]/page"

const {
    notFoundMock,
    permanentRedirectMock,
    constructMetadataMock,
    findManyMunicipalityMock,
    findManyScrivenerMock,
    findFirstMunicipalityMock,
} = vi.hoisted(() => ({
    notFoundMock: vi.fn(() => {
        throw new Error("NEXT_NOT_FOUND")
    }),
    permanentRedirectMock: vi.fn((destination: string) => {
        throw new Error(`NEXT_REDIRECT:${destination}`)
    }),
    constructMetadataMock: vi.fn((input?: Record<string, unknown>) => ({
        title: "default",
        ...input,
    })),
    findManyMunicipalityMock: vi.fn(),
    findManyScrivenerMock: vi.fn(),
    findFirstMunicipalityMock: vi.fn(),
}))

vi.mock("next/navigation", () => ({
    notFound: notFoundMock,
    permanentRedirect: permanentRedirectMock,
}))

vi.mock("@/lib/seo", () => ({
    constructMetadata: constructMetadataMock,
}))

vi.mock("@/lib/prisma", () => ({
    prisma: {
        municipality: {
            findMany: findManyMunicipalityMock,
            findFirst: findFirstMunicipalityMock,
        },
        administrativeScrivener: {
            findMany: findManyScrivenerMock,
        },
    },
}))

describe("isValidPrefectureSlug", () => {
    it("returns true for known slug", () => {
        expect(isValidPrefectureSlug("tokyo")).toBe(true)
    })

    it("returns false for unknown slug", () => {
        expect(isValidPrefectureSlug("unknown")).toBe(false)
    })
})

describe("findPrefectureSlug", () => {
    it.each([
        ["tokyo", "tokyo"],
        ["東京都", "tokyo"],
        ["東京", "tokyo"],
    ])("resolves %s to %s", (value, expected) => {
        expect(findPrefectureSlug(value)).toBe(expected)
    })

    it("returns null for unknown prefecture", () => {
        expect(findPrefectureSlug("unknown")).toBeNull()
    })
})

describe("kaissou prefecture route guards", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        findManyMunicipalityMock.mockResolvedValue([])
        findManyScrivenerMock.mockResolvedValue([])
    })

    it.each(["unknown", "undefined", "null"])(
        "calls notFound for invalid prefecture page slug: %s",
        async (prefecture) => {
            await expect(prefecturePage({ params: Promise.resolve({ prefecture }) })).rejects.toThrow("NEXT_NOT_FOUND")
            expect(notFoundMock).toHaveBeenCalledTimes(1)
            expect(findManyMunicipalityMock).not.toHaveBeenCalled()
        }
    )

    it.each(["東京", "東京都"])("redirects Japanese prefecture name to canonical slug: %s", async (prefecture) => {
        await expect(prefecturePage({ params: Promise.resolve({ prefecture }) })).rejects.toThrow(
            "NEXT_REDIRECT:/kaissou/tokyo"
        )

        expect(permanentRedirectMock).toHaveBeenCalledWith("/kaissou/tokyo")
        expect(notFoundMock).not.toHaveBeenCalled()
        expect(findManyMunicipalityMock).not.toHaveBeenCalled()
    })

    it("handles valid prefecture slug: tokyo", async () => {
        const result = await prefecturePage({ params: Promise.resolve({ prefecture: "tokyo" }) })

        expect(notFoundMock).not.toHaveBeenCalled()
        expect(findManyMunicipalityMock).toHaveBeenCalledTimes(1)
        expect(findManyScrivenerMock).toHaveBeenCalledTimes(1)
        expect(result).toBeTruthy()
    })

    it("calls notFound in metadata for invalid prefecture slug", async () => {
        await expect(generatePrefectureMetadata({ params: Promise.resolve({ prefecture: "unknown" }) })).rejects.toThrow(
            "NEXT_NOT_FOUND"
        )

        expect(notFoundMock).toHaveBeenCalledTimes(1)
        expect(constructMetadataMock).not.toHaveBeenCalled()
        expect(findManyMunicipalityMock).not.toHaveBeenCalled()
    })

    it("redirects Japanese prefecture name in metadata to canonical slug", async () => {
        await expect(generatePrefectureMetadata({ params: Promise.resolve({ prefecture: "東京都" }) })).rejects.toThrow(
            "NEXT_REDIRECT:/kaissou/tokyo"
        )

        expect(permanentRedirectMock).toHaveBeenCalledWith("/kaissou/tokyo")
        expect(constructMetadataMock).not.toHaveBeenCalled()
    })
})

describe("kaissou municipality route guards", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        findFirstMunicipalityMock.mockResolvedValue({
            id: 1,
            name: "渋谷区",
            prefectureName: "東京都",
            municipalitySlug: "shibuya",
            prefectureSlug: "tokyo",
            pdfUrl: null,
            url: null,
        })
        findManyScrivenerMock.mockResolvedValue([])
    })

    it("calls notFound for tokyo/unknown when municipality does not exist", async () => {
        findFirstMunicipalityMock.mockResolvedValueOnce(null)

        await expect(
            municipalityPage({
                params: Promise.resolve({ prefecture: "tokyo", municipality: "unknown" }),
            })
        ).rejects.toThrow("NEXT_NOT_FOUND")

        expect(notFoundMock).toHaveBeenCalledTimes(1)
    })

    it("calls notFound for invalid prefecture slug in municipality route", async () => {
        await expect(
            municipalityPage({
                params: Promise.resolve({ prefecture: "unknown", municipality: "shibuya" }),
            })
        ).rejects.toThrow("NEXT_NOT_FOUND")

        expect(notFoundMock).toHaveBeenCalledTimes(1)
        expect(findFirstMunicipalityMock).not.toHaveBeenCalled()
    })

    it("redirects encoded Tokyo slug in metadata when decoded to 東京", async () => {
        await expect(
            generateMunicipalityMetadata({
                params: Promise.resolve({ prefecture: "東京", municipality: "shibuya" }),
            })
        ).rejects.toThrow("NEXT_REDIRECT:/kaissou/tokyo/shibuya")

        expect(permanentRedirectMock).toHaveBeenCalledWith("/kaissou/tokyo/shibuya")
        expect(notFoundMock).not.toHaveBeenCalled()
        expect(constructMetadataMock).not.toHaveBeenCalled()
        expect(findFirstMunicipalityMock).toHaveBeenCalledTimes(1)
    })

    it("redirects Japanese municipality name to canonical slug", async () => {
        await expect(
            municipalityPage({
                params: Promise.resolve({ prefecture: "tokyo", municipality: "渋谷区" }),
            })
        ).rejects.toThrow("NEXT_REDIRECT:/kaissou/tokyo/shibuya")

        expect(permanentRedirectMock).toHaveBeenCalledWith("/kaissou/tokyo/shibuya")
        expect(notFoundMock).not.toHaveBeenCalled()
        expect(findFirstMunicipalityMock).toHaveBeenCalledWith({
            where: {
                prefectureSlug: "tokyo",
                name: "渋谷区",
                isPublished: true,
            },
        })
    })

    it("redirects Japanese prefecture and municipality names to canonical route", async () => {
        await expect(
            municipalityPage({
                params: Promise.resolve({ prefecture: "東京都", municipality: "渋谷区" }),
            })
        ).rejects.toThrow("NEXT_REDIRECT:/kaissou/tokyo/shibuya")

        expect(permanentRedirectMock).toHaveBeenCalledWith("/kaissou/tokyo/shibuya")
        expect(notFoundMock).not.toHaveBeenCalled()
    })

    it("calls notFound in metadata when municipality does not exist", async () => {
        findFirstMunicipalityMock.mockResolvedValueOnce(null)

        await expect(
            generateMunicipalityMetadata({
                params: Promise.resolve({ prefecture: "tokyo", municipality: "unknown" }),
            })
        ).rejects.toThrow("NEXT_NOT_FOUND")

        expect(notFoundMock).toHaveBeenCalledTimes(1)
    })

    it("propagates DB errors instead of swallowing them", async () => {
        const dbError = new Error("db failure")
        findFirstMunicipalityMock.mockRejectedValueOnce(dbError)

        await expect(
            municipalityPage({
                params: Promise.resolve({ prefecture: "tokyo", municipality: "shibuya" }),
            })
        ).rejects.toThrow("db failure")

        expect(notFoundMock).not.toHaveBeenCalled()
    })
})
