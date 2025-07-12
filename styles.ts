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
});