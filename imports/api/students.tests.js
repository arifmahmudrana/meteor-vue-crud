import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';

import { Departments } from './departments.js';
import { Subjects } from './subjects.js';
import { Students } from './students.js';

if (Meteor.isServer) {
  describe('Students', () => {
    let departmentId, subjectId, studentId;

    before(() => {
      Departments.remove({});
      Subjects.remove({});
      Students.remove({});

      departmentId = Meteor.server.method_handlers[
        'departments.insert'
      ].apply({}, [{ title: 'CSE' }]);

      subjectId = Meteor.server.method_handlers['subjects.insert'].apply({}, [
        { title: 'Programming', departmentId },
      ]);
    });

    describe('students.insert', () => {
      it('can insert student', () => {
        studentId = Meteor.server.method_handlers['students.insert'].apply({}, [
          { name: 'Arif Mahmud Rana', departmentId },
        ]);

        expect(Students.find().count()).to.equal(1);
      });

      it('can not insert empty student', () => {
        expect(() =>
          Meteor.server.method_handlers['students.insert']({}, [
            { name: '', departmentId },
          ])
        ).to.throw();
      });
    });

    describe('students.update', () => {
      it('can update student', () => {
        Meteor.server.method_handlers['students.update'].apply({}, [
          studentId,
          { name: 'My name', departmentId },
        ]);

        expect(Students.findOne(studentId).name).to.equal('My name');
      });

      it('can not update empty student', () => {
        expect(() =>
          Meteor.server.method_handlers['students.update'].apply({}, [
            studentId,
            { name: '', departmentId },
          ])
        ).to.throw();
      });
    });

    describe('students.remove', () => {
      it('can remove student', () => {
        Meteor.server.method_handlers['students.remove'].apply({}, [studentId]);

        expect(Subjects.findOne(studentId)).to.be.undefined;
      });
    });
  });
}
