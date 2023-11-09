import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import { COLORS } from '../styles/color.js'

const OtpValidationPage = ({
  name,
  email,
  password,
  mobile,
  setShowOtpPage,
}) => {
  const [otp, setOtp] = useState('')
  const [isFormValid, setIsFormValid] = useState(true)

  const navigate = useNavigate()

  const validateOTP = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      setIsFormValid(false)
    }
    try {
      const { data } = await axios.post('/users/verify-otp', {
        name,
        email,
        password,
        mobile,
        otp,
      })

      console.log(data)
      if (data.success) {
        alert(`Registration successful`)
        navigate('/login')
      } else {
        alert(`OTP verification failed, wrong or expired`)
        navigate('/register')
      }
    } catch (error) {
      console.log('otp verification failed ' + error)
      alert('otp verification failed ')
      navigate('/register')
    }
  }

  return (
    <div
      className="h-screen p-4 w-full flex text-white flex-col pb-10 items-center gap-5"
      style={{ background: COLORS.GRADIENT }}
    >
      {/* <div className="al">
        <img src="/logo.png" className="h-40 -mb-5 " alt="amazon logo" />
      </div> */}
      <div className="border my-auto text-black bg-white rounded-lg py-4 px-4  w-80 flex flex-col">
        <h1
          className="text-[1.7rem] font-medium"
          style={{ color: COLORS.BACKGROUND }}
        >
          Enter OTP
        </h1>
        <form onSubmit={validateOTP} className="flex flex-col mt-3">
          <FormInput
            label="Enter the OTP"
            type="text"
            name="otp"
            placeholder="enter the otp"
            value={otp}
            errorMessage="enter the valid otp"
            pattern="[0-9]{4}"
            onchange={setOtp}
            isFormValid={isFormValid}
          />
          <button
            className="w-full py-2 text-white font-bold rounded-lg  text-sm mt-5 hover:bg-red-800"
            style={{ background: COLORS.GRADIENT }}
          >
            Submit
          </button>
        </form>

        <hr className="mt-8 border-t-2 border-gray-200" />
        <p className="text-red-600  text-center text-sm font-semibold my-3">
          otp is valid for only 10 min!
        </p>
        <div className="flex text-xs text-gray-500 font-medium gap-x-1">
          {'989776234'}
          <p
            className="italic text-blue-500 underline cursor-pointer"
            onClick={() => {
              setShowOtpPage(false)
            }}
          >
            change number?
          </p>
        </div>
      </div>
    </div>
  )
}
export default OtpValidationPage
