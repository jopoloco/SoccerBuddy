import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {Session} from 'meteor/session';
import {createContainer} from 'meteor/react-meteor-data';

export const NoteListItem = (props) => {
    const className = props.note.selected ? 'item item-selected' : 'item';

    return (
        <div className={className} onClick={() => onClickHandler(props)}>
            <h5 className="item-title">{props.note.title || "Untitled note"}</h5>
            <p className="item-subtitle">{moment(props.note.updatedAt).format('MM/DD/YY')}</p>
        </div>
    );
};

function onClickHandler(props) {
    props.Session.set('selectedNoteId', props.note._id);
    props.Session.set("selectedProjectId", props.note.projectId);
}

NoteListItem.propTypes = {
    note: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {
    return { Session };
}, NoteListItem);