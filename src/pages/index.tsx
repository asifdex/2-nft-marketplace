import Footer from '@/components/footer/Footer'
import Hero from '@/components/Home/Hero'


import Services from '@/components/SECTION.tsx/Services'
import Transactions from '@/components/SECTION.tsx/Transactions'
import React from 'react'

const index = () => {
  return (
    <div className="min-h-screen">
    <div className="bg-[#161616] h-42">
      <Hero />
    </div>
    <Services />
    <Transactions />
  </div>
  )
}

export default index

