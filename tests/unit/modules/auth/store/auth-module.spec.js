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
})