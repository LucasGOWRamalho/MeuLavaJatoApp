import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  statusContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  statusButton: {
    minWidth: 100,
  },
  statusText: {
    color: '#000',
  },
  statusTextCancelado: {
    color: '#fff',
  },
  statusFazer: {
    backgroundColor: '#ffeb3b',
  },
  statusConcluido: {
    backgroundColor: '#4caf50',
  },
  statusCobrar: {
    backgroundColor: '#2196f3',
  },
  statusCancelado: {
    backgroundColor: '#f44336',
  },
  semAgendamentos: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
  },
  modalCard: {
    padding: 16,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  button: {
    marginVertical: 8,
  },
  botoesModalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  botaoCancelar: {
    flex: 1,
    marginRight: 8,
  },
  botaoConfirmar: {
    flex: 1,
    marginLeft: 8,
  },
  botaoFecharCalendario: {
    marginTop: 16,
  },
  calendario: {
    marginVertical: 16,
  },
  
  dataContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dataButton: {
    borderColor: '#4682B4',
  },
    mainContent: {
    flex: 1,
    padding: 16,
  },
  drawerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
  },
  closeDrawerButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  drawerItem: {
    marginVertical: 8,
    justifyContent: 'flex-start',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  calendarioDrawer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  drawerCard: {
    marginTop: 10,
    elevation: 3,
    backgroundColor: 'white',
  },
  drawerTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#4682B4',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
   footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  footerLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  footerValue: {
    color: '#333',
  },
  positiveValue: {
    color: '#4caf50',
  },
  negativeValue: {
    color: '#f44336', 
  },
   
});