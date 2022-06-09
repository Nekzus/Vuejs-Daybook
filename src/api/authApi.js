import axios from 'axios'

const authApi = axios.create({
    baseURL: 'https://identitytoolkit.googleapis.com/v1/accounts',
    params: {
        key: 'AIzaSyBcAE_3oQvnGPdY5MbBOJ1KGr2_W4LnbKo',
    },
})

// console.log(process.env.NODE_ENV) // TEST durante testing

export default authApi