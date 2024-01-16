import { useEffect, useState } from 'react'
import { fetchUserData, updateUserData } from '../../../../services/api'
import { useQuery } from 'react-query'
import { useAuth } from '../../../modules/auth'

interface FormData {
  username: string
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
    username: userProfileData?.username
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
      console.log('From', formData)
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
      username: userProfileData?.username
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
          {
            title: 'Name',
            fieldName: 'username',
            // icon: faUser,
            placeholder: 'Enter your name',
          },
          {
            title: 'Email',
            fieldName: 'email',
            // icon: faEnvelope,
            placeholder: 'Enter your email',
          },
          {
            title: 'Profile Description',
            fieldName: 'profileDescription',
            // icon: faInfoCircle,
            placeholder: 'Enter your profile description',
          },
          {
            title: 'Facebook',
            fieldName: 'facebookLink',
            // icon: faFacebook,
            placeholder: 'Enter your Facebook link',
          },
          {
            title: 'Twitter',
            fieldName: 'twitterLink',
            // icon: faTwitter,
            placeholder: 'Enter your Twitter link',
          },
          {
            title: 'LinkedIn',
            fieldName: 'linkedinLink',
            // icon: faLinkedin,
            placeholder: 'Enter your LinkedIn link',
          },
        ].map((item, index) => (
          <div key={item.fieldName} className='mb-10'>
            <label
              htmlFor={`input_${item.fieldName}`}
              className={`${
                index < 2 ? 'required' : ''
              } form-label d-flex align-items-center`}
            >
              {/* <FontAwesomeIcon icon={item.icon} className='me-2' /> */}
              {item.title}
            </label>
            <input
              type='text'
              className='form-control form-control-solid'
              id={`input_${item.fieldName}`}
              name={item.fieldName}
              value={formData[item.fieldName]}
              onChange={handleInputChange}
              placeholder={item.placeholder}
              required={index < 2}
              readOnly={index < 2}
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
          className='btn btn-primary w-100 mt-20 mx-auto'
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}
