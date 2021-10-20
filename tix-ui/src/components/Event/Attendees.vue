<template>
  <div>
    <div key="loading" v-if="isFetching" class="loading">
      <div class="u-loader" v-loading="true"></div>
    </div>
    <div class="attendees-form" v-else-if="attendeesEmails.length">
      <transition name="fade">
        <attendees-email-form v-bind="$props" :processing="processingCustomEmail" :processingTestEmail="processingTestEmail" :attendeesEmails="attendeesEmails" @save="sendCustomEmailToAttendees"/>
      </transition>
    </div>
    <p v-else class="orders-content__text">
      there are no attendees yet.
    </p>
  </div>
</template>

<script>
import SEND_CUSTOM_EMAIL from '@/graphql/SendCustomEmail.gql';
import ErrorHandler from '@/helpers/error-handler';
import AttendeesEmailForm from '@/components/Ticket/AttendeesEmailForm';
import ListHeader from '@/components/Global/ListHeader';
import VueTrix from 'vue-trix';
import FETCH_BUYER_EMAIL from '@/graphql/AttendeesForm/FetchBuyerEmail.gql';

export default {
  name: 'event-attendees',
  props: {
    eventId: String,
    eventSlug: String,
  },
  components: {
    AttendeesEmailForm,
    ListHeader,
    VueTrix,
  },
  data() {
    return {
      processingCustomEmail: false,
      processingTestEmail: false,
      fetchAttendees: null,
    };
  },
  apollo: {
    fetchAttendees: {
      query: FETCH_BUYER_EMAIL,
      variables() {
        return {
          slug: this.eventSlug,
        };
      },
      update: data => data.findBySlug,
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    isFetching() {
      return this.$apollo.queries.fetchAttendees.loading;
    },
    attendeesEmails() {
      return this.fetchAttendees ? this.fetchAttendees.attendeesEmails : [];
    },
  },
  methods: {
    sendCustomEmailToAttendees(attendee) {
      const formData = Object.assign({ id: this.eventId }, attendee);
      this.processingCustomEmail = !formData.testing;
      this.processingTestEmail = formData.testing;
      this.$apollo.mutate({
        mutation: SEND_CUSTOM_EMAIL,
        variables: formData,
      }).then(() => {
        this.processingCustomEmail = false;
        this.processingTestEmail = false;
        if (formData.testing) {
          this.$message.success('Your Test Email was sent.');
        } else {
          this.$message.success('Your Custom Email was sent to Attendees.');
        }
      }).catch((error) => {
        this.processingCustomEmail = false;
        this.processingTestEmail = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .orders-content {
        &__text {
        padding: 2.7rem 5%;
        color: $--color-green;
        line-height: 1.2;
        font-size: 1em;
        margin: 0;
      }
  }
  .loading {
    min-height: 30vh;
    @media screen and (min-width: 768px) {
      min-height: 50rem;
    }
  }
  .attendees-form {
    min-height: 30vh;
    @media screen and (min-width: 601px) {
      min-height: 48rem;
    }
  }
</style>
