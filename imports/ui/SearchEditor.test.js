import { Meteor } from "meteor/meteor";
import React from "react";
import expect from "expect";
import { mount } from "enzyme";
import { Editor } from "./SearchEditor";
import { notes } from "../fixtures/fixtures";

if (Meteor.isClient) {
    describe("Editor", function() {
        var call;

        beforeEach(function() {
            call = expect.createSpy();
            history.push = expect.createSpy();
        });

        // note: PropTypes.object,
        // selectedNoteId: PropTypes.string,
        // call: PropTypes.func.isRequired,
        // history: PropTypes.object.isRequired

        it("should show pick note mesage", function() {
            var wrapper = mount(<Editor call={call} history={history} />);

            expect(wrapper.find("p").text()).toBe(
                "Pick or create a note to get started."
            );
        });

        it("should not find a note with bad note id", function() {
            var wrapper = mount(
                <Editor
                    note={undefined}
                    selectedNoteId={"junk id"}
                    call={call}
                    history={history}
                />
            );

            expect(wrapper.find("p").text()).toBe(
                "Unable to find requested note."
            );
        });

        it("should change/show note with a valid id/note", function() {
            var wrapper = mount(
                <Editor
                    note={notes[0]}
                    selectedNoteId={notes[0]._id}
                    call={call}
                    history={history}
                />
            );

            wrapper.setProps({ note: notes[2], selectedNoteId: notes[2]._id });
            wrapper.update();

            expect(wrapper.find("input").instance().value).toBe(notes[2].title);
            expect(wrapper.find("textarea").text()).toBe(notes[2].body);
            expect(wrapper.state("title")).toBe(notes[2].title);
            expect(wrapper.state("body")).toBe(notes[2].body);
        });

        it("should NOT change/show note without a valid note", function() {
            var wrapper = mount(
                <Editor
                    note={notes[0]}
                    selectedNoteId={notes[0]._id}
                    call={call}
                    history={history}
                />
            );

            wrapper.setProps({ selectedNoteId: notes[2]._id });
            wrapper.update();

            expect(wrapper.find("input").instance().value).toBe("");
            expect(wrapper.find("textarea").text()).toBe("");
            expect(wrapper.state("title")).toBe("");
            expect(wrapper.state("body")).toBe("");
        });

        it("should delete the note", function() {
            var wrapper = mount(
                <Editor
                    note={notes[0]}
                    selectedNoteId={notes[0]._id}
                    call={call}
                    history={history}
                />
            );
            wrapper.find("button").simulate("click");

            expect(call).toHaveBeenCalledWith("notes.remove", notes[0]._id);
            expect(history.push).toHaveBeenCalledWith("/dashboard/");
        });

        it("should update the note body on textarea change", function() {
            var newBody = "This is my new body text";
            var wrapper = mount(
                <Editor
                    note={notes[0]}
                    selectedNoteId={notes[0]._id}
                    call={call}
                    history={history}
                />
            );

            wrapper.find("textarea").simulate("change", {
                target: {
                    value: newBody
                }
            });

            expect(wrapper.state("body")).toBe(newBody);
            expect(call).toHaveBeenCalledWith("notes.update", notes[0]._id, {
                body: newBody
            });
        });

        it("should update the note title on input change", function() {
            var newTitle = "This is my new title text";
            var wrapper = mount(
                <Editor
                    note={notes[0]}
                    selectedNoteId={notes[0]._id}
                    call={call}
                    history={history}
                />
            );

            wrapper.find("input").simulate("change", {
                target: {
                    value: newTitle
                }
            });

            expect(wrapper.state("title")).toBe(newTitle);
            expect(call).toHaveBeenCalledWith("notes.update", notes[0]._id, {
                title: newTitle
            });
        });
    });
}
