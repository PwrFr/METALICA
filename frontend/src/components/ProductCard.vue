<template>
  <div
    class="card card-bg col-3 p-3 m-4 text-center"
    style="background-color: rgb(50, 50, 50)"
  >
    <img
      :src="'http://localhost:3000' + text.url"
      alt=""
      class="rounded"
      style="height: cover"
    />

    <div class="card-body p-3">
      <p class="card-title text-light">
        {{ text.brand + " " + text.model }}
      </p>

      <router-link
        :to="{ name: 'Product', params: { productName: text, user: user } }"
        class="btn btn-success btn-block"
        >Buy</router-link
      >
      <button
        v-if="role == 'Admin'"
        type="button"
        class="btn btn-danger btn-block"
        @click="DeleteProduct(text, position)"
      >
        Delete
      </button>
    </div>
  </div>
</template>
<script>
import axios from "@/plugins/axios";

export default {
  data() {
    return {
      role: "",
    };
  },
  props: {
    user: [],
    text: [],
    position: [],
    Products: [],
  },

  methods: {
    DeleteProduct(product, index) {
      let confirmResult = confirm(
        "Are you sure to Delete :" +
          product.brand +
          " " +
          product.model +
          " id :" +
          product.product_id
      );
      if (confirmResult) {
        axios
          .delete(`/catalog/${product.product_id}`, {
            params: {
              imgid: product.img_id,
            },
          })
          .then(() => {
            this.Products.splice(index, 1);
          });
      }
    },
  },
  mounted() {
    this.role = this.user.user_role;
  },
};
</script>
<style scoped>
a {
  color: white;
}
a:hover {
  text-decoration: none;
}
</style>