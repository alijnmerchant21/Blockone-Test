import { getHeadBlockId, getBlockInfo, getAbiInfo } from './index.js';
import { assert, expect } from 'chai';
import mocha from 'mocha'

describe("GET https://eos.greymass.com", () => {
	it("should return status 200", async () => {
		// when
		const result = await fetch("https://eos.greymass.com");
		// then
 		expect(result.status).to.equal(200)
		expect(result.statusText).to.equal('OK')
	});
});

describe("POST /get_info", () => {
	it("should return string value", async () => {
		// when
		const actual = await getHeadBlockId();
		// then
		expect(actual).to.be.a('string');
		assert.notEqual(actual, undefined, 'headBlockId is not undefined');
		assert.notEqual(actual, null, 'headBlockId is not null');
	});
});

describe("POST /get_block positive case", () => {
	let headBlockIdResult;
	beforeEach(async () => {
		// given
		console.log('before get_block is calling');
		headBlockIdResult =  await getHeadBlockId();
		console.log('Block Header Id result: ', headBlockIdResult);
	});

	it("should return correct data types", async () => {
		// when
		const result = await getBlockInfo(headBlockIdResult);

		// then
		expect(result.action_mroot).to.be.a('string');
		expect(result.block_num).to.be.a('number');
		expect(result.confirmed).to.be.a('number');
		expect(result.id).to.be.a('string');
		expect(result.previous).to.be.a('string');
		expect(result.producer).to.be.a('string');
		expect(result.producer_signature).to.be.a('string');
		expect(result.ref_block_prefix).to.be.a('number');
		expect(result.schedule_version).to.be.a('number');
		expect(result.timestamp).to.be.a('string');
		expect(result.transaction_mroot).to.be.a('string'); 
	}); 
});
