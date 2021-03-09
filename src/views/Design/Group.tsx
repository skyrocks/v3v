import { defineComponent, onMounted, reactive } from 'vue'
import { reportApi } from '@/api/modules/report'
// import './group.scss'

export interface ReportType {
  reportId: string
  reportName: string
  groupId: string
  seq: number
  memo: string
}

export interface ReportGroupType {
  groupId: string
  groupName: string
  seq: number
  memo: string
  reports: ReportType[]
}

export default defineComponent({
  setup() {
    const status = reactive<{
      groups: ReportGroupType[]
      open: { [key: string]: boolean }
    }>({ groups: [], open: {} })

    const getGroups = () => {
      reportApi.getGroups().then(response => {
        status.groups = response.data
      })
    }

    // const toggleGroupStatus = (item:ReportGroupType, e: any) => {
    //   status.open[item.groupId] = !status.open[item.groupId]
    // }

    onMounted(getGroups)

    return () => (
      <el-menu>
        {status.groups.map(g => {
          return (
            <el-submenu>
              <i class="el-icon-menu"></i>
              {g.groupName}
              {g.reports.map(r => {
                return (
                  <el-menu-item>
                    <i class="el-icon-menu"></i>
                    {r.reportName}
                  </el-menu-item>
                )
              })}
            </el-submenu>
          )
        })}
      </el-menu>
    )

    // return() => (
    //   <div><ul class="style-list">
    //   {
    //     status.groups.map( (g) => {
    //       return (
    //         <li class="item" onClick={ toggleGroupStatus.bind(this, g) }>
    //           <span class={status.open[g.groupId] ? 'open': ''}>
    //             <i class={status.open[g.groupId] ? "el-icon-folder-opened": "el-icon-folder"}></i>
    //             { g.groupName }
    //           </span>
    //           <ul class={`style-list children ${status.open[g.groupId] ? '': 'hidden'}`}>
    //             {
    //               g.reports?.map( (r) => {
    //                 return <li class="item"> { r.reportName }</li>
    //               })
    //             }
    //           </ul>
    //         </li>
    //       )
    //     })
    //   }
    // </ul></div>
    // )
  }
})
