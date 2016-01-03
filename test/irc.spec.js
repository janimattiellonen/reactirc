import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { List, Range } from 'immutable';
import { wrap } from 'react-stateless-wrapper';

const renderer = TestUtils.createRenderer();

var component;
var spy = sinon.spy();

