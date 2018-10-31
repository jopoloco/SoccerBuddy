import createMemoryHistory from 'history/createMemoryHistory';


export const testHistory = createMemoryHistory();

//0: bad id, no body
//1: bad id, no title
//3: bad id, has title and body

export const notes = [{
    _id: 'noteId1',
    title: 'test title',
    body: '',
    updatedAt: 1532376266191,
    userId: 'userId1'
}, {
    _id: 'noteId2',
    title: '',
    body: 'something',
    updatedAt: 1532376266191,
    userId: 'userId2'
}, {
    _id: 'noteId3',
    title: 'has a title',
    body: 'has a body',
    updatedAt: 1532376266191,
    userId: 'userId3'
}];