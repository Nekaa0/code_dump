<template>
  <div class="stock">
    <div class="stock--list stock--list__header">
      <p class="stock--list__date">event date</p>
      <p class="stock--list__ticket">{{isPhone ? '' : 'tickets ' }}sold</p>
      <p class="stock--list__ticket">{{isPhone ? '' : 'tickets ' }}remaining</p>
    </div>
    <div class="stock--list stock--list__content" v-for="(option, index) in schedules" :key="index">
      <div class="stock--list__date">
        <p>{{date(option.schedule.startDate)}}</p>
      </div>
      <div class="stock--list__ticket">
        <p>{{option.quantitySold}}</p>
      </div>
      <div class="stock--list__ticket">
        <p>{{remains(option)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import IsPhone from '@/mixins/IsPhone';

export default {
  props: {
    schedules: Array,
  },
  mixins: [IsPhone],
  data() {
    return {};
  },
  methods: {
    date(val) {
      const date = moment.unix(val).utcOffset(1).toDate();
      if (this.isPhone) {
        return moment(date).format('ddd. MMM D, YYYY').toLowerCase();
      }
      return moment(date).format('dddd MMM D, YYYY').toLowerCase();
    },
    remains(val) {
      return val.unlimited ? 'unlimited' : val.limit;
    },
  },
};
</script>

<style lang="scss">
@media screen and (max-width: 767px){
  .el-dialog__title {
    font-size: 12px;
  }
  .el-dialog__header {
    padding: 20px 20px 10px;
  }
}
</style>

<style lang="scss" scoped>
.stock {
  padding: 1.5rem 0;
  &--list {
    display: flex;
    flex-direction: row;
    align-items: center;

    &__date {
      width: 40%;
    }
    &__ticket {
      width: 30%;
    }

    @media screen and (max-width: 767px){
      &__date {
        width: 50%;
      }
      &__ticket {
        width: 25%;
      }
    }
  }
}
.stock--list__header {
  font-weight: 300;
  font-size: 18px;
  margin-bottom: 2rem;
  padding: 0 2rem;

  .stock--list__ticket {
    text-align: center;
  }

  @media screen and (max-width: 767px){
    font-size: 12px;
  }
}

.stock--list__content {
  background-color: #F2F9FA;
  margin-bottom: 2rem;
  padding: 1rem 2rem;

  .stock--list__ticket {
    text-align: center;
  }

  @media screen and (max-width: 767px){
    font-size: 12px;
  }
}
</style>
