/* eslint-disable no-undef */
import { mount, createLocalVue } from '@vue/test-utils';
import Index from '@/components/Profile/Billings/Index';
import BillingsTixCta from '@/components/Profile/Billings/Cta/Index';
import BillingsPlanHeader from '@/components/Profile/Billings/PlanHeader';
import BillingsInvoice from '@/components/Profile/Billings/Invoice/Index';

const localVue = createLocalVue();

describe('Index', () => {
  test('imported components', () => {
    const wrapper = mount(Index,
      { stubs: ['router-link'],
        localVue,
        mocks: {
          $apollo: {
            query: jest.fn(() => Promise.resolve({
              data: null,
            })),
            queries: {
              invoiceHistory: {
                loading: true,
              },
            },
          },
        },
      });
    const billingsTixCta = wrapper.findComponent(BillingsTixCta);
    const billingsInvoice = wrapper.findComponent(BillingsInvoice);
    const billingsPlanHeader = wrapper.findComponent(BillingsPlanHeader);

    expect(billingsTixCta.exists()).toBeTruthy();
    expect(billingsInvoice.exists()).toBeTruthy();
    expect(billingsPlanHeader.exists()).toBeTruthy();
  });

  describe('when user is pro', () => {
    const wrapper = mount(Index,
      { stubs: ['router-link'],
        localVue,
        mocks: {
          $apollo: {
            query: jest.fn(() => Promise.resolve({
              data: {
                fetchSubscription: {
                  amount: 4400000,
                },
              },
            })),
            queries: {
              invoiceHistory: {
                loading: true,
              },
            },
          },
        },
        data() {
          return {
            subscription: 'pro',
          };
        },
      });
    const { vm } = wrapper;

    test('computed', () => {
      expect(vm.amount).toBe('44000.00');
      expect(vm.freePlan).toBeFalsy();
    });

    test('fetchBillingDetails', () => {
      expect(vm.$apollo.query).toHaveBeenCalledTimes(1);
      expect(vm.userSubscription).toEqual(
        expect.objectContaining({
          amount: 4400000,
        }),
      );
    });
  });

  describe('when user is free', () => {
    const wrapper = mount(Index,
      { stubs: ['router-link'],
        localVue,
        mocks: {
          $apollo: {
            query: jest.fn(),
            queries: {
              invoiceHistory: {
                loading: true,
              },
            },
          },
        },
        data() {
          return {
            subscription: 'free',
          };
        },
      });
    const { vm } = wrapper;

    test('computed', () => {
      expect(vm.amount).toBeNull();

      expect(vm.freePlan).toBeTruthy();
    });

    test('fetchBillingDetails', () => {
      expect(vm.$apollo.query).toHaveBeenCalledTimes(0);
      expect(vm.userSubscription).toEqual({});
    });
  });
});
