import { useState } from 'react'
import axios from 'axios'
import './../styles/FormStyles.css'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import { COLORS } from '../styles/color'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isFormValid, setIsFormValid] = useState(true)

  const navigate = useNavigate()

  const login = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      setIsFormValid(false)
    }
    try {
      const { data } = await axios.post('/users/login', {
        email,
        password,
      })

      // console.log(data)
      if (data.success) {
        alert(`login successful`)
        navigate('/')
      } else {
        alert('invalid email or password')
        navigate('/login')
      }
    } catch (error) {
      // console.log('something went wrong during login ' + error)
      alert('login failed,try again')
      navigate('/login')
    }
  }

  return (
    <div
      className="h-screen p-4 w-full flex justify-center text-black  flex-col pb-10 items-center gap-5"
      style={{ background: COLORS.GRADIENT }}
    >
      {/* <div className="al">
        <img src="/logo.png" className="h-32 -mb-5 " alt="amazon logo" />
      </div> */}
      <div className="border my-auto md:my-0 bg-white  rounded-lg py-4 px-4  w-80 flex flex-col">
        <h1 className="text-3xl font-bold" style={{ color: COLORS.BACKGROUND }}>
          Sign in
        </h1>
        <form onSubmit={login} className="flex flex-col mt-3">
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

          <button
            className="w-full py-2 text-white rounded-lg font-bold  text-sm mt-5 hover:bg-red-800"
            style={{ background: COLORS.GRADIENT }}
          >
            Login
          </button>
        </form>

        <hr className="my-8 border-t-2 border-gray-200" />

        <p className=" text-center -mt-2 mb-5 text-md font-normal">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-purple-800 p-1 rounded-xl italic font-semibold  hover:text-purple-800 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
export default LoginPage
