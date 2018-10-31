import React from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Session} from 'meteor/session';
import { AddCircle } from "@material-ui/icons";
import { Button } from "@material-ui/core";

export const NoteListHeader = (props) => {
    return (
        <div className="item-list_header">
            <Button className="button" onClick={() => onClickHandler(props)}>
                <AddCircle className="icon-left"/>
                Create Note
            </Button>
        </div>
    );
};

function onClickHandler(props) {
    var projectId = Session.get("selectedProjectId");
    props.meteorCall("notes.insert", projectId, (err, res) => {
        if (res) {
            props.Session.set("selectedNoteId", res);
        }
    });
};

NoteListHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {
    return {
        meteorCall: Meteor.call,
        Session
    };
}, NoteListHeader);