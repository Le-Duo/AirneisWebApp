import { useState, useEffect, useRef  } from 'react'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { ApiError } from '../types/APIError'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import { useGetUserByIdQuery, useUpdateUserMutation } from '../hooks/userHook'

export default function ProfilePage(){

    const userConnectedID  =  JSON.parse(localStorage.getItem('userInfo')!)._id
    const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID)

    const [ name, setName]= useState('')    
    const [ email, setEmail]= useState('')
    const formRef = useRef<HTMLFormElement>(null);
    const { mutateAsync: updateProfile } = useUpdateUserMutation(userConnectedID)


    useEffect(() => {
        if (user && user.name) {
          setName(user.name);
        }
        if (user && user.email) {
            setEmail(user.email);
          }
      }, [user]);

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error fetching one user</div>

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try { 
            await updateProfile({
                name : name,
                email: email,
                //phone
            })
    
        toast.success("Profile updated")
    
        } catch (err) {
          console.log(err)
            toast.error(getError(err as ApiError))
        } finally {
        //   setIsLoading(false)
        }
      }

    return (
        <Container className="small-container">
          <Helmet>
            <title>Profile</title>
          </Helmet>
          <h1 className="my-3">Profile</h1>
          <Form onSubmit={submitHandler}  ref={formRef}>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="input"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="input"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </Form.Group>
            
            <div className="mb-3">
              <Button
                type="submit"
            
                style={{ borderRadius: '100px' }}
              >
                Update
              </Button>
              {/* {isLoading && <LoadingBox />} */}
            </div>
          </Form>
        </Container>
      )
}

