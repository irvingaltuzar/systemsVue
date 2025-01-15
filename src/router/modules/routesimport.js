/**
 * :::::::::::IMPORTANTE::::::::::::::
 *
 * LAS RUTAS SE DEBEN IMPORTAR PARA VUE ROUTER, COMPONENTES ASYNC DESDE COMPILACION
 *
 */

// componentes de vistas
import BuscarDocumento from '@/views/ControlDocumental/BuscarDocumento'
import DashboardControlDocumental from '@/views/ControlDocumental/Dashboard'
import AdministradorDocumentos from '@/views/ControlDocumental/AdministradorDocumentos'
import DMICotiza from '@/views/Dmicotiza/Projects'
import Permisos from '@/views/Permisos'
import DMIDepartmentsDetail from '@/views/Dmicotiza/Departments/detail'
import DMIViewProjects from '@/views/Dmicotiza/ViewProject/'
import DMIProjectsDetail from '@/views/Dmicotiza/Projects/detail'
import AdministrarUsuarios from '@/views/Administracion/Usuarios'
import AdminSubsecciones from '@/views/Administracion/Subsecciones'
import ReporteAuditoria from '@/views/Administracion/Auditoria'
import DMIHdTickets from '@/views/Dmihd/Tickets/index'
import DMIHdLocations from '@/views/Dmihd/Location/index'
import DMIHdAreas from '@/views/Dmihd/Area/index'
import DMIHdSuBAreas from '@/views/Dmihd/SubArea/index'
import Vacaciones from '@/views/vacaciones'
import ControlAsistencia from '@/views/ControlAsistencia'
import Requisiciones from '@/views/Requisiciones'
import DMIHdPriority from '@/views/Dmihd/Priority/index'
import DMIHdSendTicket from '@/views/Dmihd/Tickets/sendSolicitudes'
import DMIHdRequestTicket from '@/views/Dmihd/Tickets/requestSolicitudes'
import DMIHdDetailTicket from '@/views/Dmihd/Tickets/detailSolicitudSend'
import HorariosPersonal from '@/views/ControlAsistencia/HorariosPersonal'
import DatosPersonal from '@/views/ControlAsistencia/DatosPersonal'
import ReporteAsistencia from '@/views/ControlAsistencia/ReporteAsistencia'
import MiAsistencia from '@/views/ControlAsistencia/MiAsistencia'
import CambiarHorario from '@/views/ControlAsistencia/CambiarHorario'
import SolicitarPermisos from '@/views/Permisos/SolicitarPermisos'
import MisPermisos from '@/views/Permisos/MisPermisos'
import SolicitarComida from '@/views/Orders/CreateOrderFood'
import AutorizarPermisos from '@/views/Permisos/AutorizarPermisos'
import PermisosDePersonal from '@/views/Permisos/PermisosDePersonal'
import ReporteGeneral from '@/views/Permisos/ReporteGeneral'
import AdmnistracionMenu from '@/views/Dining/DiningMenu'
import MisVacaciones from '@/views/vacaciones/misVacaciones.vue'
import SolicitarVacaciones from '@/views/vacaciones/solicitarVacaciones.vue'
import AutorizarVacaciones from '@/views/vacaciones/autorizarVacaciones.vue'
import VacacionesDePersonal from '@/views/vacaciones/vacacionesDePersonal.vue'
import ReporteGeneralVacaciones from '@/views/vacaciones/reporteGeneral.vue'
import AutorizarHorarios from '@/views/ControlAsistencia/AutorizarHorariosArea'
import PanelHorarios from '@/views/ControlAsistencia/PanelAprobarHorarios'
import HorariosDependientes from '@/views/ControlAsistencia/HorariosDependientes'
import SolicitudJustification from '@/views/ControlAsistencia/SolicitudJustification'
import AutorizaJustificacion from '@/views/ControlAsistencia/AutorizarJustification'
import SolicitudRequisicion from '@/views/Requisiciones/SolicitudRequisicion'
import AccountingTools from '@/views/Accounting/AccountingTools'
import MisRequisiciones from '@/views/Requisiciones/MisRequisiciones'
import PanelRequisiciones from '@/views/Requisiciones/PanelRequisiciones'
import CierreMensual from '@/views/CierreMensual/MonthlyClosure.vue'
import PrecierresFiscales from '@/views/PrecierresFiscales/list.vue'
import EAccounting from '@/views/Accounting/EAccounting'
import OverviewActivities from '@/views/Accounting/OverviewActivities'
import PayrollView from '@/views/payroll/PayrollView'
import RequisicionesMiPersonal from '@/views/Requisiciones/RequisicionesMiPersonal'
import RequisicionesPendientesFirma from '@/views/Requisiciones/RequisicionesPendientesFirma'
import LeyAntilavado from '@/views/Accounting/LeyAntilavado'
import RegistroProveedores from '@/views/Proveedores/RegistroProveedores'
import RevisionEFO from '@/views/Proveedores/RevisionEFO'
import Panel from '@/views/suppliers/DashboardSuppliers'
import Listado from '@/views/suppliers/GeneralSuppliers'
import InterimPayments from '@/views/Accounting/InterimPayments'
import ReporteAccesos from '@/views/Proveedores/ReporteAccesos'
import Dashboard from '@/views/inicio'
import ReemplazoTemporalDeColaborador from '@/views/RecursosHumanos/ReemplazoTemporalDeColaborador'
import CoordinadorPorUbicacion from '@/views/RecursosHumanos/CoordinadorPorUbicacion/index.vue'
import FechasDeCorte from '@/views/Accounting/CutOffDate.vue'
import AutoJustificacion from '@/views/ControlAsistencia/AutoJustificacion'
//import PanelWhatsApp from '@/views/PanelWhatsApp/panel.vue'
import Autorizaciones from '@/views/RecursosHumanos/Autorizaciones/list.vue'
import Prenomina from '@/views/RecursosHumanos/CAI'
import ProcesoDeIncidencias from '@/views/RecursosHumanos/CAI/ProcesoDeIncidencias/list.vue'
import ValidarIncidencias from '@/views/RecursosHumanos/CAI/ValidarIncidencias/single.vue'


