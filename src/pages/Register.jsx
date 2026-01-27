import React from 'react'
import { useForm } from 'react-hook-form'

export default function Register() {
  const { register, handleSubmit } = useForm()
  const onSubmit = data => {
    // UI-only
    alert('Registration submitted')
  }

  return (
    <div className="pt-28 pb-12">
      <div className="max-w-md mx-auto px-4">
        <h2 className="text-2xl font-semibold">Create your Creatix account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <input {...register('name')} placeholder="Full name" className="w-full px-4 py-3 rounded-md bg-[var(--card)] border" />
          <input {...register('email')} placeholder="Email" className="w-full px-4 py-3 rounded-md bg-[var(--card)] border" />
          <input {...register('password')} type="password" placeholder="Password" className="w-full px-4 py-3 rounded-md bg-[var(--card)] border" />
          <button className="w-full py-3 rounded-md bg-primary text-white">Create account</button>
        </form>
      </div>
    </div>
  )
}
import React from 'react'
import { useForm } from 'react-hook-form'

export default function Register() {
  const { register, handleSubmit } = useForm()
  const onSubmit = data => alert('Register submitted')

  return (
    <div className="pt-28 pb-12">
      <div className="max-w-md mx-auto px-4">
        <h2 className="text-2xl font-semibold">Create your Creatix account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <input {...register('name')} placeholder="Full name" className="w-full px-4 py-3 rounded-md bg-[var(--card)] border" />
          <input {...register('email')} placeholder="Email" className="w-full px-4 py-3 rounded-md bg-[var(--card)] border" />
          <input {...register('password')} type="password" placeholder="Password" className="w-full px-4 py-3 rounded-md bg-[var(--card)] border" />
          <button className="w-full py-3 rounded-md bg-primary text-white">Create account</button>
        </form>
      </div>
    </div>
  )
}
