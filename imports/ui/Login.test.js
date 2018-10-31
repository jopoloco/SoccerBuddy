import {Meteor} from 'meteor/meteor';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import expect from 'expect';
import {mount} from 'enzyme';

import {Login} from './Login';

if (Meteor.isClient) {
    describe('Login', function() {
        
        it('should show error messages', function() {
            var error = 'This is not working.';

            var wrapper = mount(<MemoryRouter><Login loginWithPassword={() => {}}/></MemoryRouter>); // use memory router to maintain link status

            wrapper.find(Login).instance().setState({ // have to do this since our login is within the memory router
                error: error
            });
            wrapper.update(); // force a rerender (doesn't always auto-render within memory router)

            expect(wrapper.find(Login).find('#errorP').text()).toBe(error);

            wrapper.find(Login).instance().setState({
                error: ''
            });
            wrapper.update();

            expect(wrapper.find(Login).find('#errorP').length).toBe(0);
        });

        it('should call loginWithPassword with the form data', function() {
            const email = "senpai@test.com";
            const pass = "password123";
            const spy = expect.createSpy();
            const wrapper = mount(<MemoryRouter><Login loginWithPassword={spy}/></MemoryRouter>);

            wrapper.find(Login).instance().refs.email.value = email; //.instance converts to a queryable JS object
            wrapper.find(Login).instance().refs.password.value = pass;
            wrapper.find(Login).find("form").simulate('submit');

            expect(spy.calls[0].arguments[0]).toEqual({email}); //calls is an array that stores each time the spy was called during execution. arguments is vals spy is called with
            expect(spy.calls[0].arguments[1]).toBe(pass);
        });

        it('should set loginWithPassword callback errors', function() {
            const spy = expect.createSpy();
            const wrapper = mount(<MemoryRouter><Login loginWithPassword={spy}/></MemoryRouter>)

            wrapper.find(Login).find("form").simulate('submit');
            spy.calls[0].arguments[2]({});
            expect(wrapper.find(Login).instance().state.error.length).toNotBe(0);

            spy.calls[0].arguments[2]();
            expect(wrapper.find(Login).instance().state.error.length).toBe(0);
        });
    });
}