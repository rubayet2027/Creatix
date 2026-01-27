import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import AllContests from '../pages/AllContests'
import Leaderboard from '../pages/Leaderboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import About from '../pages/About'
import Dashboard from '../pages/Dashboard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="all-contests" element={<AllContests />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}
