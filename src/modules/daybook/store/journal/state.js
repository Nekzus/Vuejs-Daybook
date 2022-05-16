export default () => ({
    isLoading: true,
    entries: [
        {
            id: new Date().getTime(),
            date: new Date().toDateString(),
            text: 'Quis enim duis excepteur mollit occaecat est eu enim est incididunt elit ad.',
            picture: null,
        },
        {
            id: new Date().getTime() + 1000,
            date: new Date().toDateString(),
            text: 'Excepteur cillum consectetur qui excepteur sunt ullamco voluptate do cillum tempor laboris pariatur dolore in.',
            picture: null,
        },
        {
            id: new Date().getTime() + 2000,
            date: new Date().toDateString(),
            text: 'Elit ex veniam tempor culpa duis labore ad qui Lorem eiusmod adipisicing duis.',
            picture: null,
        },
    ]
})