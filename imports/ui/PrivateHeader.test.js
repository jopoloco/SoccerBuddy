import {Meteor} from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import {PrivateHeader} from './PrivateHeader';

enzyme.configure({adapter: new Adapter()});

if (Meteor.isClient) {
    describe('PrivateHeader', function() {
        it('should set button text to "lougout"', function() {
            var wrapper = mount(<PrivateHeader title="Test Title" handleLogout={() => {}}/>);
            var buttonText = wrapper.find('button').text();

            expect(buttonText).toBe("Logout");
        });

        it('should use title prop as h1 text', function() {
            var title = "Test Title!"
            var wrapper = mount(<PrivateHeader title={title} handleLogout={() => {}}/>);
            var actualTitle = wrapper.find('h1').text();

            expect(actualTitle).toBe(title);
        });

        it('should call the function', function() {
            var spy = expect.createSpy();
            spy(3, 4, 123);
            spy('JP');

            //expect(spy).toHaveBeenCalledWith([{3, 4, 123}, 'JP']);
            expect(spy).toHaveBeenCalled();
        });

        it('should call handleLogout on click', function() {
            var spy = expect.createSpy();
            var wrapper = mount(<PrivateHeader title={"title"} handleLogout={spy}/>);

            wrapper.find('button').simulate('click');
            expect(spy).toHaveBeenCalled();
        });
    });
}