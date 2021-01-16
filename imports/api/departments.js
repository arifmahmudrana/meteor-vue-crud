import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { validate } from '../validators/string';

export const Departments = new Mongo.Collection('departments');

Meteor.methods({
  'departments.exists'(title, _id = null) {
    const where = {
      title,
    };
    if (_id) {
      where._id = {
        $ne: _id,
      };
    }

    if (Departments.find(where).count()) {
      throw new Meteor.Error(`${title} is duplicate`);
    }
  },
  'departments.insert'(department = {}) {
    validate(department.title, 'Department title can not be empty');
    Meteor.server.method_handlers['departments.exists'].apply({}, [
      department.title,
    ]);

    return Departments.insert(department);
  },
  'departments.update'(_id = '', department = {}) {
    validate(_id, 'Department ID can not be empty');
    validate(department.title, 'Department title can not be empty');
    Meteor.server.method_handlers['departments.exists'].apply({}, [
      department.title,
      _id,
    ]);

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
