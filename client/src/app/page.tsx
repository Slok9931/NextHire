import CareerGuide from '@/components/careerGuide'
import Hero from '@/components/hero'
import ResumeAnalyzer from '@/components/resumeAnalyser'
import { Button } from '@/components/ui/button'
import React from 'react'

const Home = () => {
  return (
    <div>
      <Hero />
      <CareerGuide />
      <ResumeAnalyzer />
    </div>
  )
}

export default Home
