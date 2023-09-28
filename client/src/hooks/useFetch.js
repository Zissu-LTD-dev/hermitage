// useFetch with axios and async/await end optional params
import { useState, useEffect } from 'react'
import axios from 'axios'

// config axios with base url and headers
axios.defaults.baseURL = 'http://localhost:5000/api/v1/'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'

export const useFetch = (url, options) => {
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const res = await axios(url, options)
                const json = await res.data
                setResponse(json)
                setIsSuccess(true)
            } catch (error) {
                setError(error)
            }
            setIsLoading(false)
        }
        fetchData()
    }, [options, url])

    return { response, error, isLoading, isSuccess }
}
