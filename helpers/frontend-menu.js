function getFrontEndMenu(role = "USER_ROLE") {
    console.log('##### FRONTEND MENU:', role);
  let menu = [
    {
      title: "DASHBOARD",
      icon: "mdi mdi-gauge",
      subMenu: [
        {
          title: "Charts-1",
          route: "graphic1",
        },
        {
          title: "Progress",
          route: "progress",
        },
        {
          title: "Rxjs",
          route: "rxjs",
        },
        {
          title: "Promises",
          route: "promises",
        },
      ],
    },
    {
      title: "GESTIÓN",
      icon: "mdi mdi-folder-lock-open",
      subMenu: [
        /* {
          title: "Usuarios",
          route: "users",
        }, */
        {
          title: "Médicos",
          route: "doctors",
        },
        {
          title: "Hospitales",
          route: "hospitals",
        },
      ],
    },
  ];

  if (role === "ADMIN_ROLE") {
    menu[1].subMenu.unshift({
      title: "Usuarios",
      route: "users",
    });
  }

  return menu;
}

module.exports = { getFrontEndMenu };
