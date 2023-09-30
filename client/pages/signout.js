import {useEffect} from 'react'
import useRequest from '../hooks/use-request'
import Redirect from 'next/router'
export default () => {
    const {doRequest, errors} = useRequest();
    useEffect(() => {
        const onSuccess = () => {
            Redirect.push('/')
        }
        doRequest('/api/users/signout','get',{},onSuccess)
    },[])
    return <div className="container">
                <h1>Signing out........</h1>
            </div>
}