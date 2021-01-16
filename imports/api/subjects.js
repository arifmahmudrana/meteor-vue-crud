import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { validate } from '../validators/string';
import { Departments } from './departments';

export const Subjects = new Mongo.Collection('subjects');

Meteor.methods({
  'subjects.exists'(title, departmentId, _id = null) {
    if (!Departments.find(departmentId).count()) {
      throw new Meteor.Error(`Department doesn't exist`);
    }

    const where = { title, departmentId };
    if (_id) {
      where._id = { $ne: _id };
    }

    if (Subjects.find(where).count()) {
      throw new Meteor.Error(`${title} is duplicate`);
    }
  },

  'subjects.insert'(subject = {}) {
    validate(subject.title, 'Subject title can not be empty');
    validate(subject.departmentId, 'Department ID can not be empty');
    Meteor.server.method_handlers['subjects.exists'].apply({}, [
      subject.title,
      subject.departmentId,
    ]);

    return Subjects.insert(subject);
  },

  'subjects.update'(_id = '', subject = {}) {
    validate(_id, 'Subject ID can not be empty');
    validate(subject.departmentId, 'Department ID can not be empty');
    validate(subject.title, 'Department title can not be empty');
    Meteor.server.method_handlers['subjects.exists'].apply({}, [
      subject.title,
      subject.departmentId,
      _id,
    ]);

    return Subjects.update(
      {
        _id,
      },
      { $set: subject }
    );
  },

  'subjects.remove'(_id = '') {
    return Subjects.remove(_id);
  },
});
