import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const forgotPassword = async () => {
    try {
      const { data } = await axios.post('/users/forgot-password', { email })
      if (data.success) {
        console.log(data)
        alert('token valid for only 10 minutes')
        navigate('/reset-password')
      }
    } catch (error) {}
  }

  return (
    <div className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-violet-50">
      <div className="w-4/5 sm:w-3/5 md:w-2/5 lg:w-4/12 xl:w-3/12 h-52 r p-5 flex flex-col bg-violet-200 rounded-md gap-y-5 border-purple-200 border shadow-xl">
        <h1 className="lg:text-lg font-medium">
          Forgot password? confirm your email to proceed
        </h1>
        <input
          type="email"
          placeholder="enter your current email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-full h-10 rounded-lg font-bold text-lg text-gray-300 hover:text-white bg-secondary active:scale-95 transition-all"
          disabled={!email}
          onClick={forgotPassword}
        >
          submit
        </button>
      </div>
    </div>
  )
}
export default ForgotPassword
