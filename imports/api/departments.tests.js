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
        const insertDepartment =
          Meteor.server.method_handlers['departments.insert'];
        departmentId = insertDepartment.apply({}, [
          {
            title: 'CSE',
          },
        ]);
        expect(Departments.find().count()).to.equal(1);
      });
    });

    describe('departments.update', () => {
      it('can update department', () => {
        const updateDepartment =
          Meteor.server.method_handlers['departments.update'];
        updateDepartment.apply({}, [
          departmentId,
          {
            title: 'EEE',
          },
        ]);
        const department = Departments.findOne({ _id: departmentId });
        expect(department.title).to.equal('EEE');
      });
    });

    describe('departments.remove', () => {
      it('can remove department', () => {
        const removeDepartment =
          Meteor.server.method_handlers['departments.remove'];
        removeDepartment.apply({}, [departmentId]);
        const department = Departments.findOne({ _id: departmentId });
        expect(department).to.be.undefined;
      });
    });
  });
}