// Array de componentes inicializados
const components = [
  { name: 'Buscar Documento', component: BuscarDocumento },
  { name: 'Dashboard Databox', component: DashboardControlDocumental },
  { name: 'Administrar Documentos', component: AdministradorDocumentos },
  { name: 'Administrar Usuarios', component: AdministrarUsuarios },
  { name: 'Admin Subsecciones', component: AdminSubsecciones },
  { name: 'Reporte Auditoria', component: ReporteAuditoria },
  { name: 'Vacaciones', component: Vacaciones },
  { name: 'Control Asistencia', component: ControlAsistencia },
  { name: 'Permisos', component: Permisos },
  { name: 'Requisiciones', component: Requisiciones },
  { name: 'Horarios Personal', component: HorariosPersonal },
  { name: 'Datos Personal', component: DatosPersonal },
  { name: 'Reporte Asistencia', component: ReporteAsistencia },
  { name: 'Mi Asistencia', component: MiAsistencia },
  { name: 'Solicitar Permisos', component: SolicitarPermisos },
  { name: 'Mis Permisos', component: MisPermisos },
  { name: 'Administración Menú', component: AdmnistracionMenu },
  { name: 'Solicitar Comida', component: SolicitarComida },
  { name: 'Autorizar Permisos', component: AutorizarPermisos },
  { name: 'Permisos de Personal', component: PermisosDePersonal },
  { name: 'Reporte General', component: ReporteGeneral },
  { name: 'Solicitar Cambio Horario', component: CambiarHorario },
  { name: 'Autorizar Permisos', component: AutorizarPermisos },
  { name: 'Permisos de Personal', component: PermisosDePersonal },
  { name: 'Reporte General', component: ReporteGeneral },
  { name: 'Mis Vacaciones', component: MisVacaciones },
  { name: 'Solicitar Vacaciones', component: SolicitarVacaciones },
  { name: 'Autorizar Vacaciones', component: AutorizarVacaciones },
  { name: 'Vacaciones de Personal', component: VacacionesDePersonal },
  { name: 'Reporte General Vacaciones', component: ReporteGeneralVacaciones },
  { name: 'Autorizar Cambio Horario', component: CambiarHorario },
  { name: 'Autorizar Horarios Area', component: AutorizarHorarios },
  { name: 'Panel Aprobar Horarios', component: PanelHorarios },
  { name: 'Asistencia Mi Personal', component: HorariosDependientes },
  { name: 'Consulta Horarios dependientes', component: HorariosDependientes },
  { name: 'Solicitud Requisicion', component: SolicitudRequisicion },
  { name: 'Administración', component: AccountingTools },
  { name: 'Contabilidad Electrónica', component: EAccounting },
  { name: 'Opinión de cumplimiento', component: OverviewActivities },
  { name: 'Mis Requisiciones', component: MisRequisiciones },
  { name: 'Panel Requisiciones', component: PanelRequisiciones },
  { name: 'Cierre Mensual', component: CierreMensual },
  { name: 'Precierres Fiscales', component: PrecierresFiscales },
  { name: 'Recibos de nomina', component: PayrollView },
  { name: 'Requisiciones Mi Personal', component: RequisicionesMiPersonal},
  { name: 'RequisicionesPendientesFirma', component: RequisicionesPendientesFirma},
  { name: 'Ley Antilavado', component: LeyAntilavado},
  { name: 'Mis Proveedores / Registro', component: RegistroProveedores},
  { name: 'Revision EFO', component: RevisionEFO},
  { name: 'Panel', component: Panel},
  { name: 'Listado', component: Listado},
  { name: 'Pagos Provisionales', component: InterimPayments},
  { name: 'Dashboard', component: Dashboard},
  { name: 'Reporte Accesos', component: ReporteAccesos},
  { name: 'Inicio', component: Dashboard},
  { name: 'Coordinador Por Ubicación', component: CoordinadorPorUbicacion},
  { name: 'Delegar Permisos', component: ReemplazoTemporalDeColaborador},
  { name: 'Fechas De Corte', component: FechasDeCorte},
  { name: 'Solicitud Justificacion', component: SolicitudJustification},
  { name: 'Autorizar Justificacion', component: AutorizaJustificacion},
  { name: 'Auto-Justificación', component: AutoJustificacion},
  //{ name: 'Panel WhatsApp', component: PanelWhatsApp},
  { name: 'Autorizaciones', component: Autorizaciones},
  { name: 'Prenómina', component: Prenomina},
  { name: 'Proceso De Incidencias', component: ProcesoDeIncidencias},
  { name: 'Validar Incidencias', component: ValidarIncidencias},
]

export default components
