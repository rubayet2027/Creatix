import React from 'react'

export default function ContestCard({ contest }) {
  return (
    <div className="bg-[var(--card)] rounded-2xl shadow p-4 flex flex-col">
      <div className="h-40 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
        <img src={contest.image} alt={contest.name} className="object-cover w-full h-full" />
      </div>
      <div className="mt-3 flex-1">
        <h4 className="font-semibold">{contest.name}</h4>
        <p className="text-sm text-[var(--muted)] mt-2">{contest.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-[var(--muted)]">{contest.participants} participants</div>
        <button className="px-3 py-1 rounded-md bg-primary text-white text-sm">Details</button>
      </div>
    </div>
  )
}
