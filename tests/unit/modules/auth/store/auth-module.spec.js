import axios from 'axios'
import createVuexStore from '../../../mock-data/mock-store'

describe('Vuex: Pruebas en el auth-module', () => {
    test('estado inicial', () => {
        const store = createVuexStore({
            status: 'authenticating', // 'authenticated','not-authenticated', 'authenticating'
            user: null,
            idToken: null,
            refreshToken: null,
        })
        const { status, user, idToken, refreshToken } = store.state.auth
        expect(status).toBe('authenticating')
        expect(user).toBe(null)
        expect(idToken).toBe(null)
        expect(refreshToken).toBe(null)
    })

    // Mutations
    test('Mutations: loginUser', () => {
        const store = createVuexStore({
            status: 'authenticating', // 'authenticated','not-authenticated', 'authenticating'
            user: null,
            idToken: null,
            refreshToken: null,
        })
        const payload = {
            user: { name: 'Mauricio', email: 'mauricio@gmail.com' },
            idToken: 'ABC-123',
            refreshToken: 'XYZ-456',
        }
        store.commit('auth/loginUser', payload)
        const { status, user, idToken, refreshToken } = store.state.auth
        expect(status).toBe('authenticated')
        expect(user).toEqual({ name: 'Mauricio', email: 'mauricio@gmail.com' })
        expect(idToken).toBe('ABC-123')
        expect(refreshToken).toBe('XYZ-456')
    })

    test('Mutations: logout', () => {
        localStorage.getItem('refreshToken', 'ABC-321')
        localStorage.getItem('idToken', 'XYZ-654')
        const store = createVuexStore({
            status: 'authenticated', // 'authenticated','not-authenticated', 'authenticating'
            user: { name: 'Mauricio', email: 'mauricio@gmail.com' },
            idToken: 'ABC-123',
            refreshToken: 'XYZ-456',
        })
        store.commit('auth/logout')
        const { status, user, idToken, refreshToken } = store.state.auth
        expect(status).toBe('not-authenticated')
        expect(user).toBeFalsy()
        expect(idToken).toBeFalsy()
        expect(refreshToken).toBeFalsy()
        expect(localStorage.getItem('idToken')).toBeFalsy()
        expect(localStorage.getItem('refreshToken')).toBeFalsy()
    })

    // Getters
    test('Getters: username currentState', () => {
        const store = createVuexStore({
            status: 'authenticated', // 'authenticated','not-authenticated', 'authenticating'
            user: { name: 'Mauricio', email: 'mauricio@gmail.com' },
            idToken: 'ABC-123',
            refreshToken: 'XYZ-456',
        })
        expect(store.getters['auth/currentState']).toBe('authenticated')
        expect(store.getters['auth/username']).toBe('Mauricio')
    })

    // Actions
    test('Actions: createUser - Error usuario ya existe', async() => {
        const store = createVuexStore({
            status: 'not-authenticated', // 'authenticated','not-authenticated', 'authenticating'
            user: null,
            idToken: null,
            refreshToken: null,
        })
        const newUser = {
            name: 'Test User',
            email: 'test@test.com',
            password: '123456',
        }
        const resp = await store.dispatch('auth/createUser', newUser)
        expect(resp).toEqual({ ok: false, message: 'EMAIL_EXISTS' })
        const { status, user, idToken, refreshToken } = store.state.auth
        expect(status).toBe('not-authenticated')
        expect(user).toBeFalsy()
        expect(idToken).toBeFalsy()
        expect(refreshToken).toBeFalsy()
    })

    test('Actions: createUser signInUser - Crea el usuario', async() => {
        const store = createVuexStore({
            status: 'not-authenticated', // 'authenticated','not-authenticated', 'authenticating'
            user: null,
            idToken: null,
            refreshToken: null,
        })
        const newUser = {
                name: 'Test User',
                email: 'test2@test.com',
                password: '123456',
            }
            // SignIn del usuario
        await store.dispatch('auth/signInUser', newUser)
        const { idToken } = store.state.auth
            // Borrar el usuario
        const deleteResp = axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyBcAE_3oQvnGPdY5MbBOJ1KGr2_W4LnbKo`, {
                    idToken,
                },
            )
            // Crear el usuario
        const resp = await store.dispatch('auth/createUser', newUser)
        expect(resp).toEqual({ ok: true })
        const { status, user, idToken: token, refreshToken } = store.state.auth
        expect(status).toBe('authenticated')
        expect(user).toEqual({
            name: 'Test User',
            email: 'test2@test.com',
        })
        expect(typeof token).toBe('string')
        expect(typeof refreshToken).toBe('string')
    })
    test('Actions: checkAuthentication - POSITIVA', async() => {
        const store = createVuexStore({
                status: 'not-authenticated', // 'authenticated','not-authenticated', 'authenticating'
                user: null,
                idToken: null,
                refreshToken: null,
            })
            // SignIn del usuario
        const signInResp = await store.dispatch('auth/signInUser', {
            email: 'test@test.com',
            password: '123456',
        })
        const { idToken } = store.state.auth
        store.commit('auth/logout')

        localStorage.setItem('idToken', idToken)
        const checkResp = await store.dispatch('auth/checkAuthentication')
        expect(checkResp.ok).toBeTruthy()
        const { status, user, idToken: token, refreshToken } = store.state.auth
        expect(status).toBe('authenticated')
        expect(user).toEqual({
            name: 'User Test',
            email: 'test@test.com',
        })
        expect(typeof token).toBe('string')
    })
    test('Actions: checkAuthentication - NEGATIVA', async() => {
        const store = createVuexStore({
            status: 'authenticating', // 'authenticated','not-authenticated', 'authenticating'
            user: null,
            idToken: null,
            refreshToken: null,
        })

        localStorage.removeItem('idToken')
        const checkResp1 = await store.dispatch('auth/checkAuthentication')
        expect(checkResp1).toEqual({ ok: false, message: 'No hay token' })
        expect(store.state.auth.user).toBeFalsy()
        expect(store.state.auth.idToken).toBeFalsy()
        expect(store.state.auth.refreshToken).toBeFalsy()
        expect(store.state.auth.status).toBe('not-authenticated')

        localStorage.setItem('idToken', 'ABC-123')
        const checkResp2 = await store.dispatch('auth/checkAuthentication')
        expect(checkResp2).toEqual({ ok: false, message: 'INVALID_ID_TOKEN' })
        expect(store.state.auth.status).toBe('not-authenticated')
    })
})