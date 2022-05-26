import { shallowMount } from '@vue/test-utils'
import HomeView from '@/views/HomeView'

describe('pruebas en el HomeView', () => {
    test('debe de renderizar el componente correctamente', () => {
        const wrapper = shallowMount(HomeView)
        expect(wrapper.html()).toMatchSnapshot()
    })

    test('hacer click en un boton debe de redireccionar a no-entry', () => {
        const mockRouter = {
            push: jest.fn(),
        }
        const wrapper = shallowMount(HomeView, {
            global: {
                mocks: {
                    $router: mockRouter,
                },
            },
        })
        wrapper.find('button').trigger('click')
        expect(mockRouter.push).toHaveBeenCalled()
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'no-entry' })
    })
})
