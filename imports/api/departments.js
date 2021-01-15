import { Mongo } from 'meteor/mongo';

export const Departments = new Mongo.Collection('departments');

// TODO: validation
// TODO: duplicate department
Meteor.methods({
  'departments.insert'(department = {}) {
    return Departments.insert(department);
  },
  'departments.update'(_id = '', department = {}) {
    return Departments.update(
      {
        _id,
      },
      { $set: department }
    );
  },
  'departments.remove'(_id = '') {
    return Departments.remove(_id);
  },
});
