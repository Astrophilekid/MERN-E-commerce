import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const navigate = useNavigate()

  const resetPassword = async () => {
    try {
      const { data } = await axios.post('/users/reset-password', {
        resetToken,
        newPassword,
      })
      console.log(data)
      if (data.success) {
        alert('password changed successfully')
        navigate('/login')
      } else {
        alert('password change failed')
      }
    } catch (error) {}
  }

  return (
    <div className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-violet-50">
      <div className="w-4/5 sm:w-3/5 md:w-2/5 lg:w-4/12 xl:w-3/12 h-ft r p-5 flex flex-col bg-violet-200 rounded-md gap-y-5">
        <h1 className="lg:text-lg font-medium">
          Confirm token and enter new password
        </h1>
        <input
          type="text"
          placeholder="enter the token"
          onChange={(e) => setResetToken(e.target.value)}
        />
        <input
          type="password"
          placeholder="enter new password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          className="w-full h-10 rounded-lg font-bold text-lg text-gray-300 hover:text-white bg-secondary active:scale-95 transition-all"
          onClick={resetPassword}
        >
          Change password
        </button>
      </div>
    </div>
  )
}
export default ResetPassword
