import axios from 'axios'

const journalApi = axios.create({
    baseURL: 'https://vue-demos-41bd3-default-rtdb.firebaseio.com'
})

export default journalApi