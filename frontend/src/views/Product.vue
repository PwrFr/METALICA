<template>
  <div class="text-light">
    <div class="row" style="padding-top: 8vh; height: 100vh">
      <div class="col-9 bg-white">
        <div class="row h-100 justify-content-center align-items-center">
          <img
            :src="'http://localhost:3000' + $route.params.productName.url"
            alt=""
            style="transform: scale(1.19)"
          />
        </div>
      </div>
      <div class="col-3 bg-black">
        <div class="p-3" style="font-size: 0.8rem">
          <h2 class="p-1">
            {{
              $route.params.productName.brand +
              " " +
              $route.params.productName.model
            }}
          </h2>
          <ul class="p-0">
            <li
              v-for="i in JSON.parse(this.$route.params.productName.detail)"
              :key="i"
            >
              {{ i }}
            </li>
          </ul>
          <div class="form-group" v-if="EditDetail">
            <label class="mt-3">Edit Price</label>

            <input
              type="text"
              class="form-control"
              :class="{
                'is-invalid': $v.price.$error,
              }"
              v-model="$v.price.$model"
            />
            <template v-if="$v.price.$error">
              <small class="text-danger" v-if="!$v.price.required"
                >This field is required<br
              /></small>
              <small class="text-danger" v-if="!$v.price.numeric"
                >Only Number<br
              /></small>
            </template>
            <button
              type="button"
              class="btn btn-primary btn-block my-4"
              @click="Saveedit()"
            >
              save
            </button>
          </div>
          <h4 v-if="!EditDetail">฿{{ $route.params.productName.price }}</h4>
          <button
            v-if="!EditDetail"
            @click="order()"
            type="button"
            class="btn btn-success btn-block my-4"
          >
            Order
          </button>
          <button
            v-if="!EditDetail && role == 'Admin'"
            type="button"
            class="btn btn-warning"
            @click="edit()"
          >
            Edit
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            v-if="EditDetail"
            @click="EditDetail = !EditDetail"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "@/plugins/axios";
import { required, numeric } from "vuelidate/lib/validators";

export default {
  props: {
    productName: String,
  },
  validations: {
    price: {
      required,
      numeric,
    },
  },
  data() {
    return {
      productSpec: [],
      EditDetail: false,
      detail: "",
      price: "",
      role: "",
    };
  },
  methods: {
    Saveedit() {
      let Detail = new FormData();
      Detail.append("productid", this.$route.params.productName.product_id);
      Detail.append("price", this.price);
      axios
        .put("/detail", Detail)
        .then((res) => {
          this.$route.params.productName.price = res.data[0].price;
        })
        .catch((e) => console.log(e.response.data));
      this.EditDetail = !this.EditDetail;
    },
    edit() {
      this.price = this.$route.params.productName.price;
      this.EditDetail = !this.EditDetail;
    },
    order() {
      if (!this.$route.params.user) {
        alert("You need to Login Before Order");
        this.$router.push({ path: "/login" });
      } else {
        let Order = new FormData();
        Order.append("userid", this.$route.params.user.user_id);
        Order.append("productid", this.$route.params.productName.product_id);
        axios
          .post("/order", Order)
          .then((res) => {
            alert(res.data);
            this.$router.push({ path: "/" });
          })
          .catch((e) => alert(e.response.data));
      }
    },
  },
  mounted() {
    this.role = this.$route.params.user.user_role;
  },

  // this.detail = this.productSpec;
  // this.detail = this.detail;
};
</script>