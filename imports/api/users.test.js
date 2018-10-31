import { Meteor } from 'meteor/meteor';
import expect from 'expect';
import { validateNewUser } from './users';

if (Meteor.isServer) {
    describe('Users', function() {
        it('should be a valid email address', function() {
            var user = {emails: [
                {address: 'test@example.com'}
            ]};
    
            var res = validateNewUser(user);
            expect(res).toBe(true);
        });

        it('should reject invalid email', function() {
            expect(function() {
                var user = {emails: [
                    {address: 'BAD'}
                ]};

                validateNewUser(user);
            }).toThrow();
        });
    });
}

// function add(a, b) {
//     return a + b + 3;
// }

// function square(a) {
//     return a * a;
// }

// describe('Math', function() {
//     it('should add two numbers', function() {
//         const expected = 20;
//         const res = add(11, 9); 

//         expect(res).toBe(expected);
//     });
    
//     it('should square a number', function() {
//         const expected = 121;
//         const res = square(11); 
        
//         expect(res).toBe(expected);
//     });
// });