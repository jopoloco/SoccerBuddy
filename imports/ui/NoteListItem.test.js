import React from 'react';
import expect from 'expect';
import {mount} from 'enzyme';
import {meteor} from 'meteor/meteor';

import {NoteListItem} from './NoteListItem';
import {notes} from '../fixtures/fixtures';

if (Meteor.isClient) {
    describe('NoteListItem', function() {
        var Session;

        beforeEach(() => {
            // creates a session object with 'set' as a spy
            Session = {
                set: expect.createSpy()
            };
        });

        it('should render title and date', function() {
            const wrapper = mount(<NoteListItem note={notes[0]} Session={Session}/>);

            expect(wrapper.find('h5').text()).toBe(notes[0].title);
            expect(wrapper.find('p').text()).toBe('07/23/18');
        });

        it('should render "untitled"', function() {
            const wrapper = mount(<NoteListItem note={notes[1]} Session={Session}/>);

            expect(wrapper.find('h5').text()).toBe("Untitled note");
            expect(wrapper.find('p').text()).toBe('07/23/18');
        });

        it('should call set on click', function() {
            const wrapper = mount(<NoteListItem note={notes[0]} Session={Session}/>);

            wrapper.find('div').simulate('click');
            expect(Session.set).toHaveBeenCalledWith("selectedNoteId", notes[0]._id);
        });
    });
}