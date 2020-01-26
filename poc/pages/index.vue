<template>
  <div>
    <h1 class="title">Customer Data Parser Demo</h1>
    <div class="columns is-multiline">
      <div class="column is-12">
        <form @submit.prevent="submit">
          <label for="payload" class="label">Payload</label>
          <div class="field has-addons">
            <div class="control is-expanded">
              <input type="text" class="input" v-model="form.payload">
            </div>
            <div class="control">
              <button type="submit" class="button is-primary">Parse</button>
            </div>
          </div>
        </form>
      </div>
      <div class="column is-6">
        <h3 class="title is-5">Samples</h3>
        <template v-for="(sample,i) in samples">
          <a @click="form.payload = sample" :key="i" class="box" style="overflow-wrap:break-word">
            <span class="heading">Sample {{i+1}}</span>
            <p>{{ sample }}</p>
          </a>
        </template>
      </div>

      <div class="column is-6">
        <div class="box">
          <h3 class="title is-5">Output</h3>
          <json-tree v-if="parsed" :data="parsed" />
          <div v-if="error" class="notification is-danger is-light">
            {{ error.message }}
          </div>
          <div v-if="!parsed && !error" class="notification">
            <span class="heading">Instruction</span>
            Enter payload data or pick from samples
          </div>
        </div>
      </div>
    </div>

    <div class="navbar is-fixed-bottom is-transparent" style="background: none;">
      <div class="has-text-centered" style="width: 100%;">
        <a target="_BLANK" href="https://github.com/faisalarbain/payload-parser">Source code</a>
      </div>
    </div>
  </div>
</template>

<script>
import JsonTree from 'vue-json-tree'
export default {
  components:{
    JsonTree,
  },
  data(){
    return {
      form: {
        payload: ''
      },
      error: false,
      samples: [
        '0101I040412347802MY12320010James_Bond01020202108888666699055000007330004Bond0105James0212770707148888',
        '0002010101I040412347802MY12320010James_Bond01020202108888666699055000007330004Bond0105James',
        '0002010101I040412347802MY12340010James_Bond0102020210888866666699055000007330004Bond0105James0212770707148888',
      ]
    }
  },
  computed:{
    parsed(){
      return this.$store.state.parser.parsed
    }
  },
  methods:{
    clearInput(){
      this.form.payload = ''
    },
    submit(){
      this.error = false
      this.$store.dispatch('parser/parse', this.form.payload).then(() => {
        this.clearInput()
      }).catch(err => {
        this.error = err.message ? err : {
          message: err
        }
      })
    }
  }
}
</script>