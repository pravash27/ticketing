import {useState} from 'react'
import axios from 'axios'
import useRequest from '../hooks/use-request'
import Redirect from 'next/router'
export default () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {doRequest, errors} = useRequest();
    const onSubmit = async (e) => {
        e.preventDefault();
        const onSuccess = () => {
            Redirect.push('/')
        }
        doRequest('/api/users/signup','post',{email,password},onSuccess)
    }
    return <div className="container">
                <form>
                    <h1>Signup</h1>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            type="password" 
                            className="form-control"
                        />
                    </div>
                    {errors}
                    <br/>
                    <button onClick={onSubmit} className="btn btn-primary">Sign Up</button>
                </form>
            </div>
}