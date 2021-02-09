<template>
  <v-container>
    <v-row>
      <v-col cols="0" sm="0" md="2" class="tw-p-2">
        <CategoryList :categories="categories"></CategoryList>
      </v-col>
      <v-col cols="12" sm="12" md="7" class="tw-p-2">
        <div>
          <ProgressBar
            :enabled="progress.products"
            :absolute="false"
            :size="90"
          />

          <div v-if="categories && categories.length > 0">
            <MenuCategory
              two-line
              subheader
              v-for="(category, categoryIndex) in categories"
              :key="categoryIndex"
              :category="category"
            ></MenuCategory>
          </div>
          <div
            v-else-if="noProductsMessage"
            class="tw-text-2xl tw-text-gray-600"
          >
            <div>
              <v-icon x-large class="tw-flex tw-justify-center"
                >mdi-silverware</v-icon
              >
              <div class="tw-text-center">{{ noProductsMessage }}</div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="0" sm="0" md="3" class="tw-p-2">
        <v-card class="tw-mb-3">
          <v-card-title>Adresa & Kontakt</v-card-title>
          <v-card-text>
            <a
              :href="'https://maps.google.com/?q=' + shop.address"
              target="_blank"
              class="tw-block tw-mb-4"
              >{{ shop.address }}</a
            >
            <a :href="'tel:' + shop.phone" class="tw-block tw-mb-4">{{
              shop.phone
            }}</a>
            <a :href="shop.web" target="_blank" class="tw-block">{{
              shop.web
            }}</a>
          </v-card-text>
        </v-card>
        <v-card class="tw-mb-3">
          <v-card-title>Otváracia doba</v-card-title>
          <v-card-text>
            <ul class="pl-0">
              <li
                v-for="(day, dayIndex) in businesshours"
                :key="dayIndex"
                class="tw-flex tw-justify-between"
              >
                <div class="tw-capitalize">
                  {{
                    moment()
                      .weekday(dayIndex)
                      .format('dddd')
                  }}
                </div>
                <div v-if="day.closed === true">Zatvorené</div>
                <div v-else>{{ day.open }} - {{ day.close }}</div>
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>Donáška</v-card-title>
          <v-card-text>
            <ul class="pl-0">
              <li
                v-for="(day, dayIndex) in deliveryhours"
                :key="dayIndex"
                class="tw-flex tw-justify-between"
              >
                <div class="tw-capitalize">
                  {{
                    moment()
                      .weekday(dayIndex)
                      .format('dddd')
                  }}
                </div>
                <div v-if="day.closed === true">Bez donášky</div>
                <div v-else>{{ day.open }} - {{ day.close }}</div>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <ScrollTopButton />
  </v-container>
</template>

<script>
import moment from 'moment'
import MenuCategory from '@/components/MenuCategory'
import CategoryList from '@/components/CategoryList'
import { mapActions, mapGetters } from 'vuex'
import ProgressBar from '@/components/ProgressBar'
import ScrollTopButton from '@/components/ScrollTopButton'

moment.locale('sk')

export default {
  components: { MenuCategory, ProgressBar, ScrollTopButton, CategoryList },
  data() {
    return {
      progress: {
        products: false
      },
      noProductsMessage: null
    }
  },
  mounted() {
    this.initCategories()
  },
  methods: {
    ...mapActions('notification', ['error']),
    ...mapActions('menu', ['fetchCategories']),
    moment: moment,
    initCategories() {
      this.progress.products = true
      this.noProductsMessage = null

      this.fetchCategories()
        .then(() => {
          this.progress.products = false
        })
        .catch(error => {
          this.progress.products = false
          console.log(error)

          if (error.response && error.response.status == '404') {
            this.noProductsMessage =
              'Reštaurácia momentálne neponúka žiadne produkty.'
          } else {
            this.error(
              'Vyskytla sa chyba pri načítavaní menu. Skontrolujte prosím Vaše internetové pripojenie, prípadne skúste obnoviť stránku ešte raz.'
            )
          }
        })
    }
  },
  computed: {
    ...mapGetters('shop', ['shop']),
    ...mapGetters('menu', ['categories']),
    ...mapGetters('notification', ['notification']),
    businesshours() {
      return this.shop.businesshours_days ? this.shop.businesshours_days : []
    },
    deliveryhours() {
      return this.shop.deliveryhours_days ? this.shop.deliveryhours_days : []
    }
  }
}
</script>

<style lang="css">
.category-w-32 .v-btn__content {
  @apply tw-inline tw-w-32 tw-truncate tw-text-left;
}
.category-w-40 .v-btn__content {
  @apply tw-inline tw-w-40 tw-truncate tw-text-left;
}
</style>
