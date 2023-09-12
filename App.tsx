/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
// import DropDownPicker from 'react-native-dropdown-picker';
import Settings from '@pixelpay/sdk-core/lib/models/Settings';
import Card from '@pixelpay/sdk-core/lib/models/Card';
import Billing from '@pixelpay/sdk-core/lib/models/Billing';
import Item from '@pixelpay/sdk-core/lib/models/Item';
import Order from '@pixelpay/sdk-core/lib/models/Order';
import SaleTransaction from '@pixelpay/sdk-core/lib/requests/SaleTransaction';
import TransactionResult from '@pixelpay/sdk-core/lib/entities/TransactionResult';
import AuthTransaction from '@pixelpay/sdk-core/lib/requests/AuthTransaction';
import CaptureTransaction from '@pixelpay/sdk-core/lib/requests/CaptureTransaction';
import VoidTransaction from '@pixelpay/sdk-core/lib/requests/VoidTransaction';
import StatusTransaction from '@pixelpay/sdk-core/lib/requests/StatusTransaction';
import {Transaction, Tokenization} from '@pixelpay/react-native-plugin';
import CardTokenization from '@pixelpay/sdk-core/lib/requests/CardTokenization';
import CardResult from '@pixelpay/sdk-core/lib/entities/CardResult';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
} from 'react-native';

import {
  Colors,
  // DebugInstructions,
  // Header,
  // LearnMoreLinks,
  // ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const setSettings = () => {
    const settings = new Settings();
    settings.setupSandbox();

    const card = new Card();
    card.number = '4111111111111111';
    card.cvv2 = '300';
    card.expire_month = 12;
    card.expire_year = 2512;
    card.cardholder = 'Jonh Doe';

    const billing = new Billing();
    billing.address = 'Ave Circunvalacion';
    billing.country = 'HN';
    billing.state = 'HN-CR';
    billing.city = 'San Pedro Sula';
    billing.phone = '99999999';

    const order = new Order();
    order.id = 'TEST-1234';
    order.currency = 'HNL';
    order.customer_name = 'Jhon Doe';
    order.customer_email = 'jhondow@pixel.hn';
    order.amount = 1;

    const sale = new SaleTransaction();
    sale.setOrder(order);
    sale.setCard(card);
    sale.setBilling(billing);

    const service = new Transaction(settings);
    service
      .doSale(sale)
      .then(response => {
        console.log(response);
        // setCopiedText(response.data.payment_uuid);
        console.log('uuid:', response.data.payment_uuid);
        console.log('********');
        Alert.alert(
          response.message,
          `${response.data.response_reason} \nstatus: ${response.status}`,
        );
        console.log(TransactionResult.validateResponse(response));
        if (TransactionResult.validateResponse(response)) {
          const result = TransactionResult.fromResponse(response);

          const validPayment = service.verifyPaymentHash(
            result.payment_hash,
            order.id,
            'abc...', // secret
          );

          if (validPayment) {
            // SUCCESS Valid Payment
            Alert.alert(
              response.message,
              `${response.data.response_reason} \nstatus: ${response.status}`,
            );
          }
        }
      })
      .catch(error => {
        console.log(error);
        Alert.alert('Ocurrió un error', error);
      });
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <Button onPress={setSettings} title="Config Settings" color="#2962ff" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    paddingHorizontal: 10,
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },
});

export default App;
