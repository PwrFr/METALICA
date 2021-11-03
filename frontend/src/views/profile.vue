<template>
  <div style="height: 100vh; padding-top: 3.5rem">
    <div class="row bg-black justify-content-between">
      <h1 class="display-4 text-light pt-3 ml-5 title">Profile</h1>
      <h1 class="display-4 text-light pt-3 mr-5 titleCat">Order History</h1>
    </div>

    <div class="row justify-content-center mt-4">
      <div class="col-4 text-light text-center">
        <div class="nav-link mx-5 profile">
          <svg
            class="profile"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            width="150"
            height="150"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"
            />
          </svg>
          <h1 class="text-uppercase p-3 profile">
            {{ $route.params.user.user_name }}
          </h1>
        </div>
        <div class="p-3" v-if="!edit && !address">
          <h5 class="mt-3 profile">ID :{{ $route.params.user.user_id }}</h5>
          <h5 class="mt-3 profile">
            User Name : {{ $route.params.user.user_name }}
          </h5>
          <h5 class="mt-3 profile">
            User Role : {{ $route.params.user.user_role }}
          </h5>
          <h5 class="mt-3 profile">
            Address : {{ $route.params.user.user_address }}
          </h5>
        </div>
        <div class="p-3" v-if="edit">
          <label class="mt-3">Edit User Name</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': $v.Eusername.$error }"
            v-model="$v.Eusername.$model"
          />
        </div>
        <div class="p-3" v-if="address">
          <label class="mt-3">Edit Address</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': $v.Eaddress.$error }"
            v-model="$v.Eaddress.$model"
          />
        </div>
        <button
          class="btn btn-warning"
          @click="editProfile()"
          v-if="!edit && !address"
        >
          Edit User
        </button>
        <button class="btn btn-primary" @click="submitProfile()" v-if="edit">
          save
        </button>
        <button
          class="btn btn-secondary ml-3"
          @click="CancelProfile()"
          v-if="edit"
        >
          Cancel
        </button>
        <button
          class="btn btn-warning ml-3"
          @click="editAddress()"
          v-if="!address && !edit"
        >
          Edit Address
        </button>
        <button class="btn btn-primary" @click="submitAddress()" v-if="address">
          save
        </button>
        <button
          class="btn btn-secondary ml-3"
          @click="CancelAddress()"
          v-if="address"
        >
          Cancel
        </button>
      </div>
      <div class="col-7">
        <div
          class="row"
          style="overflow: auto; height: 65vh"
          v-if="orderhistory.length >= 1 && orderhistory[0].user_id != null"
        >
          <div
            class="col-4 justify-content-center my-3"
            v-for="item in orderhistory"
            :key="item"
          >
            <div
              class="card card-bg nav-link p-0"
              style="background-color: rgb(50, 50, 50)"
            >
              <img
                :src="'http://localhost:3000' + item.url"
                class="rounded"
                style="height: cover"
              />
              <div class="card-body text-light">
                <h5 class="card-title">{{ item.brand }} {{ item.model }}</h5>
                <p class="card-text">
                  Price:{{ item.price }}<br />
                  Date:
                  {{ Date(item.date.substring(0, 10)).substring(0, 15) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "@/plugins/axios";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      orderhistory: [],
      edit: false,
      address: false,
      Eusername: "",
      Eaddress: "",
    };
  },
  validations: {
    Eusername: {
      minLength: minLength(5),
      maxLength: maxLength(20),
    },
    Eaddress: {
      minLength: minLength(20),
    },
  },
  methods: {
    submitProfile() {
      this.$v.$touch();

      // เช็คว่าในฟอร์มไม่มี error
      if (!this.$v.$invalid) {
        let data = {
          userid: this.$route.params.user.user_id,
          username: this.Eusername,
        };
        axios
          .put("/edituser", data)
          .then((res) => {
            this.$route.params.user.user_name = res.data[0].user_name;
            alert("Edit User Success");
            this.Eusername = "";
            this.edit = !this.edit;
          })
          .catch((err) => {
            alert(err.response.data.details.message);
          });
      }
    },
    submitAddress() {
      this.$v.$touch();

      // เช็คว่าในฟอร์มไม่มี error
      if (!this.$v.$invalid) {
        let data = {
          userid: this.$route.params.user.user_id,
          address: this.Eaddress,
        };
        axios
          .put("/editaddress", data)
          .then((res) => {
            this.$route.params.user.user_address = res.data[0].user_address;
            alert("Edit Address Success");
            this.Eaddress = "";
            this.address = !this.address;
          })
          .catch((err) => {
            alert(err.response.data.details.message);
          });
      }
    },

    editProfile() {
      this.edit = !this.edit;
      this.Eusername = this.$route.params.user.user_name;
    },
    CancelProfile() {
      this.Eusername = "";
      this.edit = !this.edit;
    },
    editAddress() {
      this.address = !this.address;
      this.Eaddress = this.$route.params.user.user_address;
    },
    CancelAddress() {
      this.Eaddress = "";
      this.address = !this.address;
    },
  },

  computed: {},

  mounted() {
    axios
      .get(`/orderhistory/${this.$route.params.user.user_id}`)
      .then((response) => {
        console.log(response.data);
        this.orderhistory = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
<style scoped>
.profile {
  transition: all 0.2s;
}
.profile:hover {
  color: #ee801e;
  transform: scale(1.05);
}
</style>