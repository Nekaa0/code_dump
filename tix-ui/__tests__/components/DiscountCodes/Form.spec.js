/* eslint-disable no-undef */
import { mount, createLocalVue } from '@vue/test-utils';
import DiscountForm from '@/components/Event/DiscountCodes/Form';
import { Button, Radio, Input, Form, FormItem } from 'element-ui';

const localVue = createLocalVue();
localVue.component('el-form', Form);
localVue.component('el-form-item', FormItem);
localVue.component('el-radio', Radio);
localVue.component('el-input', Input);
localVue.component('el-input', Input);
localVue.component('el-button', Button);

describe('when the discount is manual', () => {
  const wrapper = mount(DiscountForm, {
    localVue,
    propsData: {
      codeType: 'manual',
      edit: false,
      eventId: 'abcdefg',
      tickets: [
        {
          id: 'abc',
          name: 'free',
        },
        {
          id: 'abcd',
          name: 'paid',
        },
      ],
    },
  });
  test('Fixed percentage discount with unlimited use', async () => {
    const { vm } = wrapper;
    const { formData } = vm;
    const expectedData = {
      code: 'abcd',
      codeType: 'manual',
      feeType: 'percentage',
      value: 20,
      limit: null,
      unlimited: true,
      startDate: 1630368000,
      endDate: null,
      event: 'abcdefg',
      ticket: null,
      minimumUse: null,
      minimumFee: null,
    };
    const startDate = 1630368000;
    const newData = Object.assign(formData, { startDate });
    await wrapper.setData({
      formData: newData,
    });
    const codeInput = wrapper.findAll('input[type="text"]').at(0);
    const valueInput = wrapper.findAll('input[type="number"]').at(0);
    await codeInput.setValue('abcd');
    await valueInput.setValue(20);
    expect(vm.applyTicket).toBe('all tickets in the current event');
    expect(vm.discountUsage).toBe('unlimited');
    expect(vm.formData).toEqual(expectedData);
  });

  test('Fixed value of 2000 discount limited to 20 uses on a specific ticket', async () => {
    const { vm } = wrapper;
    const { formData } = vm;
    const expectedData = {
      code: 'fixed2000',
      codeType: 'manual',
      feeType: 'fixed',
      value: 2000,
      limit: 20,
      unlimited: false,
      startDate: 1630368000,
      endDate: null,
      event: null,
      ticket: 'abcd',
      minimumUse: null,
      minimumFee: null,
    };
    const newData = Object.assign(formData, { feeType: 'fixed', ticket: 'abcd', limit: 20 });
    await wrapper.setData({
      discountUsage: 'limited amount of tickets',
      formData: newData,
    });
    const codeInput = wrapper.findAll('input[type="text"]').at(0);
    const valueInput = wrapper.findAll('input[type="number"]').at(0);
    const discountApplication = wrapper.findAll('select').at(0);
    await codeInput.setValue('fixed2000');
    await valueInput.setValue(2000);
    await discountApplication.setValue('specific ticket types');
    const ticketOption1 = wrapper.find('input[value="abc"], input[type="radio"]');
    const ticketOption2 = wrapper.find('input[value="abcd"], input[type="radio"]');
    expect(ticketOption1.exists()).toBeTruthy();
    expect(ticketOption2.exists()).toBeTruthy();
    expect(vm.applyTicket).toBe('specific ticket types');
    expect(vm.discountUsage).toBe('limited amount of tickets');
    expect(vm.formData).toEqual(expectedData);
  });
});

