import React from 'react';
import expect from 'expect';
import {mount} from 'enzyme';
import {meteor} from 'meteor/meteor';

import {NoteList} from './NoteList';
import {notes} from '../fixtures/fixtures';

if (Meteor.isClient) {
    describe("NoteList", function() {
        
        it("should render note list item for each note", function() {
            var wrapper = mount(<NoteList notes={notes}/>);

            expect(wrapper.find("NoteListItem").length).toBe(notes.length);
            expect(wrapper.find("NoteListEmptyItem").length).toBe(0);
        });

        it("should render NoteListEmptyItem if no notes", function() {
            var wrapper = mount(<NoteList notes={[]}/>);

            expect(wrapper.find("NoteListItem").length).toBe(0);
            expect(wrapper.find("NoteListEmptyItem").length).toBe(1);
        });

    });
};