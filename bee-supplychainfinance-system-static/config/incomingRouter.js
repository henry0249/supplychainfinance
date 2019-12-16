export default [
  {
    path: '/incoming/purchase',
    name: 'stepform',
    // component: './Incoming/purchase',
    hideChildrenInMenu: true,
    routes: [
      {
        path: '/incoming/purchase/step1',
        name: 'info',
        component: './Incoming/purchase/Step1/index',
      },
      {
        path: '/incoming/purchase/step2',
        name: 'confirm',
        component: './Incoming/purchase/Step2/index',
      },
      {
        path: '/incoming/purchase/step3',
        name: 'result',
        component: './Incoming/purchase/Step3/index',
      },
      {
        path: '/incoming/purchase/step4',
        name: 'result',
        component: './Incoming/purchase/Step4/index',
      },
    ],
  },



]