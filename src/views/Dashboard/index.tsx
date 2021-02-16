import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    // return () => (
    //   <>
    //     <h1>msg</h1>
    //     <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
    //   </>
    // );
    const a: any = ''
    return() => (
      <div>Dashboard</div>
    )
  }  
})