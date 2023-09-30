import axios from "axios"
import { useState } from "react"
export default () => {
    const [errors, setErrors] = useState(null)
    const doRequest = async (url,method,body,success) => {
        try{
            const response = await axios[method](url,body)
            console.log(response.data)
            setErrors(null)
            success()
            return response.data
        }catch(err){
            setErrors(
                <div className='alert alert-danger'>
                    <h4>Oops......</h4>
                    <ul>
                        {err.response.data.map(error => <li key={error.message}>{error.message}</li>)}
                    </ul>
                </div>
            )
        }
    }

    return {doRequest, errors}
}