import {Meteor} from 'meteor/meteor';
import expect from 'expect';
import { Notes } from '../imports/api/notes';
import './methods';

describe('Notes', function() {
    var _id = 'testNoteId';
    var title = 'My title';
    var body = 'My body';
    var userId = 'testUserId';
    var badUserId = 'badUserId';
    var noteOne = {
        _id: _id + '1',
        title,
        body,
        updatedAt: 0,
        userId: userId + '1'
    };
    var noteTwo = {
        _id: _id + '2',
        title,
        body,
        updatedAt: 0,
        userId: userId + '2'
    };

    beforeEach(function() {
        Notes.remove({}); // does not affect dev database, only test
        Notes.insert(noteOne);
        Notes.insert(noteTwo);
    });

    it('should insert new note', function() {
        var _id = Meteor.server.method_handlers['notes.insert'].apply({userId: noteOne.userId});

        expect(Notes.findOne({_id, userId: noteOne.userId})).toBeTruthy();
    });
    
    it('should fail to insert note if not authenticated', function() {
        expect(() => 
            Meteor.server.method_handlers['notes.insert'].apply({})
        ).toThrow();
    });

    it('should remove note', function() {
        var _id = Meteor.server.method_handlers['notes.remove'].apply(
            {userId: noteOne.userId},
            [noteOne._id]
        );

        expect(Notes.findOne({_id})).toBeFalsy();
    });

    it('should fail to remove a note if unauthenticated', function() {
        expect(() =>
            Meteor.server.method_handlers['notes.remove'].apply(
            {}, // bad user id
            [noteOne._id]
        )).toThrow();
    });

    it('should fail to remove a note that does not exist', function() {
        expect(() =>
            Meteor.server.method_handlers['notes.remove'].apply(
            {userId: noteOne.userId},
            [null] // bad note id
        )).toThrow();
    });

    it('should successfully update note', function() {
        var newTitle = 'updated title';
        Meteor.server.method_handlers['notes.update'].apply(
            {userId: noteOne.userId}, 
            [noteOne._id, {title: newTitle}] //note id, updates object
        );

        // find noteOne and compare values. ensure they are properly updated
        var newNote = Notes.findOne({_id: noteOne._id, userId: noteOne.userId});
        expect(newNote.updatedAt).toBeGreaterThan(0);
        expect(newNote.title).toNotEqual(noteOne.title);
        expect(newNote.body).toEqual(noteOne.body);
    });

    it('should throw error if invalid properties', function() {
        expect(() => {
            Meteor.server.method_handlers['notes.update'].apply(
                {userId: noteOne.userId}, 
                [noteOne._id, {extra: 'reject'}] //note id, updates object
            );
        }).toThrow();
    });

    it('should not update if not authenticated', function() {
        expect(() =>
            Meteor.server.method_handlers['notes.update'].apply(
            {}, // bad user id
            [noteOne._id] 
        )).toThrow();
    });

    it('should fail to update if note does not exist', function() {
        expect(() =>
            Meteor.server.method_handlers['notes.update'].apply(
            {userId: noteOne.userId},
            [null] // bad note id
        )).toThrow();
    });

    it('should not update if user did not create note', function() {
        var newTitle = 'updated title';
        Meteor.server.method_handlers['notes.update'].apply(
            {userId: badUserId}, 
            [noteOne._id, {title: newTitle}] //note id, updates object
        );

        // find noteOne and compare values. ensure they were NOT updated
        var newNote = Notes.findOne({_id: noteOne._id, userId: noteOne.userId});
        expect(newNote.updatedAt).toEqual(0);
        expect(newNote.title).toEqual(noteOne.title);
        expect(newNote.body).toEqual(noteOne.body);
    });

    it('should return a users notes', function() {
        var res = Meteor.server.publish_handlers['notes'].apply({userId: noteOne.userId});
        var notes = res.fetch();

        expect(notes.length).toBe(1);
        expect(notes[0]).toEqual(noteOne);
    });

    it('should return zero notes for a user that has none', function() {
        var res = Meteor.server.publish_handlers['notes'].apply({userId: badUserId});
        var notes = res.fetch();

        expect(notes.length).toBe(0);
    });
});