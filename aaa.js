<!--
*
* @author        : zhangwen
* @namespace     : textRowInput
* @description   : 右边带有中文字体的input 或者 select
* @time          : 2018-1-22 15:00
* @
*
-->
<template>
  <div class="c-text-input" :class="[ {'is-border': isBorder} ]">
    <div class="prepend" v-if="prepend" tabindex="0">
      <span>{{prepend}}</span>
    </div>
    <div class="container">

      <label for="input" class="row-label">
        <input class="text-input" :value="currentValue" :disabled="disabled" :placeholder="placeholder" :maxLength="maxLength" @blur="OnChangeCallBack">
      </label>
      <span class="append" v-if="append">
        {{append}}
      </span>

      <!-- <template v-if="type === 'select'">
        <div class="row-input icon-arrow-right">
          <select name="row-select" id="row-select" class="row-select" :value="currentValue" @change="OnChangeCallBack">
            <option value="00">请选择</option>
            <option v-for='(item,key) in options' :value='item.value'>{{item.title}}</option>
          </select>
        </div>
      </template> -->
    </div>
  </div>
</template>

<script>
  import VAL from '@/utils/wx/validate'

  export default {
    name: 'TextRowInput',
    methods: {

      // input 回调函数
      OnChangeCallBack ($event) {
        this.$emit('CallBack', this.tempName, VAL.trimStr($event.target.value), this.name)
      }
      // // select 回调函数
      // OnSelectCallBack ($event) {
      //   this.$emit('CallBack', this.tempName, $event.target.value)
      // }
    },
    props: {
      // 是否显示下划线
      isBorder: {
        type: Boolean,
        default: true
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // input || select
      // type: {
      //   type: String,
      //   default: 'input'
      // },
      // 类似 label
      prepend: String,
      // 后面的文字
      append: String,
      // value 值
      currentValue: String,
      placeholder: String,
      maxLength: [String, Number],
      // key值
      tempName: String,
      options: [Object, Array],
      name: String
    }
  }sadasdasdadsda
</script>
