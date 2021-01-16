import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const validate = (value, message = '') => {
  check(value, String);
  if (!value.trim()) {
    throw new Meteor.Error(message);
  }
};
