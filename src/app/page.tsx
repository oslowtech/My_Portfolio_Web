import { HeroSection } from '@/components/sections/HeroSection'
import { SystemsGridSection } from '@/components/sections/SystemsGridSection'
import { AboutSnippet } from '@/components/sections/AboutSnippet'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SystemsGridSection />
      <AboutSnippet />
    </>
  )
}
