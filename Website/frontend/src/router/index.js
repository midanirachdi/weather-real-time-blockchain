import Vue from 'vue'
import Router from 'vue-router'
// layout components
import Full from '@/container/Full'
// Pages views
import Blank from '@/views/pages/Blank'
//Pricing
import PricingBackoffice from '@/views/BackOffice/Price'
//home
import home from '@/views/FrontOffice/home'
// session components
import SignUp from '@/views/session/SignUp'
import Login from '@/views/session/Login'
import LockScreen from '@/views/session/LockScreen'
import AdminUserList from '@/views/BackOffice/userList'
import Transaction from '@/views/BackOffice/Transaction'
import WeatherStation from '@/views/BackOffice/WeatherStation'
import WorldMap from '@/views/FrontOffice/worldMap'
import CountrydMap from '@/views/FrontOffice/countryMap'
import Pricing from '@/views/FrontOffice/pricing'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/admin',
      component: Full,
      redirect: '/pages/blank',
      children: [

        {
          path: '/pages/blank',
          component: Blank,
          meta: {
            title: 'Blank',
            breadcrumb: 'Pages / Blank'
          }
        }, {
          path: '/admin/userlist',
          component: AdminUserList,
          meta: {
            title: 'Users',
            breadcrumb: 'admin / User List',

          }
        }, {
          path: '/admin/pricing',
          component: PricingBackoffice,
          meta: {
            title: 'Pricing',
            breadcrumb: 'admin / Pricing',

          }
        },
        {
          path: '/admin/weatherStations',
          component: WeatherStation,
          meta: {
            title: 'Weather stations',
            breadcrumb: 'admin / Weather stations'
          }
        },
        {
          path: '/admin/transactions',
          component: Transaction,
          meta: {
            title: 'Transactions',
            breadcrumb: 'admin / Transactions'
          }
        }
      ]
    },
    {
      path: '/session/sign-up',
      component: SignUp,
      meta: {
        title: 'Sign Up',
        breadcrumb: 'Session / Sign Up'
      }
    },
    {
      path: '/session/login',
      component: Login,
      meta: {
        title: 'Login',
        name: 'login',
        breadcrumb: 'Session / Login'
      }
    },
    {
      path: '/session/lock-screen',
      component: LockScreen,
      meta: {
        title: 'Lock Screen',
        breadcrumb: 'Session / Lock Screen'
      }
    },
    {
      path: '/',
      component: home,
      name: 'home'
    },
    {
      path: '/pricing', component: Pricing, meta: {
        auth: {roles: 'client', redirect: '/session/login'}
      }
    },
    {
      path: '/map', component: WorldMap, name: 'map', meta: {
        auth: {roles:['client','admin'], redirect: '/session/login'}
      }
    },
    {
      path: '/map/:country', component: CountrydMap, props: true, meta: {
        auth: {roles: ['client','admin'], redirect: '/session/login'}
      }
    }

  ],
  mode: "history"
})
