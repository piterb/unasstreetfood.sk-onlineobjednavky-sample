<template>
  <v-menu class="tw-mb-2" transition="slide-y-transition" bottom>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on">
        {{ periods.find(p => p.name == period).label }}
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-list-item v-for="(pair, pairIndex) in periodPairs" :key="pairIndex">
          <div class="tw-w-1/2">
            <v-btn text @click="filter(pair[0].name)">{{
              pair[0].label
            }}</v-btn>
          </div>
          <div class="tw-w-1/2">
            <v-btn text @click="filter(pair[1].name)">{{
              pair[1].label
            }}</v-btn>
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    initperiod: {
      type: String,
      required: false,
      default: 'today'
    }
  },
  created() {
    this.period = this.initperiod
  },
  data: () => ({
    period: null,
    periods: [
      {
        name: 'today',
        label: 'Dnes'
      },
      {
        name: 'yesterday',
        label: 'Včera'
      },
      {
        name: 'thisweek',
        label: 'Tento týždeň'
      },
      {
        name: 'lastweek',
        label: 'Minulý týždeň'
      },
      {
        name: 'thismonth',
        label: 'Tento mesiac'
      },
      {
        name: 'lastmonth',
        label: 'Minulý mesiac'
      },
      {
        name: 'thisquarter',
        label: 'Tento kvartál'
      },
      {
        name: 'lastquarter',
        label: 'Minulý kvartál'
      },
      {
        name: 'thisyear',
        label: 'Tento rok'
      },
      {
        name: 'lastyear',
        label: 'Minulý rok'
      }
    ]
  }),
  methods: {
    filter(period) {
      this.period = period
      this.$emit('filter', period)
    }
  },
  computed: {
    periodPairs() {
      return this.periods.reduce(function(result, value, index, array) {
        if (index % 2 === 0) result.push(array.slice(index, index + 2))
        return result
      }, [])
    }
  }
}
</script>
