import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button, Card, Title, Paragraph, Provider as PaperProvider, MD3LightTheme as DefaultTheme, Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { MMKV } from 'react-native-mmkv';
import { styles } from './styles';

// Configuração do MMKV
const storage = new MMKV({
  id: 'meuLavaJatoDB'
});

// Tipos
type StatusServico = 'fazer' | 'concluido' | 'cobrar' | 'cancelado';

interface Cliente {
  id: string;
  nome: string;
  carro: string;
  placa: string;
  contato?: string;
  servico: string;
  valor: string;
  dataEntrada: string;
  status: StatusServico;
}

// Configuração do tema
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4682B4',
    accent: '#f1c40f',
  },
};

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
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
};
LocaleConfig.defaultLocale = 'br';

const App = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState('');
  const [carro, setCarro] = useState('');
  const [placa, setPlaca] = useState('');
  const [contato, setContato] = useState('');
  const [servico, setServico] = useState('');
  const [valor, setValor] = useState('');
  const [dataEntrada, setDataEntrada] = useState(moment().format('YYYY-MM-DD'));
  const [dataSelecionada, setDataSelecionada] = useState(moment().format('YYYY-MM-DD'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<'menu' | 'calendario' | 'novoAgendamento'>('menu');

  // Carrega os clientes ao iniciar
  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = () => {
    try {
      const clientesString = storage.getString('clientes');
      const clientes = clientesString ? JSON.parse(clientesString) : [];
      setClientes(clientes);
    } catch (error) {
      console.log('Erro ao carregar clientes:', error);
    }
  };

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
      contato,
      servico,
      valor: formatarMoeda(valor),
      dataEntrada,
      status: 'fazer'
    };

    try {
      const novosClientes = [...clientes, novoCliente];
      storage.set('clientes', JSON.stringify(novosClientes));
      setClientes(novosClientes);
      limparCampos();
      setDrawerContent('menu');
      setDrawerOpen(false);
    } catch (error) {
      console.log('Erro ao inserir cliente:', error);
    }
  };

  const limparCampos = () => {
    setNome('');
    setCarro('');
    setPlaca('');
    setContato('');
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
    try {
      const clientesAtualizados = clientes.map(cliente => 
        cliente.id === id ? { ...cliente, status: novoStatus } : cliente
      );
      storage.set('clientes', JSON.stringify(clientesAtualizados));
      setClientes(clientesAtualizados);
    } catch (error) {
      console.log('Erro ao atualizar status:', error);
    }
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

  const renderMainContent = () => (
  <View style={{ flex: 1 }}>
    <View style={styles.mainContent}>
      <View style={styles.dataContainer}>
        <Button 
          mode="outlined" 
          onPress={() => {
            setDrawerContent('calendario');
            setDrawerOpen(true);
          }}
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
                <Paragraph>Contato: {cliente.contato || 'Não informado'}</Paragraph>
                <Paragraph>Serviço: {cliente.servico}</Paragraph>
                <Paragraph>Valor: {cliente.valor}</Paragraph>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>

    {/* Rodapé com informações financeiras */}
    {clientesDoDia.length > 0 && (
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Diária a receber:</Text>
          <Text style={[styles.footerValue, styles.positiveValue]}>
            R$ {calcularTotais().aReceber}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Diária recebida:</Text>
          <Text style={[styles.footerValue, styles.positiveValue]}>
            R$ {calcularTotais().recebido}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Valor negado:</Text>
          <Text style={[styles.footerValue, styles.negativeValue]}>
            R$ {calcularTotais().negado}
          </Text>
        </View>
      </View>
    )}
  </View>
);

  

  const renderMenuContent = () => (
    <View style={styles.drawerContainer}>
      <TouchableOpacity 
        style={styles.closeDrawerButton}
        onPress={() => setDrawerOpen(false)}
      >
        <Button icon="close">Fechar</Button>
      </TouchableOpacity>

      <Button 
        mode="text"
        icon="calendar"
        onPress={() => setDrawerContent('calendario')}
        style={styles.drawerItem}
      >
        Calendário
      </Button>

      <Button 
        mode="text"
        icon="plus"
        onPress={() => setDrawerContent('novoAgendamento')}
        style={styles.drawerItem}
      >
        Novo Agendamento
      </Button>
    </View>
  );

  const renderCalendarContent = () => (
    <View style={styles.drawerContainer}>
      <Button 
        icon="arrow-left"
        onPress={() => setDrawerContent('menu')}
        style={styles.backButton}
      >
        Voltar
      </Button>
      <Calendar
        current={dataSelecionada}
        markedDates={getDiasComAgendamentos()}
        onDayPress={(day) => {
          setDataSelecionada(day.dateString);
          setDrawerOpen(false);
        }}
        theme={{
          selectedDayBackgroundColor: '#4682B4',
          todayTextColor: '#4682B4',
          arrowColor: '#4682B4',
        }}
        style={styles.calendarioDrawer}
      />
    </View>
  );

  const renderNewAppointmentContent = () => (
    <View style={styles.drawerContainer}>
      <Button 
        icon="arrow-left"
        onPress={() => setDrawerContent('menu')}
        style={styles.backButton}
      >
        Voltar
      </Button>
      <Card style={styles.drawerCard}>
        <Card.Content>
          <Title style={styles.drawerTitle}>Novo Agendamento</Title>
          
          <TextInput
            label="Nome do Cliente"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Modelo do Carro"
            value={carro}
            onChangeText={setCarro}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Placa"
            value={placa}
            onChangeText={setPlaca}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Contato"
            value={contato}
            onChangeText={setContato}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          
          <TextInput
            label="Serviço"
            value={servico}
            onChangeText={setServico}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Valor"
            value={valor}
            onChangeText={(text) => setValor(text.replace(/\D/g, ''))}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          
          <Button 
            mode="outlined" 
            onPress={() => setShowDatePicker(!showDatePicker)}
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
          
          <Button 
            mode="contained" 
            onPress={adicionarAgendamento}
            style={styles.botaoConfirmar}
          >
            Confirmar
          </Button>

          
        </Card.Content>
      </Card>
    </View>
  );
  const calcularTotais = () => {
  let aReceber = 0;
  let recebido = 0;
  let negado = 0;

  clientesDoDia.forEach(cliente => {
    const valorNumerico = parseFloat(cliente.valor.replace('R$ ', '').replace(',', '.'));
    
    if (cliente.status === 'concluido') {
      recebido += valorNumerico;
    } else if (cliente.status === 'cobrar' || cliente.status === 'fazer') {
      aReceber += valorNumerico;
    } else if (cliente.status === 'cancelado') {
      negado += valorNumerico;
    }
  });

  return {
    aReceber: aReceber.toFixed(2).replace('.', ','),
    recebido: recebido.toFixed(2).replace('.', ','),
    negado: negado.toFixed(2).replace('.', ','),
  };
};

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <Appbar.Header>
            <Appbar.Action icon="menu" onPress={() => setDrawerOpen(true)} />
            <Appbar.Content title="Meu Lava Jato" />
          </Appbar.Header>
          
          {renderMainContent()}

          <Modal
            visible={drawerOpen}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setDrawerOpen(false)}
          >
            <View style={styles.drawerOverlay}>
              {drawerContent === 'menu' && renderMenuContent()}
              {drawerContent === 'calendario' && renderCalendarContent()}
              {drawerContent === 'novoAgendamento' && renderNewAppointmentContent()}
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;