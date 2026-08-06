import { Spacing } from '@/constants/theme';
import { NoteCard } from '@/features/renters/components/NoteCard';
import { useRenter } from '@/features/renters/hooks/useRenter';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';

export default function NotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { renter } = useRenter(Number(id));
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setLoading(true);
    try {
      // TODO: Implement note creation via rentersApi
      setNote('');
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Notes</Title>
        <View style={styles.inputRow}>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add a note..."
            style={styles.input}
            mode="outlined"
          />
          <Button mode="contained" onPress={handleAddNote} loading={loading} disabled={loading}>
            Add
          </Button>
        </View>
        <View style={styles.notesList}>
          {renter && (renter as any).notes_list && (renter as any).notes_list.length > 0 ? (
            (renter as any).notes_list.map((n: any) => <NoteCard key={n.id} note={n} />)
          ) : (
            <Text style={styles.emptyText}>No notes yet.</Text>
          )}
        </View>
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  input: {
    flex: 1,
  },
  notesList: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    color: '#6b7280',
  },
});
