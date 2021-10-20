<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="live-event">
        <div class="u-bounds__form">
          <create-event-header icon="calender.svg" title="new live event" />
          <div>
            <event-form :edit='false' eventType="live" :event="event" :processing="processing" @save="create" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import CREATE_EVENT from '@/graphql/CreateEvent.gql';
import Auth from '@/helpers/auth';
import ErrorHandler from '@/helpers/error-handler';
import EventForm from '@/components/Event/Form';
import CreateEventHeader from '@/components/Event/CreateEventHeader';

export default {
  components: {
    EventForm,
    CreateEventHeader,
  },
  data() {
    return {
      step: 1,
      event: {
        owner: Auth.currentUser.id,
        owner_type: 'user',
        eventType: 'live',
        frequency: 'once',
        repeats: 0,
      },
      processing: false,
    };
  },
  computed: {
    title() {
      return this.event.name || 'New Event';
    },
  },
  methods: {
    create(event) {
      this.processing = true;
      this.$apollo.mutate({
        mutation: CREATE_EVENT,
        variables: event,
      }).then((response) => {
        const createdEvent = response.data.createEvent;
        this.$router.push(`/events/manage/${createdEvent.slug}?view=tickets`);
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.live-event {
  margin: 4% 20.5%;
  @media screen and (max-width: 576px) {
    width: 100%;
    padding-right: 2rem;
    padding-left: 2rem;
    margin: 4% auto;
  }
  @media screen and (min-width: 576px) and (max-width: 992px) {
    width: 70%;
    margin: 4% auto;
    padding-right: 2rem;
    padding-left: 2rem;
  }
}
</style>
