import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Row {
  id: string;
  description: string;
  valueA: string;
  valueB: string;
  formula: string;
  result: string;
}

export default function HomeScreen() {
  const [rows, setRows] = useState<Row[]>([
    {
      id: '1',
      description: 'Project Beta Cost',
      valueA: '1500',
      valueB: '12',
      formula: 'A * B',
      result: '18000',
    },
  ]);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const evaluateFormula = (formula: string, valueA: number, valueB: number): string => {
    if (!formula || isNaN(valueA) || isNaN(valueB)) return '';
    try {
      const A = valueA;
      const B = valueB;
      const result = eval(formula.toUpperCase().replace(/A/g, A).replace(/B/g, B));
      return !isNaN(result) ? result.toString() : '';
    } catch {
      return '';
    }
  };

  const updateRow = (id: string, field: keyof Row, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          if (field === 'valueA' || field === 'valueB' || field === 'formula') {
            const valueA = parseFloat(updated.valueA) || 0;
            const valueB = parseFloat(updated.valueB) || 0;
            updated.result = evaluateFormula(updated.formula, valueA, valueB);
          }
          return updated;
        }
        return row;
      })
    );
  };

  const addRow = () => {
    const newRow: Row = {
      id: Date.now().toString(),
      description: '',
      valueA: '',
      valueB: '',
      formula: '',
      result: '',
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Dynamic Formula Evaluator</ThemedText>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, { flex: 1.5 }]}>Description</Text>
          <Text style={[styles.columnHeader, { flex: 1 }]}>Value A</Text>
          <Text style={[styles.columnHeader, { flex: 1 }]}>Value B</Text>
          <Text style={[styles.columnHeader, { flex: 1.2 }]}>Formula</Text>
          <Text style={[styles.columnHeader, { flex: 1 }]}>Result</Text>
          <Text style={[styles.columnHeader, { flex: 0.6 }]}></Text>
        </View>

        {rows.map((row) => (
          <View key={row.id} style={styles.tableRow}>
            <TextInput
              style={[styles.input, { flex: 1.5 }]}
              placeholder="Description"
              value={row.description}
              onChangeText={(value) => updateRow(row.id, 'description', value)}
              placeholderTextColor={isDark ? '#999' : '#ccc'}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="0"
              value={row.valueA}
              onChangeText={(value) => updateRow(row.id, 'valueA', value)}
              keyboardType="decimal-pad"
              placeholderTextColor={isDark ? '#999' : '#ccc'}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="0"
              value={row.valueB}
              onChangeText={(value) => updateRow(row.id, 'valueB', value)}
              keyboardType="decimal-pad"
              placeholderTextColor={isDark ? '#999' : '#ccc'}
            />
            <TextInput
              style={[styles.input, { flex: 1.2 }]}
              placeholder="A*B"
              value={row.formula}
              onChangeText={(value) => updateRow(row.id, 'formula', value)}
              placeholderTextColor={isDark ? '#999' : '#ccc'}
            />
            <View style={[styles.resultCell, { flex: 1 }]}>
              <ThemedText style={styles.resultText}>{row.result}</ThemedText>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeRow(row.id)}
              disabled={rows.length === 1}
            >
              <ThemedText style={styles.deleteBtnText}>✕</ThemedText>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={addRow}>
        <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
          + Add Row
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

// Workaround for Text component import
const Text = ThemedText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
  columnHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    gap: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 12,
    minHeight: 40,
    backgroundColor: '#E8F5E9',
    color: '#000',
  },
  resultCell: {
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
  },
  deleteBtn: {
    width: 32,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5252',
    borderRadius: 4,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
