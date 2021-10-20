<template>
  <div>
    <h2 class="summary__header">{{ header }}</h2>
    <div v-if="tableData.length">
      <table v-if="!isPhone" CELLSPACING=0 BORDER=0 CELLPADDING=0 class="summary__table">
        <thead>
          <tr>
            <th v-for="(header, index) in tableHeader" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rowData, index) in tableData" :key="index" :style="{ backgroundColor: bodyColor }">
            <td v-for="(cellData, index) in rowData" :key="index">{{ cellData }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <div v-for="(rowData, index) in tableData" :key="index" class="summary__block" :style="{ backgroundColor: bodyColor }">
            <div v-for="(cellData, index) in rowData" :key="index" class="summary__block-row" :style="{ borderBottom: mobileBlockBorderBottom }">
              <span>{{ tableHeader[index]}}</span>
              <span>{{ cellData }}</span>
            </div>
          </div>
        </div>
      </div>
    <h3 class="summary__text" v-else>{{ noTableData }}</h3>
  </div>
</template>

<script>
import IsPhone from '@/mixins/IsPhone';

export default {
  name: 'sales-tab-table',
  mixins: [IsPhone],
  props: {
    header: {
      type: String,
      required: true,
    },
    tableHeader: {
      type: Array,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
    noTableData: {
      type: String,
      required: true,
    },
    bodyColor: {
      type: String,
      default: '#FFF7F5',
    },
    mobileBlockBorderBottom: {
      type: String,
      default: '0.5px solid rgba(252, 100, 53, 0.05)',
    },
  },
};
</script>

<style lang="scss" scoped>
  .summary {
    @media screen and (max-width: 600px) {
      margin: 0 1.5rem;
    }
    &__text {
      color: $--color-green;
      font-size: 1.6rem;
      @media screen and (max-width: 450px) {
        font-size: 1.2rem;
      }
    }
    &__header {
      padding-bottom: 2.5rem;
      letter-spacing: revert;
      font-size: 1.8rem;
      @media screen and (max-width: 800px) {
        font-size: 1.6rem;
        padding-bottom: 2.2rem;
      }
      @media screen and (max-width: 450px) {
        font-size: 1.4rem;
        padding-bottom: 1.4rem;
      }
    }
    &__block {
      margin-bottom: 1.4rem;
      padding: 0.7rem 1.7rem 0.7rem 1.5rem;
      font-weight: 300;
      border-radius: 4px;
      opacity: 0.7;
      &-row {
        display: flex;
        justify-content: space-between;
        line-height: 1.2rem;
        padding: 0.7rem 0;
        font-size: 1rem;
        &:last-child {
          border-bottom: none !important;
        }
      }
      @media screen and (min-width: 768px) {
        display: none;
      }
    }
    &__table {
      width: 100%;
      text-align: left;
      line-height: 1.2;
      font-weight: 300;
      border-collapse: separate;
      border-spacing: 0 0.6rem;
      th {
        font-size: 1.6rem;
        font-weight: 300;
        padding-bottom: 0.9rem;
        padding-left: 1.3rem;
        @media screen and (max-width: 800px){
          font-size: 1.4rem;
          padding-bottom: 0.5rem;
        }
      }
      td {
        font-size: 1.4rem;
        padding: 1.1rem 0 1.1rem 1.3rem;
        opacity: 0.9;
        @media screen and (max-width: 800px) {
          font-size: 1.2rem;
        }
        &:first-child {
          width: 25%;
        }
      }
      tbody {
        tr {
          border-radius: 4px;
          margin-bottom: 0.6rem;
        }
      }
    }
  }
</style>
