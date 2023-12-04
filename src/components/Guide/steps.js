const steps = [
  {
    element: '#hamburger-container',
    popover: {
      title: 'Icono Menu desplegable',
      description: 'Abrir y Cerrar Menu Contenido',
      position: 'bottom'
    }
  },
  {
    element: '.el-scrollbar',
    popover: {
      title: 'Menu de Contenidos',
      description: 'Aquí podrás encontrar los diferentes opciones para navegar',
      position: 'right'
    }
  },
  {
    element: '#breadcrumb-container',
    popover: {
      title: 'Breadcrumb',
      description: 'Indica la página en la que te encuentras navegando',
      position: 'bottom'
    }
  },
  {
    element: '#header-search',
    popover: {
      title: 'Buscador de Paginas',
      description: 'Navegacion Rapida de búsqueda de paginas en la plataforma',
      position: 'left'
    }
  },
  {
    element: '#screenfull',
    popover: {
      title: 'Pantalla Completa',
      description: 'Configura la vista de la plataforma en pantalla Completa de tu ordenador',
      position: 'left'
    }
  },
  // {
  //   element: '#size-select',
  //   popover: {
  //     title: 'Switch Size',
  //     description: 'Switch the system size',
  //     position: 'left'
  //   }
  // },
  {
    element: '.avatar-container',
    popover: {
      title: 'Menu de Perfil',
      description: 'Aquí podrás las distintas opciones para tu perfil usuario',
      position: 'left'
    }
  },
  {
    element: '#tags-view-container',
    popover: {
      title: 'Vista de Tags Navegación',
      description: 'Esta sección muestra el historial de las páginas que has visitado',
      position: 'bottom'
    },
    padding: 0
  }
]

export default steps
