import { shallowMount } from '@vue/test-utils'
import Entry from '@/modules/daybook/components/Entry'
import { journalState } from '../../../mock-data/test-journal-state'

describe('Pruebas en Entry Component', () => {
    const mockRouter = {
        push: jest.fn(),
    }

    const wrapper = shallowMount(Entry, {
        propsData: {
            entry: journalState.entries[0],
        },
        global: {
            mocks: {
                $router: mockRouter,
            },
        },
    })

    test('debe de hacer match con el snaptshot', () => {
        expect(wrapper.html()).toMatchSnapshot()
    })

    test('debe de redireccionar al hacer click en el entry-container', () => {
        const entryContainer = wrapper.find('.entry-container')
        entryContainer.trigger('click')
        expect(mockRouter.push).toHaveBeenCalledWith({
            name: 'entry',
            params: {
                id: journalState.entries[0].id,
            },
        })
    })

    test('pruebas en las propiedades computadas', () => {
        expect(wrapper.vm.day).toBe(23)
        expect(wrapper.vm.month).toBe('Mayo')
        expect(wrapper.vm.yearDay).toBe('2022, Lunes')
    })
})
