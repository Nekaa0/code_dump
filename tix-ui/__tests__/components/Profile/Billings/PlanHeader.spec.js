import { mount } from '@vue/test-utils';
import PlanHeader from '@/components/Profile/Billings/PlanHeader';
import BillingDowngrade from '@/components/Profile/Billings/Downgrade';

describe('PlanHeader.vue', () => {
  describe('when user is a free user', () => {
    const wrapper = mount(PlanHeader, {
      stubs: ['router-link'],
      propsData: {
        amount: undefined,
        frequency: undefined,
        nextPaymentDate: undefined,
        last_four_digits: undefined,
        nextBillingRetryDate: undefined,
      },
    });

    test('BillingDowngrade.vue', () => {
      const billingDowngrade = wrapper.findComponent(BillingDowngrade);

      expect(billingDowngrade.exists()).toBeFalsy();
    })

    test('free plan header text', async () => {
      await wrapper.setData({ subscription: 'free' });
      const plan = 'free';
      const amount = 'nothing per month';
      expect(wrapper.text()).toContain(plan);
      expect(wrapper.text()).toContain(amount);
    })
  })

  describe('when user is a pro user', () => {
    const wrapper = mount(PlanHeader, {
      propsData: {
        amount: '44000',
        frequency: 'annually',
        nextPaymentDate: 1619654400,
        last_four_digits: '1234',
        nextBillingRetryDate: null,
      },
    });

    test('BillingDowngrade.vue', () => {
      const billingDowngrade = wrapper.findComponent(BillingDowngrade);

      expect(billingDowngrade.exists()).toBeFalsy();
    })
    test('computed', () => {
      const { vm } = wrapper;

      expect(vm.formatNextPaymentDate).toBe('Thursday April 29 2021');
      expect(vm.billingPrice).toBe('NGN 44,000')
    })

    test('pro plan header text', async () => {
      await wrapper.setData({ subscription: 'pro' });

      const plan = 'tix pro';
      const amount = 'for NGN 44,000';
      const text1 = 'your subscription will renew on Thursday April 29 2021 and will be';
      const text2 = 'charged to your card ending in 1234.';
      expect(wrapper.text()).toContain(plan);
      expect(wrapper.text()).toContain(amount);
      expect(wrapper.text()).toContain(text1);
      expect(wrapper.text()).toContain(text2);
    })
  })

  describe('when user status is downgraded', () => {
    const wrapper = mount(PlanHeader, {
      propsData: {
        amount: '44000',
        frequency: 'annually',
        nextPaymentDate: 1619654400,
        last_four_digits: '1234',
        nextBillingRetryDate: null,
      },
    });

    test('BillingDowngrade.vue', async () => {
      await wrapper.setData({ subscription: 'downgraded' });

      const billingDowngrade = wrapper.findComponent(BillingDowngrade);

      expect(billingDowngrade.exists()).toBeTruthy();
    })

    test('computed', () => {
      const { vm } = wrapper;

      expect(vm.formatNextPaymentDate).toBe('Thursday April 29 2021');
      expect(vm.billingPrice).toBe('NGN 44,000')
    })

    test('downgraded user header text', async () => {
      await wrapper.setData({ subscription: 'downgraded' });

      const headerText = 'you have downgraded to the free plan';
      const subText = 'you have access to tix pro until Thursday April 29 2021';
      expect(wrapper.text()).toContain(headerText);
      expect(wrapper.text()).toContain(subText);
    })
  })

  describe('when user status is grace_period', () => {
    const wrapper = mount(PlanHeader, {
      propsData: {
        amount: '44000',
        frequency: 'annually',
        nextPaymentDate: 1619654400,
        last_four_digits: '1234',
        nextBillingRetryDate: 1619754400,
      },
    });

    test('BillingDowngrade.vue', () => {
      const billingDowngrade = wrapper.findComponent(BillingDowngrade);

      expect(billingDowngrade.exists()).toBeFalsy();
    })

    test('computed', () => {
      const { vm } = wrapper;

      expect(vm.formatNextPaymentDate).toBe('Thursday April 29 2021');
      expect(vm.billingPrice).toBe('NGN 44,000');
    })

    test('grace_period user header text', async () => {
      await wrapper.setData({ subscription: 'in_grace_period' });

      const headerText = 'we are unable to renew your subscription';
      const subText = 'we will attempt to charge your card again on Friday April 30 2021';
      expect(wrapper.text()).toContain(headerText);
      expect(wrapper.text()).toContain(subText);
    })
  })
})
