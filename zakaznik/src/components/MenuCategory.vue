<template>
  <v-list two-line subheader v-if="category.Products.length > 0">
    <h2 :id="'cat_' + category.id" class="title tw-mb-2">
      {{ category.name }}
    </h2>
    <div v-if="category.description" class="tw-mb-2 tw-text-gray-600">
      {{ category.description }}
    </div>
    <MenuProduct
      v-for="(product, productIndex) in category.Products"
      :key="productIndex"
      :product="product"
      :category="category"
      @appendProduct="appendProduct"
    ></MenuProduct>
  </v-list>
</template>

<script>
import MenuProduct from '@/components/MenuProduct'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: { MenuProduct },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  methods: {
    appendProduct(product) {
      const productIndex = this.category.Products.findIndex(
        item => item.instanceId === product.instanceId
      )

      // Copy product
      const newProduct = JSON.parse(JSON.stringify(product))
      newProduct.instanceId = uuidv4()

      // Copy orderitem
      this.$store.dispatch('order/copyOrderItem', {
        originalProduct: product,
        newProduct: newProduct
      })

      // Append to menu
      this.category.Products.splice(productIndex + 1, 0, newProduct)
    }
  }
}
</script>

<style lang="css"></style>
