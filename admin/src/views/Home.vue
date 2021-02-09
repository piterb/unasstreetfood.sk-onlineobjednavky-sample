<template>
  <v-container>
    <ProgressBar :enabled="progress" :absolute="false" :size="90" />

    <v-row align="baseline">
      <v-col cols="12" md="6" class="tw-text-left">
        <FilterPeriod @filter="filterByPeriod"></FilterPeriod>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card color="secondary">
          <v-card-subtitle class="tw-uppercase">Celkom</v-card-subtitle>

          <v-card-text
            class="tw-text-3xl tw-flex tw-items-center tw-justify-center"
          >
            <v-icon x-large class="tw-mr-2">mdi-cash-register</v-icon>
            <div>{{ total | toLocaleCurrency }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="secondary">
          <v-card-subtitle class="tw-uppercase"
            >Počet objednávok</v-card-subtitle
          >

          <v-card-text
            class="tw-text-3xl tw-flex tw-items-center tw-justify-center"
          >
            <v-icon x-large class="tw-mr-2"
              >mdi-checkbox-multiple-marked-outline</v-icon
            >
            <div>{{ orders.length }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="secondary">
          <v-card-subtitle class="tw-uppercase"
            >Najnižšia objednávka</v-card-subtitle
          >

          <v-card-text
            class="tw-text-3xl tw-flex tw-items-center tw-justify-center"
          >
            <v-icon x-large class="tw-mr-2">mdi-battery-10</v-icon>
            <div>{{ min | toLocaleCurrency }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="secondary">
          <v-card-subtitle class="tw-uppercase"
            >Najvyššia objednávka</v-card-subtitle
          >

          <v-card-text
            class="tw-text-3xl tw-flex tw-items-center tw-justify-center"
          >
            <v-icon x-large class="tw-mr-2">mdi-battery</v-icon>
            <div>{{ max | toLocaleCurrency }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="12" md="6">
        <v-card color="secondary">
          <v-card-subtitle class="tw-uppercase"
            >TOP 5 objednávok</v-card-subtitle
          >

          <v-card-text>
            <v-data-table
              :headers="[
                { text: 'Zákazník', value: 'userSnapshot' },
                { text: 'Celkom za jednu objednávku', value: 'total' }
              ]"
              :items="top5orders"
              no-data-text="Žiadne objednávky"
              disable-filtering
              disable-pagination
              disable-sort
              hide-default-footer
            >
              <template v-slot:item.userSnapshot="{ item }">
                {{ item.userSnapshot.firstname }}
                {{ item.userSnapshot.lastname }}
              </template>
              <template v-slot:item.total="{ item }">{{
                item.total | toLocaleCurrency
              }}</template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <v-card color="secondary">
          <v-card-subtitle class="tw-uppercase"
            >TOP 5 zákazníkov</v-card-subtitle
          >

          <v-card-text>
            <v-data-table
              :headers="[
                { text: 'Zákazník', value: 'userSnapshot' },
                { text: 'Suma objednávok', value: 'cumulative' }
              ]"
              :items="top5customers"
              no-data-text="Žiadne objednávky"
              disable-filtering
              disable-pagination
              disable-sort
              hide-default-footer
            >
              <template v-slot:item.userSnapshot="{ item }">
                {{ item.userSnapshot.firstname }}
                {{ item.userSnapshot.lastname }}
              </template>
              <template v-slot:item.cumulative="{ item }">{{
                item.cumulative | toLocaleCurrency
              }}</template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-card color="secondary">
          <v-card-subtitle class="tw-uppercase">TOP 5 položiek</v-card-subtitle>

          <v-card-text>
            <v-data-table
              :headers="[
                { text: 'Názov položky', value: 'productSnapshot' },
                { text: 'Počet objednaných ks', value: 'count' }
              ]"
              :items="top5items"
              no-data-text="Žiadne položky"
              disable-filtering
              disable-pagination
              disable-sort
              hide-default-footer
            >
              <template v-slot:item.productSnapshot="{ item }">{{
                item.productSnapshot.title
              }}</template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProgressBar from '@/components/ProgressBar'
import { toLocaleCurrency, toLocaleDatetime } from '@/utils/filters.js'
import FilterPeriod from '@/components/FilterPeriod'

export default {
  name: 'Home',
  components: { ProgressBar, FilterPeriod },
  filters: {
    toLocaleCurrency: toLocaleCurrency,
    toLocaleDatetime: toLocaleDatetime
  },
  data: () => ({
    progress: false,
    filter: { period: 'today' }
  }),
  created() {
    this.initOrders()
  },
  methods: {
    ...mapActions('notification', ['error']),
    ...mapActions('order', ['fetchOrders']),
    initOrders() {
      this.progress = true
      this.fetchOrders(this.filter.period)
        .then(() => {
          this.progress = false
        })
        .catch(error => {
          this.progress = false
          console.log(error)
          this.error(
            'Vyskytla sa chyba pri načítavaní objednávok. Skontrolujte prosím Vaše internetové pripojenie, prípadne skúste obnoviť stránku ešte raz.'
          )
        })
    },
    filterByPeriod(period) {
      this.filter.period = period
      this.initOrders()
    }
  },
  computed: {
    ...mapGetters('order', [
      'orders',
      'total',
      'min',
      'max',
      'top5orders',
      'top5customers',
      'top5items'
    ])
  }
}
</script>

<style lang="css">
.v-data-table__mobile-row {
  @apply tw-p-0 !important;
}
.v-data-table__mobile-row__header {
  @apply tw-pl-2;
}
.v-data-table__mobile-row__cell {
  @apply tw-pr-2;
}
</style>
