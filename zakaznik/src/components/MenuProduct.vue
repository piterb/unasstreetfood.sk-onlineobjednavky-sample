<template>
  <div
    class="tw-border tw-rounded tw-mb-2"
    :class="qty > 0 ? 'tw-border-warning' : 'tw-border-gray-300'"
    v-if="product.active === true"
  >
    <v-list-item
      class="tw-flex tw-h-32 xl:tw-h-40 tw-px-2 tw-py-2 tw-border-b border-gray-300"
      @click="expanded = !expanded"
    >
      <v-list-item-icon class="tw-w-1/3 tw-h-full tw-m-0 tw-mr-2">
        <v-img
          v-if="product.image"
          :src="product.image"
          class="tw-border tw-border-gray-300 tw-rounded"
        >
          <template v-slot:placeholder>
            <div class="tw-flex tw-border tw-border-gray-300 tw-rounded tw-bg-gray-200">
              <v-icon :size="100" class="tw-items-center tw-m-auto">
                {{
                category.icon
                }}
              </v-icon>
            </div>
          </template>
        </v-img>
        <v-img v-else>
          <v-icon
            :size="100"
            class="tw-flex tw-w-full tw-h-full tw-border tw-border-gray-300 tw-rounded tw-bg-gray-200"
          >{{ category.icon }}</v-icon>
        </v-img>
      </v-list-item-icon>

      <v-list-item-content class="tw-self-start tw-py-0 tw-mr-2">
        <v-list-item-title
          class="tw-mb-1 md:tw-mb-2 xl:tw-mb-4 tw-text-xs md:tw-text-sm xl:tw-text-base"
        >
          {{product.title}}
          <span
            v-if="product.alergens"
            style="vertical-align: super;"
            class="tw-text-gray-500 tw-text-2xs"
          >{{ product.alergens }}</span>
        </v-list-item-title>
        <v-list-item-action-text
          class="tw-text-xs xl:tw-text-sm truncate-5line"
          :class="
            product.description ? 'tw-mb-1 md:tw-mb-2 xl:tw-mb-4' : 'tw-mb-0'
          "
          v-text="product.description"
        ></v-list-item-action-text>
        <div class="accent--text tw-text-xs xl:tw-text-base">
          {{ product.price.toFixed(2) }} €
          <transition
            appear
            @before-enter="qtyBeforeEnter"
            @enter="qtyEnter"
            @leave="qtyLeave"
            :css="false"
          >
            <span v-if="qty > 0" class="tw-inline-block tw-font-bold warning--text">x {{ qty }}</span>
          </transition>
        </div>
      </v-list-item-content>

      <v-btn icon @click.stop="minusProduct">
        <v-icon size="40" color="grey lighten-3">mdi-minus-circle-outline</v-icon>
      </v-btn>
      <v-btn icon @click.stop="plusProduct">
        <v-icon size="40" color="accent">mdi-plus-circle-outline</v-icon>
      </v-btn>
    </v-list-item>

    <transition
      appear
      @before-enter="fieldBeforeEnter"
      @enter="fieldEnter"
      @leave="fieldLeave"
      :css="false"
    >
      <div v-if="expanded === true">
        <v-expansion-panels flat tile>
          <ProductVariant
            v-for="(variant, variantIndex) in product.ProductVariants"
            :key="variantIndex"
            :product="product"
            :variant="variant"
          ></ProductVariant>
        </v-expansion-panels>
      </div>
    </transition>
    <v-btn
      v-if="copy"
      text
      color="primary"
      small
      class="tw-w-full tw-h-16"
      @click="appendProduct(product)"
    >
      <v-icon left>mdi-plus-box-multiple-outline</v-icon>Pridať kópiu
    </v-btn>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { mapActions, mapGetters } from 'vuex'
import qtyTransitionMixin from '@/mixins/qtyTransitionMixin'
import ProductVariant from '@/components/ProductVariant'

export default {
  components: { ProductVariant },
  mixins: [qtyTransitionMixin],
  props: {
    product: {
      type: Object,
      required: true
    },
    category: {
      type: Object,
      required: true
    },
    copy: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    expanded: false
  }),
  methods: {
    ...mapActions('order', ['addProduct', 'removeProduct']),
    plusProduct() {
      if (this.qty == 0) {
        this.expanded = true
      }
      this.addProduct(this.product)
    },
    minusProduct() {
      if (this.qty == 1) {
        this.expanded = false
      }
      this.removeProduct(this.product)
    },
    appendProduct(product) {
      this.$emit('appendProduct', product)
    },
    fieldBeforeEnter(el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    fieldEnter(el, done) {
      gsap.to(el, {
        duration: 0.5,
        opacity: 1,
        height: 'auto',
        ease: 'power4',
        onComplete: done
      })
    },
    fieldLeave(el, done) {
      gsap.to(el, {
        duration: 0.5,
        opacity: 0,
        height: 0,
        ease: 'power4',
        onComplete: done
      })
    }
  },
  computed: {
    ...mapGetters('order', ['orderitems']),
    qty() {
      let orderitem = this.orderitems.find(
        item => item.instanceId === this.product.instanceId
      )
      return orderitem ? orderitem.qty : 0
    }
  }
}
</script>

<style lang="css"></style>
