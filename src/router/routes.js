import HomePage from "/src/pages/main/HomePage.vue";
import MyPage from "@/pages/mypage/MyPage.vue";
import BoardListPage from "@/pages/board/BoardListPage.vue";
import SchedulePage from "@/pages/schedule/SchedulePage.vue";
import SalesMembersListPage from "@/pages/salesMember/SalesMembersListPage.vue";
import LoginPage from "@/pages/login/LoginPage.vue";
import SalesPage from "@/pages/sales/SalesPage.vue";
import ContractListPage from "@/pages/contract/ContractListPage.vue";
import BoardAddPage from "@/pages/board/BoardAddPage.vue";
import BoardModifyPage from "@/pages/board/BoardModifyPage.vue";
import SuggestionBoardAddPage from "@/pages/board/SuggestionBoardAddPage.vue"
import SuggestionBoardModifyPage from "@/pages/board/SuggestionBoardModifyPage.vue"
import SalesMembersAddPage from "@/pages/salesMember/SalesMembersAddPage.vue"
import SalesMembersDetailPage from "@/pages/salesMember/SalesMembersDetailPage.vue"
import SalesMembersModifyPage from "@/pages/salesMember/SalesMembersModifyPage.vue"
import PasswordFind from "@/pages/login/PasswordFind.vue"
import SalesPersonal from "@/pages/sales/SalesPersonal.vue"
import SalesRanking from "@/pages/sales/SalesRanking.vue"
import SalesTeam from "@/pages/sales/SalesTeam.vue"
import SalesTotal from "@/pages/sales/SalesTotal.vue"
import ContractAddModifyPage from "@/pages/contract/ContractAddModifyPage.vue"
import ContractCancelPage from "@/pages/contract/ContractCancelPage.vue"
import ContractDetailPage from "@/pages/contract/ContractDetailPage.vue"
import BoardDetailPage from "@/pages/board/BoardDetailPage.vue"
import SuggestionBoardDetail from "@/pages/board/SuggestionBoardDetailPage.vue"


const routes = [
  {
    path: '/',
    component: HomePage
  },

// board
  {
    path: '/BoardList',
    component: BoardListPage
  },
  {
    path: '/BoardList/Detail',
    component: BoardDetailPage
  },
  {
    path: '/BoardList/Add',
    component: BoardAddPage
  },
  {
    path: '/BoardList/Modify',
    component: BoardModifyPage
  },
  {
    path: '/BoardList/SuggestionBoardDetail',
    component: SuggestionBoardDetail
  },
  {
    path: '/BoardList/SuggestionBoardAdd',
    component: SuggestionBoardAddPage
  },
  {
    path: '/BoardList/SuggestionBoardModify',
    component: SuggestionBoardModifyPage
  },

// schedule
  {
    path: '/Schedule',
    component: SchedulePage
  },

  // mypage
  {
    path: '/MyPage',
    component: MyPage
  },

  //salesMember
  {
    path: '/SalesMembersList',
    component: SalesMembersListPage
  },
  {
    path: '/SalesMembersList/Add',
    component: SalesMembersAddPage
  },
  {
    path: '/SalesMembersList/Detail',
    component: SalesMembersDetailPage
  },
  {
    path: '/SalesMembersList/Modify',
    component: SalesMembersModifyPage
  },

  //login
  {
    path: '/Login',
    component: LoginPage
  },
  {
    path: '/Login/PasswordFind',
    component: PasswordFind
  },


  //sales
  {
    path: '/Sales',
    component: SalesPage
  },
  {
    path: '/Sales/Personal',
    component: SalesPersonal
  },
  {
    path: '/Sales/Ranking',
    component: SalesRanking
  },
  {
    path: '/Sales/Team',
    component: SalesTeam
  },
  {
    path: '/Sales/Total',
    component: SalesTotal
  },


  //contract
  {
    path: '/ContractList',
    component: ContractListPage
  },
  {
    path: '/ContractList/AddModify',
    component: ContractAddModifyPage
  },
  {
    path: '/ContractList/Cancel',
    component: ContractCancelPage
  },
  {
    path: '/ContractList/Detail',
    component: ContractDetailPage
  },
]

/*const router = new VueRouter({
  routes
})*/

export default routes
