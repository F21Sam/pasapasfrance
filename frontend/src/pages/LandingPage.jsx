import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import {
  MarqueeSection, StatsSection, ProcessSection,
  ProfilesSection, BentoSection, CTASection, FooterSection
} from '@/components/sections/LandingSections'

export default function LandingPage() {
  return (
    <>
      <Navbar transparent />
      <HeroSection />
      <MarqueeSection />
      <StatsSection />
      <ProcessSection />
      <ProfilesSection />
      <BentoSection />
      <CTASection />
      <FooterSection />
    </>
  )
}
