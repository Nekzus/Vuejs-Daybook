import { useStore } from 'vuex'

const useAuth = () => {
    const store = useStore()
    const createUser = async user => {
        const resp = await store.dispatch('auth/createUser', user)
        return resp
    }

    const logInUser = async user => {
        const resp = await store.dispatch('auth/signInUser', user)
        return resp
    }

    return {
        createUser,
        logInUser,
    }
}
export default useAuth