import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent } from '../../api/events';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import ErrorMessage from '../../components/common/ErrorMessage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { EVENT_CATEGORIES } from '../../utils/constants';
import { Picker } from '@react-native-picker/picker';

const CreateEventScreen = ({ navigation }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    category: 'ACADEMIC',
    maxParticipants: '',
  });
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: (eventData) => createEvent(eventData),
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert(
          'Success',
          'Event created successfully! It will be visible after admin approval.',
          [
            {
              text: 'OK',
              onPress: () => {
                queryClient.invalidateQueries(['events']);
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        setError(response.message || 'Failed to create event');
      }
    },
    onError: (error) => {
      setError(error.message || 'An error occurred');
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }

    if (!formData.eventDate.trim()) {
      setError('Event date and time are required');
      return false;
    }

    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }

    if (!formData.maxParticipants || parseInt(formData.maxParticipants) <= 0) {
      setError('Please enter a valid number of participants');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const eventData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      eventDate: formData.eventDate.trim(),
      location: formData.location.trim(),
      category: formData.category,
      maxParticipants: parseInt(formData.maxParticipants),
    };

    createMutation.mutate(eventData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.formCard}>
            <Text style={styles.title}>Create New Event</Text>
            <Text style={styles.subtitle}>
              Your event will be submitted for admin approval
            </Text>

            {error && (
              <ErrorMessage
                message={error}
                onRetry={() => setError('')}
                retryText="Dismiss"
              />
            )}

            <Input
              label="Event Title *"
              value={formData.title}
              onChangeText={(value) => handleChange('title', value)}
              placeholder="Enter event title"
              editable={!createMutation.isPending}
            />

            <Input
              label="Description *"
              value={formData.description}
              onChangeText={(value) => handleChange('description', value)}
              placeholder="Describe your event"
              multiline
              numberOfLines={4}
              editable={!createMutation.isPending}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                  enabled={!createMutation.isPending}
                  style={styles.picker}
                >
                  {Object.keys(EVENT_CATEGORIES).map((key) => (
                    <Picker.Item
                      key={key}
                      label={EVENT_CATEGORIES[key]}
                      value={EVENT_CATEGORIES[key]}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <Input
              label="Event Date & Time *"
              value={formData.eventDate}
              onChangeText={(value) => handleChange('eventDate', value)}
              placeholder="YYYY-MM-DD HH:mm (e.g., 2025-01-15 14:30)"
              editable={!createMutation.isPending}
            />

            <Input
              label="Location *"
              value={formData.location}
              onChangeText={(value) => handleChange('location', value)}
              placeholder="Enter event location"
              editable={!createMutation.isPending}
            />

            <Input
              label="Max Participants *"
              value={formData.maxParticipants}
              onChangeText={(value) => handleChange('maxParticipants', value)}
              placeholder="Enter maximum number of participants"
              keyboardType="number-pad"
              editable={!createMutation.isPending}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Submit Event"
                onPress={handleSubmit}
                loading={createMutation.isPending}
                disabled={createMutation.isPending}
                style={styles.submitButton}
              />

              <Button
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="outline"
                disabled={createMutation.isPending}
                style={styles.cancelButton}
              />
            </View>

            <Text style={styles.note}>
              * All fields are required. Your event will be reviewed by an admin before being published.
            </Text>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    padding: 20,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    marginTop: 8,
  },
  submitButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 12,
  },
  note: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CreateEventScreen;
