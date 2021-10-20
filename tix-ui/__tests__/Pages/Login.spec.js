import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import Login from '@/pages/Login';
import FormHeader from '@/components/Global/FormHeader';
import LoginForm from '@/components/Auth/LoginForm';

Vue.config.ignoredElements = [
  'navigation'
];

const wrapper = shallowMount(Login)

describe('Login.vue', () => {
  it('renders the neccessary components', () => {
    const formHeader = wrapper.findComponent(FormHeader);
    const loginForm = wrapper.findComponent(LoginForm);

    expect(formHeader.props().title).toEqual('welcome back')
    expect(loginForm.exists()).toEqual(true)
  })
})
