import React from 'react';
import expect from 'expect';
import {mount} from 'enzyme';
import {meteor} from 'meteor/meteor';

import {NoteListHeader} from './NoteListHeader';
import {notes} from '../fixtures/fixtures';

if (Meteor.isClient) {
    describe('NoteListHeader', function() {
        var meteorCall;
        var Session;

        beforeEach(function() {
            meteorCall = expect.createSpy();
            Session = {
                set: expect.createSpy()
            };
        });

        it('should call meteorCall on click', function() {
            const wrapper = mount(<NoteListHeader meteorCall={meteorCall} Session={Session}/>);

            wrapper.find("button").simulate('click');
            meteorCall.calls[0].arguments[1](undefined, notes[0]._id);

            expect(meteorCall.calls[0].arguments[0]).toBe('notes.insert');
            expect(Session.set).toHaveBeenCalledWith("selectedNoteId", notes[0]._id);
        });

        it("should not set Session for failed insert", function() {
            const wrapper = mount(<NoteListHeader meteorCall={meteorCall} Session={Session}/>);

            wrapper.find("button").simulate('click');
            meteorCall.calls[0].arguments[1]({}, undefined );

            expect(meteorCall.calls[0].arguments[0]).toBe('notes.insert');
            expect(Session.set).toNotHaveBeenCalled();
        });
    });
}