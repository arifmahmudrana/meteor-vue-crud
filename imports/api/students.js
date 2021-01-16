import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { validate } from '../validators/string';
import { Departments } from './departments';
import { Subjects } from './subjects';

export const Students = new Mongo.Collection('students');

Meteor.methods({
  'students.departments.exists'(departmentId) {
    if (!Departments.find(departmentId).count()) {
      throw new Meteor.Error(`Department doesn't exist`);
    }
  },

  'students.subjects.exists'(subjects) {
    if (subjects && Array.isArray(subjects)) {
      subjects.forEach((subjectId) => {
        if (!Subjects.find(subjectId).count()) {
          throw new Meteor.Error(`Subject doesn't exist`);
        }
      });
    }
  },

  'students.insert'(student = {}) {
    validate(student.name, 'Student name can not be empty');
    validate(student.departmentId, 'Department ID can not be empty');
    Meteor.server.method_handlers['students.departments.exists'].apply({}, [
      student.departmentId,
    ]);
    Meteor.server.method_handlers['students.subjects.exists'].apply({}, [
      student.subjects,
    ]);

    return Students.insert({ subjects: [], ...student });
  },

  'students.update'(_id = '', student = {}) {
    validate(_id, 'Student ID can not be empty');
    validate(student.name, 'Student name can not be empty');
    validate(student.departmentId, 'Department ID can not be empty');
    Meteor.server.method_handlers['students.departments.exists'].apply({}, [
      student.departmentId,
    ]);
    Meteor.server.method_handlers['students.subjects.exists'].apply({}, [
      student.subjects,
    ]);

    return Students.update(
      {
        _id,
      },
      { $set: student }
    );
  },

  'students.remove'(_id = '') {
    validate(_id, 'Student ID can not be empty');

    return Students.remove(_id);
  },

  'students.addSubject'(_id = '', subjectId = '') {
    validate(_id, 'Student ID can not be empty');
    validate(subjectId, 'Subject ID can not be empty');
    Meteor.server.method_handlers['students.subjects.exists'].apply({}, [
      [subjectId],
    ]);

    return Students.update(
      {
        _id,
      },
      { $addToSet: { subjects: subjectId } }
    );
  },

  'students.removeSubject'(_id = '', subjectId = '') {
    validate(_id, 'Student ID can not be empty');
    validate(subjectId, 'Subject ID can not be empty');
    Meteor.server.method_handlers['students.subjects.exists'].apply({}, [
      [subjectId],
    ]);

    return Students.update(
      {
        _id,
      },
      { $pull: { subjects: subjectId } }
    );
  },
});
