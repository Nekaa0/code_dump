/* eslint-disable no-undef */
import { mount, createLocalVue } from '@vue/test-utils';
import DiscountCodes from '@/components/Event/DiscountCodes/Index';
import DiscountForm from '@/components/Event/DiscountCodes/Form';
import DiscountList from '@/components/Event/DiscountCodes/List';
import { Button } from 'element-ui';

const localVue = createLocalVue();
localVue.component('el-button', Button);
const trimString = text => text.replace(/\s+/g, '');

describe('when there are no tickets', () => {
  const wrapper = mount(DiscountCodes, {
    localVue,
    propsData: {
      codeType: '',
      create: false,
      endDate: 1632961800,
      eventId: 'abcd',
      tickets: [],
    },
  });
  test('Show valid text for when no paid tickets are available', async () => {
    const { vm } = wrapper;
    expect(vm.discounts).toEqual([]);
    const discountList = wrapper.findComponent(DiscountList);
    const discountForm = wrapper.findComponent(DiscountForm);
    const createDiscount = wrapper.findAll('.create--discount');
    const noDiscounts = wrapper.find('.no-discount');
    const expectedDiv = '<div class="no-discount"><p><a>no discounts created yet, create a paid ticket first so that you can create a discount</a></p></div>';

    expect(trimString(noDiscounts.html())).toEqual(trimString(expectedDiv));
    expect(discountList.exists()).toBeFalsy();
    expect(discountForm.exists()).toBeFalsy();
    expect(createDiscount.exists()).toBeFalsy();
  });
});

describe('paid tickets but no discounts available', () => {
  const wrapper = mount(DiscountCodes, {
    stubs: ['router-link'],
    localVue,
    propsData: {
      codeType: '',
      create: false,
      endDate: 1632961800,
      eventId: 'abcd',
      tickets: [{
        id: 1,
        name: 'paid',
        price: '5000.0',
      }],
    },
  });
  test('Show valid text for when paid tickets are available', async () => {
    const { vm } = wrapper;
    expect(vm.discounts).toEqual([]);
    const discountList = wrapper.findComponent(DiscountList);
    const discountForm = wrapper.findComponent(DiscountForm);
    const createDiscount = wrapper.findAll('.create--discount');
    const noDiscounts = wrapper.find('.no-discount');
    const expectedDiv = '<div class="no-discount"><p>there are currently no discounts for this event</p><button type="button" class="el-button el-button--primary"><!----><!----><span><span>create discount</span></span></button></div>';

    expect(trimString(noDiscounts.html())).toEqual(trimString(expectedDiv));
    expect(discountList.exists()).toBeFalsy();
    expect(discountForm.exists()).toBeFalsy();
    expect(createDiscount.exists()).toBeFalsy();
  });
});

describe('discounts are available', () => {
  const wrapper = mount(DiscountCodes, {
    localVue,
    propsData: {
      codeType: '',
      create: false,
      endDate: 1632961800,
      eventId: 'abcd',
      tickets: [{
        id: '1',
        name: 'paid',
        price: '5000.0',
      }],
    },
  });
  test('Show valid text for when there are discounts', async () => {
    const { vm } = wrapper;
    const discountForm = wrapper.findComponent(DiscountForm);

    wrapper.setData({
      discounts: [{
        id: '1',
        code: 'abcd',
        discountUsage: 0,
        startDate: 1631059200,
        endDate: 0,
        unlimited: true,
      }],
    });
    expect(vm.discounts).toEqual([{
      id: '1',
      code: 'abcd',
      discountUsage: 0,
      startDate: 1631059200,
      endDate: 0,
      unlimited: true,
    }]);
    expect(vm.noDiscounts).toBeFalsy();
    expect(vm.noTickets).toBeFalsy();
    expect(vm.hasPaidTicket).toBeTruthy();
    expect(discountForm.exists()).toBeFalsy();
  });
});
