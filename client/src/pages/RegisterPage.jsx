import { useState } from 'react'
import axios from 'axios'
import '../styles/FormStyles.css'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import OtpValidationPage from './OtpValidationPage.jsx'
import { COLORS } from '../styles/color'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mobile, setMobile] = useState('')

  const [isFormValid, setIsFormValid] = useState(true)
  const [showOtpPage, setShowOtpPage] = useState(false)

  const navigate = useNavigate()

  const register = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      setIsFormValid(false)
      // console.log(showOtpPage)
    }
    try {
      const { data } = await axios.post('/users/register', {
        name,
        email,
        password,
        mobile,
      })

      // console.log(data)
      if (data.success) {
        alert(`an otp is send to ${mobile}, valid for 10 min`)
        setShowOtpPage(true)
      } else {
        alert('something went wrong!')
        navigate('/register')
      }
    } catch (error) {
      // console.log('something went wrong during registration ' + error)
      alert('Registration failed')
      navigate('/register')
    }
  }

  return (
    <>
      {showOtpPage ? (
        <OtpValidationPage
          name={name}
          email={email}
          password={password}
          mobile={mobile}
          setShowOtpPage={setShowOtpPage}
        />
      ) : (
        <div
          className=" p-4 w-full h-screen flex justify-center text-white flex-col pb-10 items-center gap-5"
          style={{ background: COLORS.GRADIENT }}
        >
          <div className="border my-auto md:my-0  rounded-lg py-4 px-6  w-96 flex flex-col bg-white text-black">
            <h1
              className="text-3xl font-bold"
              style={{ color: COLORS.BACKGROUND }}
            >
              Create Account
            </h1>
            <form onSubmit={register} className="flex flex-col mt-3">
              <FormInput
                label="Your Name"
                type="text"
                name="name"
                placeholder="First and last name"
                value={name}
                errorMessage="Username should be 3-16 characters and shouldn't include any special character!"
                pattern="^[A-Za-z\s]{3,16}$"
                onchange={setName}
                isFormValid={isFormValid}
              />

              <FormInput
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                errorMessage="enter a valid email!"
                onchange={setEmail}
                isFormValid={isFormValid}
              />

              <FormInput
                label="Mobile number"
                type="tel"
                name="mobile"
                placeholder="Your mobile number"
                errorMessage="enter a valid mobile number!"
                value={mobile}
                onchange={setMobile}
                pattern="^[6-9]\d{9}$"
                isFormValid={isFormValid}
              />

              <FormInput
                label="Password"
                type="password"
                name="password"
                errorMessage="Password should be 6-16 characters and should contain letter,number and special characters!"
                placeholder="At-least 6 characters"
                value={password}
                onchange={setPassword}
                pattern="^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$"
                isFormValid={isFormValid}
              />

              <FormInput
                label="Re-enter password"
                type="password"
                name="confirmPassword"
                placeholder="At-least 6 characters"
                errorMessage="Passwords should match!"
                value={confirmPassword}
                pattern={password}
                onchange={setConfirmPassword}
                isFormValid={isFormValid}
              />

              <button
                className="w-full py-2 text-white font-bold rounded-lg  text-sm mt-5 hover:bg-red-800"
                style={{ background: COLORS.GRADIENT }}
              >
                Continue
              </button>
            </form>

            <hr className="my-8 border-t-2 border-gray-200" />

            <p className=" text-center -mt-2 mb-5 text-md font-normal">
              Already have an account?{''}
              <Link
                to="/login"
                className="text-purple-800  p-1 rounded-xl italic font-semibold  hover:text-purple-800 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
export default RegisterPage
