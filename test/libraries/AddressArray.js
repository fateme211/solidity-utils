const { expect } = require('chai');
const { expectRevert, constants } = require('@openzeppelin/test-helpers');

const AddressArrayMock = artifacts.require('AddressArrayMock');

contract('AddressArray', async function ([wallet1, wallet2, wallet3]) {
    beforeEach(async function () {
        this.AddressArrayMock = await AddressArrayMock.new();
    });

    describe('length', async function () {
        it('should be calculate length 0', async function () {
            expect(await this.AddressArrayMock.length()).to.be.bignumber.equal('0');
        });

        it('should be calculate length 1', async function () {
            await this.AddressArrayMock.push(wallet1);
            expect(await this.AddressArrayMock.length()).to.be.bignumber.equal('1');
        });
    });

    describe('at', async function () {
        it('should be get from empty data', async function () {
            expect(await this.AddressArrayMock.at(0)).to.be.equal(constants.ZERO_ADDRESS);
            expect(await this.AddressArrayMock.at(1)).to.be.equal(constants.ZERO_ADDRESS);
        });

        it('should be get from data with 1 element', async function () {
            await this.AddressArrayMock.push(wallet1);
            expect(await this.AddressArrayMock.at(0)).to.be.equal(wallet1);
            expect(await this.AddressArrayMock.at(1)).to.be.equal(constants.ZERO_ADDRESS);
        });

        it('should be get from data with several elements', async function () {
            await this.AddressArrayMock.push(wallet1);
            await this.AddressArrayMock.push(wallet2);
            expect(await this.AddressArrayMock.at(0)).to.be.equal(wallet1);
            expect(await this.AddressArrayMock.at(1)).to.be.equal(wallet2);
        });
    });

    describe('get', async function () {
        it('should be get empty data', async function () {
            expect(await this.AddressArrayMock.get()).to.eql([]);
        });

        it('should be get from data with 1 element', async function () {
            await this.AddressArrayMock.push(wallet1);
            expect(await this.AddressArrayMock.get()).to.eql([wallet1]);
        });

        it('should be get from data with several elements', async function () {
            await this.AddressArrayMock.push(wallet1);
            await this.AddressArrayMock.push(wallet2);
            expect(await this.AddressArrayMock.get()).to.eql([wallet1, wallet2]);
        });
    });

    describe('push', async function () {
        it('should be push to empty data', async function () {
            const pushedIndex = await this.AddressArrayMock.push.call(wallet1);
            await this.AddressArrayMock.push(wallet1);
            expect(await this.AddressArrayMock.at(pushedIndex - 1)).to.be.equal(wallet1);
        });

        it('should be push to data with 1 element', async function () {
            await this.AddressArrayMock.push(wallet1);
            const pushedIndex = await this.AddressArrayMock.push.call(wallet2);
            await this.AddressArrayMock.push(wallet2);
            expect(await this.AddressArrayMock.at(pushedIndex - 1)).to.be.equal(wallet2);
        });

        it('should be get push to data with several elements', async function () {
            await this.AddressArrayMock.push(wallet1);
            await this.AddressArrayMock.push(wallet2);
            const pushedIndex = await this.AddressArrayMock.push.call(wallet3);
            await this.AddressArrayMock.push(wallet3);
            expect(await this.AddressArrayMock.at(pushedIndex - 1)).to.be.equal(wallet3);
        });
    });

    describe('pop', async function () {
        it('should be thrown when data is empty', async function () {
            await expectRevert(
                this.AddressArrayMock.pop(),
                'AddressArray: popping from empty',
            );
        });

        it('should be pop in data with 1 element', async function () {
            await this.AddressArrayMock.push(wallet1);
            await this.AddressArrayMock.pop();
            expect(await this.AddressArrayMock.get()).to.eql([]);
        });

        it('should be pop in data with several elements', async function () {
            await this.AddressArrayMock.push(wallet1);
            await this.AddressArrayMock.push(wallet2);
            await this.AddressArrayMock.pop();
            expect(await this.AddressArrayMock.get()).to.eql([wallet1]);
        });

        it('should be several pops', async function () {
            await this.AddressArrayMock.push(wallet1);
            await this.AddressArrayMock.push(wallet2);
            await this.AddressArrayMock.push(wallet3);
            await this.AddressArrayMock.pop();
            expect(await this.AddressArrayMock.get()).to.eql([wallet1, wallet2]);
        });

        it('should be thrown when pops more than elements', async function () {
            await this.AddressArrayMock.push(wallet1);
            await this.AddressArrayMock.pop();
            await expectRevert(
                this.AddressArrayMock.pop(),
                'AddressArray: popping from empty',
            );
        });
    });

    describe('set', async function () {
        it('should be thrown when set index less than data length', async function () {
            await expectRevert(
                this.AddressArrayMock.set(0, wallet1),
                'AddressArray: index out of range',
            );
        });

        it('should be set to index 0 to data with 1 element', async function () {
            await this.AddressArrayMock.push(wallet1);
            await this.AddressArrayMock.set(0, wallet2);
            expect(await this.AddressArrayMock.get()).to.eql([wallet2]);
        });

        it('should be set to index 0 to data with several elements', async function () {
            await this.AddressArrayMock.push(wallet1);
            await this.AddressArrayMock.push(wallet2);
            await this.AddressArrayMock.set(0, wallet3);
            expect(await this.AddressArrayMock.get()).to.eql([wallet3, wallet2]);
        });

        it('should be set to index non-0 to data with several elements', async function () {
            await this.AddressArrayMock.push(wallet1);
            await this.AddressArrayMock.push(wallet2);
            await this.AddressArrayMock.set(1, wallet3);
            expect(await this.AddressArrayMock.get()).to.eql([wallet1, wallet3]);
        });
    });
});
