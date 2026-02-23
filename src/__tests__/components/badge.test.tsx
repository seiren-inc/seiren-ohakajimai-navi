import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
    it('renders correctly with default variant', () => {
        render(<Badge>Test Badge</Badge>)
        const badge = screen.getByText('Test Badge')
        expect(badge).toBeInTheDocument()
        // Verify it has the default variant classes (e.g. bg-primary)
        expect(badge.className).toContain('bg-primary')
    })

    it('renders correctly with destructive variant', () => {
        render(<Badge variant="destructive">Error Badge</Badge>)
        const badge = screen.getByText('Error Badge')
        expect(badge).toBeInTheDocument()
        // Verify destructive class exists
        expect(badge.className).toContain('bg-destructive')
    })

    it('renders correctly with outline variant', () => {
        render(<Badge variant="outline">Outline Badge</Badge>)
        const badge = screen.getByText('Outline Badge')
        expect(badge).toBeInTheDocument()
        expect(badge.className).toContain('border')
    })
})
