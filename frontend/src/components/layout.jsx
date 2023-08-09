import { Inter } from 'next/font/google'

import Header from '@/components/header'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export default function Home({children}) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 px-4 sm:px-12 md:p-24 ${inter.className}`}
    >
      <Header />
      <div className="grow flex flex-col">
        <div className="flex flex-col grow items-center justify-center min-h-[32rem] lg:min-h-0">
            {children}
        </div>
        <Footer/>
      </div>
    </main>
  )
}
