import axios from 'axios'

const instance = axios.create({
    // baseURL:"https://api.tirutsava.org"
    baseURL:"http://localhost:8800" 
})

export default instance