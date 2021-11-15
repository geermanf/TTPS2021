export const DynamicAsideMenuConfig = {
  items: [
    {
      title: 'Home',
      root: true,
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Design/Layers.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot',
    },
    { section: 'Applications' },
    {
      title: 'User Management',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      page: '/user-management',
      submenu: [
        {
          title: 'Users',
          page: '/user-management/users'
        },
        {
          title: 'Roles',
          page: '/user-management/roles'
        }
      ]
    },
    {
      title: 'Pacientes',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      page: '/patients',
      submenu: [
        {
          title: 'Lista de Pacientes',
          page: '/patients/patients'
        },
      ]
    },
    {
      title: 'Estudios',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      page: '/studies',
      submenu: [
        {
          title: 'Lista de Estudios',
          page: '/studies/studies'
        },
      ]
    },
    {
      title: 'Lotes',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      page: '/studies',
      submenu: [
        {
          title: 'Lista de Lotes',
          page: '/sample-batches/sample-batches'
        },
      ]
    }
  ]
};
