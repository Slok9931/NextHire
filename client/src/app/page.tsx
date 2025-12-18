"use client"
import CareerGuide from '@/components/careerGuide'
import Hero from '@/components/hero'
import Loading from '@/components/loading'
import ResumeAnalyzer from '@/components/resumeAnalyser'
import { useAppData } from '@/context/AppContext'
import React from 'react'

const Home = () => {
  const { loading } = useAppData()
  if (loading) return <Loading />
  return (
    <div>
      <Hero />
      <CareerGuide />
      <ResumeAnalyzer />
    </div>
  )
}

export default Home
