import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';

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
        assert.equal(Departments.find().count(), 1);
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
        assert.equal(department.title, 'EEE');
      });
    });

    describe('departments.remove', () => {
      it('can remove department', () => {
        const removeDepartment =
          Meteor.server.method_handlers['departments.remove'];
        removeDepartment.apply({}, [departmentId]);
        const department = Departments.findOne({ _id: departmentId });
        assert.equal(department, null);
      });
    });
  });
}
