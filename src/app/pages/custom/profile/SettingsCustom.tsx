import { useEffect, useState } from 'react'
import { fetchUserData, updateUserData } from '../../../../services/api'
import { useQuery } from 'react-query'
import { useAuth } from '../../../modules/auth'

interface FormData {
  userName: string
  email: string
  profileDescription: string
  facebookLink: string
  twitterLink: string
  linkedinLink: string
  [key: string]: string
}

export const SettingsCustom = () => {
  const { currentUser } = useAuth()
  const { data: profileData, refetch: refetchUserData } = useQuery(
    'profileData',
    () => fetchUserData(currentUser?.firebaseUserId ?? ''),
    {
      enabled: !!currentUser,
    }
  )
  const userProfileData = profileData?.data

  const [formData, setFormData] = useState<FormData>({
    userName: userProfileData?.username
      ? userProfileData?.username
      : userProfileData?.displayName,
    email: userProfileData?.email,
    profileDescription: userProfileData?.profileDescription,
    facebookLink: userProfileData?.facebookLink,
    twitterLink: userProfileData?.twitterLink,
    linkedinLink: userProfileData?.linkedinLink,
  })

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Call the API function to update user data
      await updateUserData(formData)

      // Refetch user data to display updated information
      await refetchUserData()

      setSuccessMessage('Profile updated successfully!')
      setErrorMessage('')

      setTimeout(() => {
        setSuccessMessage('')
      }, 4000)
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.')
      setSuccessMessage('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFormData({
      userName: userProfileData?.username
        ? userProfileData?.username
        : userProfileData?.displayName,
      email: userProfileData?.email,
      profileDescription: userProfileData?.profileDescription,
      facebookLink: userProfileData?.facebookLink,
      twitterLink: userProfileData?.twitterLink,
      linkedinLink: userProfileData?.linkedinLink,
    })
  }, [profileData])

  return (
    <div className='w-50 mx-auto my-20'>
      <form onSubmit={handleSubmit}>
        {[
          { title: 'Name', fieldName: 'userName' },
          { title: 'Email', fieldName: 'email' },
          { title: 'Profile Description', fieldName: 'profileDescription' },
          { title: 'Facebook', fieldName: 'facebookLink' },
          { title: 'Twitter', fieldName: 'twitterLink' },
          { title: 'LinkedIn', fieldName: 'linkedinLink' },
        ].map((item, index) => (
          <div key={item.fieldName} className='mb-10'>
            <label
              htmlFor={`input_${item.fieldName}`}
              className={`${index < 2 ? 'required' : ''} form-label`}
            >
              {item.title}
            </label>
            <input
              type='text'
              className='form-control form-control-solid'
              id={`input_${item.fieldName}`}
              name={item.fieldName}
              value={formData[item.fieldName]}
              onChange={handleInputChange}
              placeholder={`Enter ${item.title}`}
              required={index < 2}
            />
          </div>
        ))}

        {errorMessage && (
          <div className='alert alert-danger' role='alert'>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className='alert alert-success' role='alert'>
            {successMessage}
          </div>
        )}

        <button
          type='submit'
          className='btn btn-primary w-100 mx-auto'
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}
