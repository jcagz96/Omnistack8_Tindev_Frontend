import axios from 'axios'

/*
const api = axios.create({
    baseURL: 'http://localhost:3333'
})
*/

const api = axios.create({
    baseURL: 'https://hidden-mountain-22247.herokuapp.com'
})

export default api