
<template>
  <div>
    <div class="parallax">
      <div class="d-flex justify-content-start ml-5">
        <h1
          class="text-uppercase text-white display-1"
          style="margin: 65vh 0 0 0"
        >
          Metalica
        </h1>
      </div>
    </div>
    <div
      class="parallax2 mt-3"
      v-for="(i, index) in duplicates"
      :key="i"
      v-bind:style="{
        'background-image': 'url(' + imagePath(i.InstrumentImg) + ')',
      }"
    >
      <product
        :products="productitem"
        :index="productitem[index]"
        :col="index"
        :Title="i"
      />
    </div>
  </div>
</template>

<script>
const product = () => import("@/components/HomeProduct");
export default {
  components: { product },
  props: ["productitem"],
  data() {
    return {};
  },
  methods: {
    imagePath(file_path) {
      return "http://localhost:3000" + file_path.replace(/\\/g, "/");
    },
  },
  computed: {
    duplicates() {
      return this.productitem.reduce((acc, current) => {
        const x = acc.find(
          (item) => item.instrument_id === current.instrument_id
        );
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
    },
  },
};
</script>

<style scoped>
.parallax {
  /* The image used */
  background-image: url("https://www.ibanez.com/images/artists/category/ACOUSTIC-GUITARS_bg.jpg");

  /* Set a specific height */
  height: 100vh;
  /* Create the parallax scrolling effect */
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
}
.parallax2 {
  /* The image used */

  /* Set a specific height */
  background-size: cover;
  height: 110vh;
  /* Create the parallax scrolling effect */
  background-attachment: fixed;
  background-position: 70%;
  background-repeat: no-repeat;
}
</style>