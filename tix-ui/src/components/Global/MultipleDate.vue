<template>
  <div class="wrap">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item class="first--child" label="event starts on" prop="startDate" :show-message="false">
          <el-date-picker
            class="el-date-editor--iconless"
            v-model="date"
            @input="updateStartDate"
            type="date"
            :disabled="edit"
            format="MMMM dd, yyyy"
            :picker-options="{disabledDate: disableDateIf}">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item class="first--child" label="event frequency" prop="frequency" :show-message="false">
          <select
            v-model="frequency"
            class="input"
            @change="updateFrequency"
            :disabled="edit"
          >
            <option
              v-for="item in frequencies"
              :key="item.title"
              :label="item.title"
              :value="item.value">
              {{ item.title }}
            </option>
          </select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item class="first--child" label="event start time" prop="startDate" :show-message="false">
          <el-time-select class="el-date-editor--iconless"
            v-model="startTime"
            @change="updateStartDate"
            :disabled="edit"
            :picker-options="{start: '00:00', step: '0:30', end: '23:30'}">
          </el-time-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item class="first--child" label="event end time" prop="endDate" :show-message="false">
          <el-time-select class="el-date-editor--iconless"
            v-model="endTime"
            @change="updateEndDate"
            :disabled="edit"
            :picker-options="{start: '00:00', step: '0:30', end: '23:30', minTime: startTime}">
          </el-time-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :md="12">
        <el-form-item class="first--child" label="ends" prop="endDate" :show-message="false">
          <div class="flex" :class="{'disabled': type !== 'endDate'}">
            <el-radio v-model="type" label="endDate">
              <span class="input-text">on</span>
              <el-date-picker
                class="el-date-editor--iconless"
                v-model="end"
                @input="updateEndDate"
                type="date"
                :disabled="edit"
                format="MMMM dd, yyyy"
                :picker-options="{disabledDate: disableEndDate}">
              </el-date-picker>
            </el-radio>
          </div>
        </el-form-item>
      </el-col>
      <el-col :xs="24" v-if="type === 'repeats'">
        <p v-if="!frequency" class="error">please select a frequency</p>
        <p v-if="!validRepeats" class="error">please enter a valid number of occurences between 1 - 19</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24">
        <el-form-item class="first--child" label="" prop="repeats" :show-message="false">
          <div class="flex" :class="{'disabled': type !== 'repeats'}">
            <el-radio v-model="type" label="repeats">
              <span class="input-text">after</span>
              <el-input class="input-number" type="number" v-model.number="repeats" @input="updateOccurrence" min="1" max="19" :disabled="edit" />
              <span>number of occurrences</span>
            </el-radio>
          </div>
        </el-form-item>
      </el-col>
      <el-col :xs="24">
        <span v-if="!validEndDate" class="error">the date entered doesn't match a possible end date, please change to a valid date</span>
      </el-col>
    </el-row>
    <div class="duration" v-if="end">
      <p>{{ repeats + 1 }} dates</p>
      <p>starting {{formatDate(date)}} ending on {{formatDate(end)}}</p>
    </div>
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
    value: Object,
    valid: Boolean,
    edit: Boolean,
  },
  data() {
    return {
      date: null,
      end: null,
      startTime: null,
      endTime: null,
      startDate: null,
      endDate: null,
      frequency: null,
      repeats: null,
      type: 'endDate',
      possibleDates: [],
      frequencies: [
        {
          title: 'every day',
          value: 'daily',
        },
        {
          title: 'every week',
          value: 'weekly',
        },
        {
          title: 'every two weeks',
          value: 'biweekly',
        },
      ],
    };
  },
  created() {
    this.setValues();
  },
  computed: {
    validEndDate() {
      return this.end ? this.possibleDates.indexOf(this.end.toString()) !== -1 : true;
    },
    validRepeats() {
      return Number(this.repeats) >= 1 && Number(this.repeats) <= 19;
    },
    validForm() {
      return this.validEndDate && this.validRepeats && this.frequency && (this.date !== null);
    },
  },
  methods: {
    disableDateIf(date) {
      const minDate = moment();
      return moment(date).isBefore(minDate.startOf('day'));
    },
    disableEndDate(date) {
      if (this.possibleDates === []) {
        return false;
      }
      return this.possibleDates.indexOf(date.toString()) === -1;
    },
    setValues() {
      if (!this.value.startDate || this.value.startDate === this.startDate) return;
      const start = moment.unix(this.value.startDate);
      const end = moment.unix(this.value.endDate);
      this.startTime = start.utc().format('HH:mm');
      this.endTime = end.utc().format('HH:mm');
      this.date = start.utcOffset(1).set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }).toDate();
      this.end = end.utcOffset(1).set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }).toDate();
      if (this.value.repeats !== 0) {
        this.repeats = this.value.repeats;
      }
      if (this.value.frequency !== '' || this.value.frequency !== 'once') {
        this.frequency = this.value.frequency;
        this.updatePossibleDates();
      }
      this.$emit('validate', this.validForm);
    },
    updateStartDate() {
      const formData = this.value;
      let time = this.startTime;
      if (time === null) {
        time = '00:00';
        this.startTime = '00:00';
      }
      this.startDate = this.date ? this.generateDateString(this.date, time) : null;
      formData.startDate = this.startDate;
      this.updatePossibleDates();
      this.$emit('input', formData);
      this.$emit('validate', this.validForm);
    },
    updateEndDate() {
      const formData = this.value;
      let time = this.endTime;
      if (time === null) {
        time = '00:00';
      }
      this.endDate = this.date ? this.generateDateString(this.date, time) : null;
      formData.endDate = this.endDate;
      if (this.type === 'endDate') this.getRepeats();
      this.$emit('input', formData);
      this.$emit('validate', this.validForm);
    },
    updateOccurrence() {
      if (this.type === 'repeats' && this.frequency) {
        this.end = this.possibleDates[this.repeats - 1];
        this.updateEndDate();
      }
      const formData = this.value;
      formData.repeats = this.repeats;
      this.$emit('input', formData);
      this.$emit('validate', this.validForm);
    },
    updateFrequency() {
      const formData = this.value;
      formData.frequency = this.frequency;
      this.updatePossibleDates();
      this.getRepeats();
      this.$emit('input', formData);
      this.$emit('validate', this.validForm);
    },
    changeEndTime() {
      const endTime = 1800;
      const futureEndDate = this.endDate && (this.endDate > this.startDate);
      if (!this.startDate || futureEndDate) return;
      this.endDate = this.startDate + endTime;
      this.endTime = moment.unix(this.endDate).utc().format('HH:mm');
      this.updateEndDate();
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
    updatePossibleDates() {
      const d = '_d';
      if (this.frequency && this.date) {
        this.possibleDates = [];
        switch (this.frequency) {
          case 'daily':
            for (let i = 1; i < 20; i += 1) {
              this.possibleDates.push(moment(this.date).add(i, 'd')[d].toString());
            }
            break;
          case 'weekly':
            for (let i = 1; i < 20; i += 1) {
              this.possibleDates.push(moment(this.date).add(i, 'w')[d].toString());
            }
            break;
          case 'biweekly':
            for (let i = 1; i < 20; i += 1) {
              this.possibleDates.push(moment(this.date).add(i * 2, 'w')[d].toString());
            }
            break;
          default:
            break;
        }
      }
    },
    getRepeats() {
      if (this.end && this.frequency) {
        this.repeats = this.possibleDates.indexOf(this.end.toString()) + 1;
        this.updateOccurrence();
      }
    },
    formatDate(val) {
      return moment(val).format('MMMM D, YYYY').toLowerCase();
    },
  },
  watch: {
    value() {
      this.setValues();
    },
    startDate() {
      this.changeEndTime();
    },
  },
};
</script>

