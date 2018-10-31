import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Session } from "meteor/session";

import { Notes } from "../api/searches";
import NoteListHeader from "./NoteListHeader";
import NoteListItem from "./NoteListItem";
import NoteListEmptyItem from "./NoteListEmptyItem";

export const NoteList = function(props) {
    var notesList;
    if (props.notes.length <= 0) {
        notesList = <NoteListEmptyItem />;
    } else {
        notesList = props.notes.map((note, i) => {
            return <NoteListItem key={note._id} note={note} />;
        });
    }

    return (
        <div className="item-list">
            <NoteListHeader />
            {notesList}
        </div>
    );
};

NoteList.propTypes = {
    notes: PropTypes.array.isRequired
};

export default createContainer(() => {
    var selectedNoteId = Session.get("selectedNoteId");
    var selectedProjectId = Session.get("selectedProjectId");
    Meteor.subscribe("notes");

    return {
        notes: Notes.find(
            { projectId: selectedProjectId },
            {
                sort: {
                    updatedAt: -1
                }
            }
        )
            .fetch()
            .map((note, i) => {
                return {
                    ...note,
                    selected: note._id == selectedNoteId
                };
            })
    };
}, NoteList);
