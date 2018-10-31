import {Meteor} from 'meteor/meteor';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import expect from 'expect';
import enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import {Signup} from './Signup';

enzyme.configure({adapter: new Adapter()});

if (Meteor.isClient) {
    describe('Signup', function() {

        it('should show error messages', function() {
            var error = 'This is not working.';

            var wrapper = mount(<MemoryRouter><Signup createUser={() => {}}/></MemoryRouter>); // use memory router to maintain link status

            wrapper.find(Signup).instance().setState({ // have to do this since our Signup is within the memory router
                error: error
            });
            wrapper.update(); // force a rerender (doesn't always auto-render within memory router)

            expect(wrapper.find(Signup).find('#errorP').text()).toBe(error);

            wrapper.find(Signup).instance().setState({
                error: ''
            });
            wrapper.update();

            expect(wrapper.find(Signup).find('#errorP').length).toBe(0);
        });

        it('should call createUser with the form data', function() {
            const email = "senpai@test.com";
            const password = "password123";
            const spy = expect.createSpy();
            const wrapper = mount(<MemoryRouter><Signup createUser={spy}/></MemoryRouter>);

            wrapper.find(Signup).instance().refs.email.value = email; //.instance converts to a queryable JS object
            wrapper.find(Signup).instance().refs.password.value = password;
            wrapper.find(Signup).find("form").simulate('submit');

            expect(spy.calls[0].arguments[0]).toEqual({email, password}); //calls is an array that stores each time the spy was called during execution. arguments is vals spy is called with
        });

        it('should set CreateUser error if short password', function() {
            const email = "senpai@test.com";
            const password = "123                            ";
            const spy = expect.createSpy();
            const wrapper = mount(<MemoryRouter><Signup createUser={spy}/></MemoryRouter>);

            wrapper.find(Signup).instance().refs.email.value = email; //.instance converts to a queryable JS object
            wrapper.find(Signup).instance().refs.password.value = password;
            wrapper.find(Signup).find("form").simulate('submit');

            expect(wrapper.find(Signup).instance().state.error.length).toBeGreaterThan(0);
        });

        it('should set createUser callback errors', function() {
            const spy = expect.createSpy();
            const password = "password123";
            reason = "this is why it failed!";
            const wrapper = mount(<MemoryRouter><Signup createUser={spy}/></MemoryRouter>)

            wrapper.find(Signup).instance().refs.password.value = password;
            wrapper.find(Signup).find("form").simulate('submit');

            spy.calls[0].arguments[1]({reason});
            expect(wrapper.find(Signup).instance().state.error).toBe(reason)

            spy.calls[0].arguments[1]();
            expect(wrapper.find(Signup).instance().state.error.length).toBe(0);
        });
    });
}