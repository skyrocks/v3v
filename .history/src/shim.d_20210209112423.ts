// import type { DefineComponent } from 'vue'

// declare module '*.vue' {
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}