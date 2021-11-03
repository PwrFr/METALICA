<template>
  <div style="height: 100vh">
    <div class="h-100 row align-items-center">
      <div class="col d-flex justify-content-center text-center">
        <div class="card w-50">
          <div class="card-header"><h3 class="m-0">Register</h3></div>
          <div class="card-body">
            <form>
              <div class="form-group row">
                <label for="staticEmail" class="col-3 col-form-label"
                  >Username</label
                >
                <div class="col-9 text-left">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': $v.username.$error }"
                      v-model="$v.username.$model"
                      placeholder="Username"
                    />
                  </div>
                  <template v-if="$v.username.$error">
                    <small class="text-danger" v-if="!$v.username.required"
                      >This field is required</small
                    >
                    <small class="text-danger" v-if="!$v.username.minLength">
                      Too Short</small
                    >

                    <small class="text-danger" v-if="!$v.username.maxLength"
                      >Too Long</small
                    >
                  </template>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-3 col-form-label"
                  >Password</label
                >
                <div class="col-9 text-left">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Password"
                    :class="{ 'is-invalid': $v.password.$error }"
                    v-model="$v.password.$model"
                  />
                  <template v-if="$v.password.$error">
                    <small class="text-danger" v-if="!$v.password.required"
                      >This field is required<br
                    /></small>
                    <small class="text-danger" v-if="!$v.password.minLength">
                      Too Short<br
                    /></small>

                    <small class="text-danger" v-if="!$v.password.complex"
                      >Need Uppercase Lowercase and Number</small
                    >
                  </template>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-3 col-form-label"
                  >Confirm Password</label
                >
                <div class="col-9 text-left">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Confirm Password"
                    :class="{ 'is-invalid': $v.confirm_password.$error }"
                    v-model="$v.confirm_password.$model"
                  />
                  <template v-if="$v.confirm_password.$error">
                    <small
                      class="text-danger"
                      v-if="!$v.confirm_password.sameAs"
                      >Same as Password<br
                    /></small>
                  </template>
                </div>
              </div>
              <div class="form-group row">
                <label for="staticEmail" class="col-3 col-form-label"
                  >Address</label
                >
                <div class="col-9 text-left">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Address"
                      :class="{ 'is-invalid': $v.address.$error }"
                      v-model="$v.address.$model"
                    />
                  </div>
                  <template v-if="$v.address.$error">
                    <small class="text-danger" v-if="!$v.address.required"
                      >This field is required<br
                    /></small>
                    <small class="text-danger" v-if="!$v.address.minLength">
                      Too Short<br
                    /></small>
                  </template>
                </div>
              </div>
            </form>
            <button class="btn btn-primary" @click="register()">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  required,
  minLength,
  maxLength,
  sameAs,
} from "vuelidate/lib/validators";
import axios from "@/plugins/axios";
function complexPassword(value) {
  if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
    return false;
  }
  return true;
}
export default {
  data() {
    return {
      username: "",
      password: "",
      confirm_password: "",
      address: "",
    };
  },
  methods: {
    register() {
      // Validate all fields
      this.$v.$touch();

      // เช็คว่าในฟอร์มไม่มี error
      if (!this.$v.$invalid) {
        let data = {
          username: this.username,
          password: this.password,
          confirm_password: this.confirm_password,
          address: this.address,
        };

        axios
          .post("/register", data)
          .then(() => {
            alert("Sign up Success");
            this.$router.push({ path: "/login" });
          })
          .catch((err) => {
            alert(err.response.data.details.message);
          });
      }
    },
  },
  validations: {
    username: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(20),
    },
    password: {
      required,
      minLength: minLength(8),
      complex: complexPassword,
    },
    confirm_password: {
      sameAs: sameAs("password"),
    },
    address: {
      required,
      minLength: minLength(20),
    },
  },
};
</script>