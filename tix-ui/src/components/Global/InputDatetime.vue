<template>
  <div class="wrap">
    <el-row :gutter="10">
      <el-col :span="14">
        <el-date-picker
          class="el-date-editor--iconless"
          v-model="date"
          @input="updateValue"
          type="date"
          format="MMMM dd, yyyy"
          :disabled="disabled"
          :picker-options="{disabledDate: disableDateIf}">
        </el-date-picker>
      </el-col>
      <el-col :span="10">
        <el-time-select class="el-date-editor--iconless"
          v-model="time"
          @input="updateValue"
          :disabled="disabled"
          :picker-options="{start: '00:00', step: '0:30', end: '23:30', minTime: minTime}">
        </el-time-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment';
import { Row, Col, DatePicker, TimeSelect } from 'element-ui';

export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElDatePicker: DatePicker,
    ElTimeSelect: TimeSelect,
  },
  props: {
    value: [String, Number],
    min: [String, Number],
    max: [String, Number],
    endDate: [Boolean],
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      date: null,
      time: null,
      datetime: null,
    };
  },
  computed: {
    minTime() {
      if (!this.min) return null;
      const minDay = moment.unix(this.min);
      const minDayIsSameDay = minDay.isSame(moment(this.date), 'day');
      return minDayIsSameDay ? minDay.utc().format('HH:mm') : null;
    },
  },
  watch: {
    value() {
      this.setDateAndTime();
    },
  },
  created() {
    this.setDateAndTime();
  },
  methods: {
    disableDateIf(date) {
      let disabled;
      const minDate = this.min ? moment.unix(this.min) : moment();
      const maxDate = this.max ? moment.unix(this.max) : moment();
      disabled = moment(date).isBefore(minDate.startOf('day'));
      if (this.max && !this.min) {
        disabled = moment(date).isAfter(maxDate.startOf('day'));
      }
      if (this.max && this.min) {
        disabled = moment(date).isAfter(maxDate.startOf('day')) || moment(date).isBefore(minDate.startOf('day'));
      }
      return disabled;
    },
    setDateAndTime() {
      if (!this.value || this.value === this.datetime) return;
      const dateObject = moment.unix(this.value);
      this.time = dateObject.utc().format('HH:mm');
      this.date = dateObject.utcOffset(1).set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }).toDate();
    },
    updateValue() {
      let time = this.time;
      if (time === null) {
        time = '00:00';
      }
      this.datetime = this.date ? this.generateDateString(this.date, time) : null;
      this.$emit('input', this.datetime);
    },
    generateDateString(date, time) {
      const formattedDate = moment(date);
      if (time) {
        const timeMoment = moment(time, 'HH:mm');
        formattedDate.utc().hour(timeMoment.get('hour'));
        formattedDate.utc().minute(timeMoment.get('minute'));
      }

      return formattedDate.add(1, 'days').unix();
    },
  },
};
</script>