<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type=number] {
  -moz-appearance: textfield;
}
.el-radio__input.is-checked+.el-radio__label {
  color: inherit;
}
</style>

<style lang="scss" scoped>
.input {
  padding: 1rem;
  width: 100%;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: $color-black;
  -moz-appearance: none;
  -webkit-appearance: none;
  background-repeat: no-repeat, repeat;
  background-position: right 1rem top 50%, 0 0;
  background-size: 1rem auto, 100%;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='8' height='6' viewBox='0 0 8 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.06667 0.733307L8 1.66664L4 5.66664L-4.07973e-08 1.66664L0.933333 0.733307L4 3.79997L7.06667 0.733307Z' fill='%23333333'/%3E%3C/svg%3E%0A");
}
.input:focus {
  outline: none;
}
.input:disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
.flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    font-weight: 300;
    font-size: 14px;
  }
  .input-text {
    width: 20px;
  }
  .input-number {
    width: 50px;
  }
  .el-input {
    margin: 0 7.5px;
  }
}
.disabled {
  opacity: 0.3;
}
.duration {
  margin-bottom: 1.5rem;
  p {
    font-size: 12px;
  }
}
.error {
  position: relative;
  color: #f56c6c;
  font-size: 12px;
  bottom: 15px;
}
</style>
