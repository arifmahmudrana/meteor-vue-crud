import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';

import { Departments } from './departments.js';

if (Meteor.isServer) {
  describe('Departments', () => {
    let departmentId;

    before(() => {
      Departments.remove({});
    });

    describe('departments.insert', () => {
      it('can insert department', () => {
        departmentId = Meteor.server.method_handlers[
          'departments.insert'
        ].apply({}, [{ title: 'CSE' }]);

        expect(Departments.find().count()).to.equal(1);
      });

      it('can not insert empty department', () => {
        expect(() =>
          Meteor.server.method_handlers['departments.insert']({}, [
            { title: '' },
          ])
        ).to.throw();
      });

      it('can not insert duplicate department', () => {
        expect(() =>
          Meteor.server.method_handlers['departments.insert']({}, [
            { title: 'CSE' },
          ])
        ).to.throw();
      });
    });

    describe('departments.update', () => {
      it('can update department', () => {
        Meteor.server.method_handlers['departments.update'].apply({}, [
          departmentId,
          { title: 'EEE' },
        ]);

        expect(Departments.findOne({ _id: departmentId }).title).to.equal(
          'EEE'
        );
      });

      it('can not update empty department', () => {
        expect(() =>
          Meteor.server.method_handlers['departments.update'].apply({}, [
            departmentId,
            { title: '' },
          ])
        ).to.throw();
      });

      it('can not update duplicate department', () => {
        Meteor.server.method_handlers['departments.insert'].apply({}, [
          { title: 'CSE' },
        ]);

        expect(() =>
          Meteor.server.method_handlers['departments.update'].apply({}, [
            departmentId,
            { title: 'CSE' },
          ])
        ).to.throw();
      });
    });

    describe('departments.remove', () => {
      it('can remove department', () => {
        Meteor.server.method_handlers['departments.remove'].apply({}, [
          departmentId,
        ]);

        expect(Departments.findOne({ _id: departmentId })).to.be.undefined;
      });
    });
  });
}
