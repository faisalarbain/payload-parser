<template>
  <div>
    <h1 class="title">Customer Data Parser Demo</h1>
    <div class="columns">
      <div class="column">
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

      <div class="column">
        <div class="box">
          <pre>{{ parsed }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      form: {
        payload: ''
      },
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
      this.$store.dispatch('parser/parse', this.form.payload).then(() => {
        this.clearInput()
      })
    }
  }
}
</script>