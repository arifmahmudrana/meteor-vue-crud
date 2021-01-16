import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';

import { Departments } from './departments.js';
import { Subjects } from './subjects.js';

if (Meteor.isServer) {
  describe('Subjects', () => {
    let departmentId, subjectId;

    before(() => {
      Departments.remove({});
      Subjects.remove({});

      departmentId = Meteor.server.method_handlers[
        'departments.insert'
      ].apply({}, [{ title: 'CSE' }]);
    });

    describe('subjects.insert', () => {
      it('can insert subject', () => {
        subjectId = Meteor.server.method_handlers['subjects.insert'].apply({}, [
          { title: 'Programming', departmentId },
        ]);

        expect(Subjects.find().count()).to.equal(1);
      });

      it('can not insert empty subject', () => {
        expect(() =>
          Meteor.server.method_handlers['subjects.insert']({}, [
            { title: '', departmentId },
          ])
        ).to.throw();
      });

      it('can not insert duplicate subject', () => {
        expect(() =>
          Meteor.server.method_handlers['subjects.insert']({}, [
            { title: 'Programming', departmentId },
          ])
        ).to.throw();
      });
    });

    describe('subjects.update', () => {
      it('can update subject', () => {
        Meteor.server.method_handlers['subjects.update'].apply({}, [
          subjectId,
          { title: 'Algorithm', departmentId },
        ]);

        expect(Subjects.findOne(subjectId).title).to.equal('Algorithm');
      });

      it('can not update empty subject', () => {
        expect(() =>
          Meteor.server.method_handlers['subjects.update'].apply({}, [
            subjectId,
            { title: '', departmentId },
          ])
        ).to.throw();
      });

      it('can not update duplicate subject', () => {
        Meteor.server.method_handlers['subjects.insert'].apply({}, [
          { title: 'Programming', departmentId },
        ]);

        expect(() =>
          Meteor.server.method_handlers['subjects.update'].apply({}, [
            subjectId,
            { title: 'Programming', departmentId },
          ])
        ).to.throw();
      });
    });

    describe('subjects.remove', () => {
      it('can remove subject', () => {
        Meteor.server.method_handlers['subjects.remove'].apply({}, [subjectId]);

        expect(Subjects.findOne({ _id: subjectId })).to.be.undefined;
      });
    });
  });
}
