import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Finansal Takip</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
