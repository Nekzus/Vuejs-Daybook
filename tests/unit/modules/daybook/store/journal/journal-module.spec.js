import { createStore } from 'vuex'
import journal from '@/modules/daybook/store/journal'
import { journalState } from '../../../../mock-data/test-journal-state'

const createVuexStore = initialState =>
    createStore({
        modules: {
            journal: {
                ...journal,
                state: { ...initialState },
            },
        },
    })

describe('Vuex - Pruebas en el Journal Module', () => {
    test('este es el estado inicial, debe de tener este state', () => {
        const store = createVuexStore(journalState)
        const { isLoading, entries } = store.state.journal
        expect(isLoading).toBeFalsy()
        expect(entries).toEqual(journalState.entries)
    })

    test('mutations: setEntries', () => {
        const store = createVuexStore({ isLoading: true, entries: [] })
        store.commit('journal/setEntries', journalState.entries)
        expect(store.state.journal.entries.length).toBe(2)
        store.commit('journal/setEntries', journalState.entries)
        expect(store.state.journal.entries.length).toBe(4)
        expect(store.state.journal.isLoading).toBeFalsy()
    })
    test('mutations: updateEntry', () => {
        const store = createVuexStore(journalState)
        const updatedEntry = {
            id: '-N2muSDCOVOu9WkgI0qT',
            date: 1653342830693,
            picture:
                'https://res.cloudinary.com/dsvsl0b0b/image/upload/v1653346811/kyz4dgbahmaimyyo1pp4.jpg',
            text: 'Hola mundo desde mock pruebas',
        }
        const storeEntries = store.state.journal.entries
        store.commit('journal/updateEntry', updatedEntry)
        expect(storeEntries.length).toBe(2)
        expect(storeEntries.find(e => e.id === updatedEntry.id)).toEqual(
            updatedEntry,
        )
    })
    test('mutations: addEntry - deleteEntry', () => {
        const store = createVuexStore(journalState)
        store.commit('journal/addEntry', { id: 'ABC-123', text: 'Hola Mundo' })
        const stateEntries = store.state.journal.entries
        expect(stateEntries.length).toBe(3)
        expect(stateEntries.find(e => e.id === 'ABC-123')).toBeTruthy()
        store.commit('journal/deleteEntry', 'ABC-123')
        expect(store.state.journal.entries.length).toBe(2)
        expect(
            store.state.journal.entries.find(e => e.id === 'ABC-123'),
        ).toBeFalsy()
    })

    test('getters: getEntriesByTerm - getEntriesById ', () => {
        const store = createVuexStore(journalState)
        const [entry1, entry2] = journalState.entries
        expect(store.getters['journal/getEntriesByTerm']('').length).toBe(2)
        expect(
            store.getters['journal/getEntriesByTerm']('segunda').length,
        ).toBe(1)

        expect(store.getters['journal/getEntriesByTerm']('segunda')).toEqual([
            entry2,
        ])
        expect(store.getters['journal/getEntriesById'](entry1.id)).toEqual(
            entry1,
        )
    })

    test('actions: loadEntries', async () => {
        const store = createVuexStore({ isLoading: true, entries: [] })
        await store.dispatch('journal/loadEntries')
        expect(store.state.journal.entries.length).toBe(2)
    })

    test('actions: updateEntry', async () => {
        const store = createVuexStore(journalState)
        const updatedEntry = {
            id: '-N2muSDCOVOu9WkgI0qT',
            date: 1653342830693,
            picture:
                'https://res.cloudinary.com/dsvsl0b0b/image/upload/v1653346811/kyz4dgbahmaimyyo1pp4.jpg',
            text: 'Hola mundo desde mock data',
            otroCampo: true,
            otroMas: { a: 1 },
        }
        await store.dispatch('journal/updateEntry', updatedEntry)
        expect(store.state.journal.entries.length).toBe(2)
        expect(
            store.state.journal.entries.find(e => e.id === updatedEntry.id),
        ).toEqual({
            id: '-N2muSDCOVOu9WkgI0qT',
            date: 1653342830693,
            picture:
                'https://res.cloudinary.com/dsvsl0b0b/image/upload/v1653346811/kyz4dgbahmaimyyo1pp4.jpg',
            text: 'Hola mundo desde mock data',
        })
    })
})
