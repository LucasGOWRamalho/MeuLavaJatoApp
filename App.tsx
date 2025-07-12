import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button, Card, Title, Paragraph, Portal, Provider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { styles } from './styles';

type StatusServico = 'fazer' | 'concluido' | 'cobrar' | 'cancelado';

interface Cliente {
  id: string;
  nome: string;
  carro: string;
  placa: string;
  servico: string;
  valor: string;
  dataEntrada: string;
  status: StatusServico;
}

// Configuração do calendário em português
LocaleConfig.locales['br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'br';

const App = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState('');
  const [carro, setCarro] = useState('');
  const [placa, setPlaca] = useState('');
  const [servico, setServico] = useState('');
  const [valor, setValor] = useState('');
  const [dataEntrada, setDataEntrada] = useState(moment().format('YYYY-MM-DD'));
  const [dataSelecionada, setDataSelecionada] = useState(moment().format('YYYY-MM-DD'));
  const [modalAgendamento, setModalAgendamento] = useState(false);
  const [modalCalendario, setModalCalendario] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatarMoeda = (valor: string) => {
    let valorNumerico = valor.replace(/\D/g, '');
    valorNumerico = (Number(valorNumerico) / 100).toFixed(2);
    return `R$ ${valorNumerico.replace('.', ',')}`;
  };

  const adicionarAgendamento = () => {
    if (!nome || !carro || !placa || !servico || !valor || !dataEntrada) return;
    
    const novoCliente: Cliente = {
      id: Date.now().toString(),
      nome,
      carro,
      placa,
      servico,
      valor: formatarMoeda(valor),
      dataEntrada,
      status: 'fazer' // Status padrão
    };

    setClientes([...clientes, novoCliente]);
    limparCampos();
    setModalAgendamento(false);
  };

  const limparCampos = () => {
    setNome('');
    setCarro('');
    setPlaca('');
    setServico('');
    setValor('');
    setDataEntrada(moment().format('YYYY-MM-DD'));
  };

  const clientesDoDia = clientes.filter(cliente => 
    cliente.dataEntrada === dataSelecionada
  );

  const getDiasComAgendamentos = () => {
    const dias: {[key: string]: {selected: boolean; marked: boolean; selectedColor: string}} = {};
    
    clientes.forEach(cliente => {
      dias[cliente.dataEntrada] = {
        selected: cliente.dataEntrada === dataSelecionada,
        marked: true,
        selectedColor: '#4682B4'
      };
    });
    
    return dias;
  };

  const mudarStatus = (id: string, novoStatus: StatusServico) => {
    setClientes(clientes.map(cliente => 
      cliente.id === id ? {...cliente, status: novoStatus} : cliente
    ));
  };

  const getStatusStyle = (status: StatusServico) => {
    switch(status) {
      case 'concluido': return styles.statusConcluido;
      case 'cobrar': return styles.statusCobrar;
      case 'cancelado': return styles.statusCancelado;
      default: return styles.statusFazer;
    }
  };

  const getStatusTextStyle = (status: StatusServico) => {
    return status === 'cancelado' 
      ? styles.statusTextCancelado 
      : styles.statusText;
  };

  return (
    <Provider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <Appbar.Header>
            <Appbar.Content title="Meu Lava Jato" />
            <Appbar.Action icon="calendar" onPress={() => setModalCalendario(true)} />
            <Appbar.Action icon="plus" onPress={() => setModalAgendamento(true)} />
          </Appbar.Header>
          
          <View style={styles.dataContainer}>
            <Button 
              mode="outlined" 
              onPress={() => setModalCalendario(true)}
              style={styles.dataButton}
            >
              {moment(dataSelecionada).format('DD/MM/YYYY')}
            </Button>
          </View>
          
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {clientesDoDia.length === 0 ? (
              <Paragraph style={styles.semAgendamentos}>
                Nenhum agendamento para esta data
              </Paragraph>
            ) : (
              clientesDoDia.map((cliente) => (
                <Card key={cliente.id} style={[styles.card, getStatusStyle(cliente.status)]}>
                  <View style={styles.statusContainer}>
                    <Button 
                      compact
                      mode="text"
                      onPress={() => {
                        const statusOrder: StatusServico[] = ['fazer', 'concluido', 'cobrar', 'cancelado'];
                        const currentIndex = statusOrder.indexOf(cliente.status);
                        const nextIndex = (currentIndex + 1) % statusOrder.length;
                        mudarStatus(cliente.id, statusOrder[nextIndex]);
                      }}
                      contentStyle={styles.statusButton}
                      labelStyle={getStatusTextStyle(cliente.status)}
                    >
                      {cliente.status.toUpperCase()}
                    </Button>
                  </View>
                  <Card.Content>
                    <Title>{cliente.nome}</Title>
                    <Paragraph>Carro: {cliente.carro}</Paragraph>
                    <Paragraph>Placa: {cliente.placa}</Paragraph>
                    <Paragraph>Serviço: {cliente.servico}</Paragraph>
                    <Paragraph>Valor: {cliente.valor}</Paragraph>
                  </Card.Content>
                </Card>
              ))
            )}
          </ScrollView>

          {/* Modal de Agendamento */}
          <Portal>
            <Modal
              visible={modalAgendamento}
              onDismiss={() => setModalAgendamento(false)}
              style={styles.modalContainer}
            >
              <View style={styles.modalContent}>
                <Card style={styles.modalCard}>
                  <Card.Content>
                    <Title style={styles.modalTitle}>Novo Agendamento</Title>
                    
                    <TextInput
                      label="Nome do Cliente"
                      value={nome}
                      onChangeText={setNome}
                      style={styles.input}
                    />
                    
                    <TextInput
                      label="Modelo do Carro"
                      value={carro}
                      onChangeText={setCarro}
                      style={styles.input}
                    />
                    
                    <TextInput
                      label="Placa"
                      value={placa}
                      onChangeText={setPlaca}
                      style={styles.input}
                    />
                    
                    <TextInput
                      label="Serviço"
                      value={servico}
                      onChangeText={setServico}
                      style={styles.input}
                    />
                    
                    <TextInput
                      label="Valor"
                      value={valor}
                      onChangeText={(text) => setValor(text.replace(/\D/g, ''))}
                      keyboardType="numeric"
                      style={styles.input}
                    />
                    
                    <Button 
                      mode="outlined" 
                      onPress={() => setShowDatePicker(true)}
                      style={styles.button}
                    >
                      {dataEntrada ? moment(dataEntrada).format('DD/MM/YYYY') : 'Selecionar Data'}
                    </Button>
                    
                    {showDatePicker && (
                      <Calendar
                        current={dataEntrada}
                        onDayPress={(day) => {
                          setDataEntrada(day.dateString);
                          setShowDatePicker(false);
                        }}
                        markedDates={{
                          [dataEntrada]: {selected: true, selectedColor: '#4682B4'}
                        }}
                        style={styles.calendario}
                      />
                    )}
                    
                    <View style={styles.botoesModalContainer}>
                      <Button 
                        mode="outlined" 
                        onPress={() => setModalAgendamento(false)}
                        style={styles.botaoCancelar}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        mode="contained" 
                        onPress={adicionarAgendamento}
                        style={styles.botaoConfirmar}
                      >
                        Confirmar
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              </View>
            </Modal>
          </Portal>

          {/* Modal de Calendário */}
          <Portal>
            <Modal
              visible={modalCalendario}
              onDismiss={() => setModalCalendario(false)}
              style={styles.modalContainer}
            >
              <View style={styles.modalContent}>
                <Card style={styles.modalCard}>
                  <Card.Content>
                    <Title style={styles.modalTitle}>Selecione uma Data</Title>
                    
                    <Calendar
                      current={dataSelecionada}
                      markedDates={getDiasComAgendamentos()}
                      onDayPress={(day) => {
                        setDataSelecionada(day.dateString);
                        setModalCalendario(false);
                      }}
                      theme={{
                        selectedDayBackgroundColor: '#4682B4',
                        todayTextColor: '#4682B4',
                        arrowColor: '#4682B4',
                      }}
                    />
                    
                    <Button 
                      mode="contained" 
                      onPress={() => setModalCalendario(false)}
                      style={styles.botaoFecharCalendario}
                    >
                      Fechar
                    </Button>
                  </Card.Content>
                </Card>
              </View>
            </Modal>
          </Portal>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;