describe('when the discount is automated', () => {
  const wrapper = mount(DiscountForm, {
    localVue,
    propsData: {
      codeType: 'automated',
      edit: false,
      eventId: 'abcdefg',
      tickets: [
        {
          id: 'abc',
          name: 'free',
        },
        {
          id: 'abcd',
          name: 'paid',
        },
      ],
    },
  });

  test('Fixed percentage discount with minimum purchase of 5000', async () => {
    const { vm } = wrapper;
    const { formData } = vm;
    const minimumReq1 = wrapper.find('input[value="minimum quantity of tickets"], input[type="radio"]');
    const minimumReq2 = wrapper.find('input[value="minimum purchase amount"], input[type="radio"]');
    const expectedData = {
      code: 'abcd',
      codeType: 'automated',
      feeType: 'percentage',
      value: 20,
      limit: null,
      unlimited: true,
      startDate: 1630368000,
      endDate: null,
      event: 'abcdefg',
      ticket: null,
      minimumUse: null,
      minimumFee: 5000,
    };
    const startDate = 1630368000;
    const newData = Object.assign(formData, { startDate, minimumFee: 5000 });
    await wrapper.setData({
      requirement: 'minimum purchase amount',
      formData: newData,
    });
    const codeInput = wrapper.findAll('input[type="text"]').at(0);
    const valueInput = wrapper.findAll('input[type="number"]').at(0);
    await codeInput.setValue('abcd');
    await valueInput.setValue(20);
    expect(minimumReq1.exists()).toBeTruthy();
    expect(minimumReq2.exists()).toBeTruthy();
    expect(vm.applyTicket).toBe('all tickets in the current event');
    expect(vm.discountUsage).toBe('unlimited');
    expect(vm.formData).toEqual(expectedData);
  });

  test('Fixed value of 2000 discount with minimum quantity of 3', async () => {
    const { vm } = wrapper;
    const { formData } = vm;
    const minimumReq1 = wrapper.find('input[value="minimum quantity of tickets"], input[type="radio"]');
    const minimumReq2 = wrapper.find('input[value="minimum purchase amount"], input[type="radio"]');
    const expectedData = {
      code: 'fixed2000',
      codeType: 'automated',
      feeType: 'fixed',
      value: 2000,
      limit: null,
      unlimited: true,
      startDate: 1630368000,
      endDate: null,
      event: null,
      ticket: 'abcd',
      minimumUse: 3,
      minimumFee: null,
    };
    const newData = Object.assign(formData, { feeType: 'fixed', ticket: 'abcd', minimumUse: 3 });
    await wrapper.setData({
      requirement: 'minimum quantity of tickets',
      formData: newData,
    });
    const codeInput = wrapper.findAll('input[type="text"]').at(0);
    const valueInput = wrapper.findAll('input[type="number"]').at(0);
    const discountApplication = wrapper.findAll('select').at(0);
    await codeInput.setValue('fixed2000');
    await valueInput.setValue(2000);
    await discountApplication.setValue('specific ticket types');
    const ticketOption1 = wrapper.find('input[value="abc"], input[type="radio"]');
    const ticketOption2 = wrapper.find('input[value="abcd"], input[type="radio"]');
    expect(ticketOption1.exists()).toBeTruthy();
    expect(ticketOption2.exists()).toBeTruthy();
    expect(minimumReq1.exists()).toBeTruthy();
    expect(minimumReq2.exists()).toBeTruthy();
    expect(vm.applyTicket).toBe('specific ticket types');
    expect(vm.discountUsage).toBe('unlimited');
    expect(vm.formData).toEqual(expectedData);
  });
});

const manualDiscount = {
  id: '01',
  code: 'cool20',
  codeType: 'manual',
  value: 20,
  discountUsage: 0,
  startDate: 1630368000,
  endDate: 0,
  event: 'abcdefg',
  ticket: null,
  feeType: 'percentage',
  limit: null,
  unlimited: true,
  status: 'active',
  minimumFee: null,
  minimumUse: null,
};

describe('when editing a manual discount', () => {
  test('manual discount with no usage', async () => {
    const wrapper = mount(DiscountForm, {
      localVue,
      propsData: {
        discount: manualDiscount,
        codeType: undefined,
        edit: true,
        eventId: 'abcdefg',
        tickets: [
          {
            id: 'abc',
            name: 'free',
          },
          {
            id: 'abcd',
            name: 'paid',
          },
        ],
      },
    });
    const { vm } = wrapper;
    const { formData } = vm;
    const expectedData = {
      id: '01',
      code: 'fixed2000',
      codeType: 'manual',
      feeType: 'percentage',
      discountUsage: 0,
      value: 30,
      limit: null,
      unlimited: true,
      startDate: 1630368000,
      endDate: null,
      event: null,
      ticket: 'abcd',
      minimumUse: null,
      status: 'active',
      minimumFee: null,
    };
    expect(formData).toEqual(manualDiscount);
    expect(vm.applyTicket).toBe('all tickets in the current event');
    expect(vm.discountUsage).toBe('unlimited');
    const codeInput = wrapper.findAll('input[type="text"]').at(0);
    const valueInput = wrapper.findAll('input[type="number"]').at(0);
    const discountApplication = wrapper.findAll('select').at(0);
    const newData = Object.assign(formData, { ticket: 'abcd' });
    await wrapper.setData({
      formData: newData,
    });
    await codeInput.setValue('fixed2000');
    await valueInput.setValue(30);
    await discountApplication.setValue('specific ticket types');
    const ticketOption1 = wrapper.find('input[value="abc"], input[type="radio"]');
    const ticketOption2 = wrapper.find('input[value="abcd"], input[type="radio"]');
    expect(ticketOption1.exists()).toBeTruthy();
    expect(ticketOption2.exists()).toBeTruthy();
    expect(vm.applyTicket).toBe('specific ticket types');
    expect(vm.formData).toEqual(expectedData);
  });

  test('manual discount with usage', async () => {
    const manualDiscountWithUsage = {
      ...manualDiscount,
      discountUsage: 20,
    };
    const wrapper = mount(DiscountForm, {
      localVue,
      propsData: {
        discount: manualDiscountWithUsage,
        codeType: undefined,
        edit: true,
        eventId: 'abcdefg',
        tickets: [
          {
            id: 'abc',
            name: 'free',
          },
          {
            id: 'abcd',
            name: 'paid',
          },
        ],
      },
    });
    const { vm } = wrapper;
    const { formData } = vm;
    const discountApplication = wrapper.findAll('select').at(0);
    await discountApplication.setValue('all tickets in the current event');
    expect(formData).toEqual(manualDiscountWithUsage);
    expect(vm.applyTicket).toBe('all tickets in the current event');
  });
});
