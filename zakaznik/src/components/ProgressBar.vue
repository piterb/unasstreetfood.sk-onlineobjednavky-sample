<template>
  <v-overlay v-if="enabled" :value="true" :absolute="absolute" :opacity="opacity" color="secondary">
    <div v-if="message" class="tw-w-full tw-m-auto" align-content="center" justify="center">
      <div class="subtitle-1 text-center tw-text-gray-800">{{message}}</div>
      <div>
        <v-progress-linear color="primary" indeterminate height="6"></v-progress-linear>
      </div>
    </div>
    <div v-else class="tw-w-full tw-m-auto" align-content="center" justify="center">
      <div>
        <v-progress-circular class :size="size" color="primary" indeterminate></v-progress-circular>
      </div>
    </div>
  </v-overlay>
</template>

<script>
export default {
  props: {
    enabled: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: false,
      default: ''
    },
    absolute: {
      type: Boolean,
      required: false,
      default: true
    },
    size: {
      type: Number,
      required: false,
      default: 60
    }
  },
  data: () => ({
    opacity: 0.7
  })
}
</script>

<style lang="css">
</style>