import useAuth from '@/modules/auth/composables/useAuth'

const mockStore = {
    dispatch: jest.fn(),
    // Commit
    // Getters
}

jest.mock('vuex', () => ({
    useStore: () => mockStore,
}))

describe('Pruebas en useAuth', () => {
    beforeEach(() => jest.clearAllMocks())

    test('createUser exitoso', async() => {
        const { createUser } = useAuth()
        const newUser = {
            name: 'Sebastián',
            email: 'sebastian@gmail.com',
            password: '123456',
        }
        mockStore.dispatch.mockReturnValue({ ok: true })
        const resp = await createUser(newUser)
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            'auth/createUser',
            newUser,
        )
        expect(resp.ok).toBeTruthy()
    })

    test('createUser fallido', async() => {
        const { createUser } = useAuth()
        const newUser = {
            name: 'Sebastián',
            email: 'sebastian@gmail.com',
            password: '123456',
        }
        mockStore.dispatch.mockReturnValue({
            ok: false,
            message: 'EMAIL_EXISTS',
        })
        const resp = await createUser(newUser)
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            'auth/createUser',
            newUser,
        )
        expect(resp).toEqual({ ok: false, message: 'EMAIL_EXISTS' })
    })

    test('loginUser exitoso', async() => {
        const { loginUser } = useAuth()
        const loginForm = {
            email: 'test@test.com',
            password: '123456',
        }
        mockStore.dispatch.mockReturnValue({ ok: true })
        const resp = await loginUser(loginForm)
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            'auth/signInUser',
            loginForm,
        )
        expect(resp.ok).toBeTruthy()
    })

    test('loginUser fallido', async() => {
        const { loginUser } = useAuth()
        const loginForm = {
            email: 'test@test.com',
            password: '123456',
        }
        mockStore.dispatch.mockReturnValue({
            ok: false,
            message: 'EMAIL/PASSWORD do not exist',
        })
        const resp = await loginUser(loginForm)
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            'auth/signInUser',
            loginForm,
        )
        expect(resp).toEqual({
            ok: false,
            message: 'EMAIL/PASSWORD do not exist',
        })
    })

    test('checkAuthStatus exitoso', async() => {
        const { checkAuthStatus } = useAuth()
        mockStore.dispatch.mockReturnValue({ ok: true })
        const resp = await checkAuthStatus()
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            'auth/checkAuthentication',
        )
        expect(resp.ok).toBeTruthy()
    })

    test('checkAuthStatus fallido', async() => {
        const { checkAuthStatus } = useAuth()
        mockStore.dispatch.mockReturnValue({ ok: false, message: 'NO_AUTH' })
        const resp = await checkAuthStatus()
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            'auth/checkAuthentication',
        )
        expect(resp).toEqual({ ok: false, message: 'NO_AUTH' })
    })
})