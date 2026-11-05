import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VOTE_RULES, isVerified, adjustCounts, canVote, legacyDestination } from './cadGallery';
test('verification requires five votes',()=>{assert.equal(isVerified({correct:4,incorrect:0}),false);assert.equal(isVerified({correct:5,incorrect:0}),true)});
test('verification requires at least 80 percent correct',()=>{assert.equal(isVerified({correct:4,incorrect:1}),true);assert.equal(isVerified({correct:3,incorrect:2}),false)});
test('vote change replaces one vote and repeated selection retracts it',()=>{assert.deepEqual(adjustCounts({correct:12,incorrect:3},1,-1),{correct:11,incorrect:4});assert.deepEqual(adjustCounts({correct:12,incorrect:3},1,0),{correct:11,incorrect:3})});
test('failed models cannot be voted on',()=>assert.equal(canVote({status:'failed',files:{crop:'crop.png',stl:'model.stl'}}),false));
test('note and minute limits match requirements',()=>{assert.equal(VOTE_RULES.maxNote,280);assert.equal(VOTE_RULES.perMinute,30)});
test('legacy article detail link opens the same figure',()=>assert.equal(legacyDestination('#/p0024-01'),'/araclar/teknik-resim-cad/p0024-01'));